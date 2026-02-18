#!/usr/bin/env python3
"""
Fix all remote image URLs (webassets-wordpress-prod.jumptask.io) in HTML files.
1. Collect all unique remote image URLs from all HTML files
2. Download missing images to _next/image/
3. Replace remote URLs with correct relative local paths
"""

import os
import re
import sys
import urllib.request
import urllib.error
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(r"C:\Users\rites\Downloads\code\WithSantosh\ReviewBit\jumptest_io\jumptask.io")
IMAGE_DIR = BASE_DIR / "_next" / "image"
REMOTE_BASE = "https://webassets-wordpress-prod.jumptask.io"

# Pattern to find all remote image URLs in src= attributes
# Matches: src="https://webassets-wordpress-prod.jumptask.io/..."
URL_PATTERN = re.compile(
    r'(src=")https://webassets-wordpress-prod\.jumptask\.io(/uploads/[^"]+)(")',
    re.IGNORECASE
)

def get_relative_prefix(html_file: Path) -> str:
    """Calculate the ../ prefix needed to reach the site root from this file."""
    # Get relative path of the file from BASE_DIR
    rel = html_file.relative_to(BASE_DIR)
    # Number of directory levels = number of parts minus 1 (for the filename itself)
    depth = len(rel.parts) - 1
    if depth == 0:
        return ""
    return "../" * depth

def collect_all_remote_urls():
    """Scan all HTML files and collect unique remote image URLs."""
    url_to_files = defaultdict(list)  # url_path -> list of html files

    for html_file in BASE_DIR.rglob("*.html"):
        try:
            content = html_file.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            print(f"  ERROR reading {html_file}: {e}")
            continue

        for match in URL_PATTERN.finditer(content):
            url_path = match.group(2)  # e.g., /uploads/2023/11/SocialMedia.svg
            full_url = REMOTE_BASE + url_path
            url_to_files[full_url].append(html_file)

    return url_to_files

def get_local_filename(url_path: str) -> str:
    """Extract just the filename from a URL path."""
    return url_path.rstrip("/").split("/")[-1]

def download_image(url: str, dest_path: Path) -> bool:
    """Download an image from url to dest_path. Returns True on success."""
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read()
        dest_path.write_bytes(data)
        return True
    except urllib.error.HTTPError as e:
        print(f"    HTTP {e.code} for {url}")
        return False
    except Exception as e:
        print(f"    ERROR downloading {url}: {e}")
        return False

def main():
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)

    # Step 1: Collect all remote URLs
    print("Step 1: Scanning all HTML files for remote image URLs...")
    url_to_files = collect_all_remote_urls()

    unique_urls = sorted(url_to_files.keys())
    print(f"  Found {len(unique_urls)} unique remote image URLs across {sum(len(v) for v in url_to_files.values())} occurrences")

    # Step 2: Build a map of filename -> local path for existing images
    print("\nStep 2: Checking existing local images...")
    existing_images = {}  # lowercase filename -> actual Path
    for f in IMAGE_DIR.iterdir():
        if f.is_file():
            existing_images[f.name.lower()] = f
    print(f"  Found {len(existing_images)} existing local images")

    # Step 3: Download missing images
    print("\nStep 3: Downloading missing images...")
    url_to_local_filename = {}  # full_url -> local filename in _next/image/

    downloaded = 0
    skipped = 0
    failed = 0

    for url in unique_urls:
        url_path = url.replace(REMOTE_BASE, "")
        filename = get_local_filename(url_path)
        local_path = IMAGE_DIR / filename

        if filename.lower() in existing_images:
            # Already exists locally
            actual_local = existing_images[filename.lower()]
            url_to_local_filename[url] = actual_local.name
            skipped += 1
        else:
            # Need to download
            print(f"  Downloading: {filename}")
            success = download_image(url, local_path)
            if success:
                url_to_local_filename[url] = filename
                existing_images[filename.lower()] = local_path
                downloaded += 1
                print(f"    -> Saved to _next/image/{filename}")
            else:
                # Mark as failed but still record URL so we can try to substitute
                url_to_local_filename[url] = None
                failed += 1

    print(f"\n  Downloaded: {downloaded}, Already existed: {skipped}, Failed: {failed}")

    # Step 4: Update all HTML files
    print("\nStep 4: Updating HTML files with local image paths...")

    files_updated = 0
    total_replacements = 0

    for html_file in sorted(BASE_DIR.rglob("*.html")):
        try:
            content = html_file.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            print(f"  ERROR reading {html_file}: {e}")
            continue

        if "webassets-wordpress-prod.jumptask.io" not in content:
            continue

        prefix = get_relative_prefix(html_file)
        replacements_in_file = 0
        new_content = content

        def replace_url(match):
            nonlocal replacements_in_file
            attr_start = match.group(1)  # src="
            url_path = match.group(2)    # /uploads/...
            attr_end = match.group(3)    # "

            full_url = REMOTE_BASE + url_path
            local_filename = url_to_local_filename.get(full_url)

            if local_filename:
                replacements_in_file += 1
                local_ref = f"{prefix}_next/image/{local_filename}"
                return f'{attr_start}{local_ref}{attr_end}'
            else:
                # Keep original if download failed
                return match.group(0)

        new_content = URL_PATTERN.sub(replace_url, content)

        if new_content != content:
            html_file.write_text(new_content, encoding="utf-8")
            files_updated += 1
            total_replacements += replacements_in_file
            rel_path = html_file.relative_to(BASE_DIR)
            print(f"  Updated ({replacements_in_file:3d} imgs): {rel_path}")

    print(f"\nDone! Updated {files_updated} files with {total_replacements} total image replacements.")
    if failed > 0:
        print(f"WARNING: {failed} images failed to download — those URLs were left unchanged.")

if __name__ == "__main__":
    main()
