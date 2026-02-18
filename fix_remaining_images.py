#!/usr/bin/env python3
"""
Fix the 12 images that were 404 on the server:
- 10 nav icon SVGs: create simple SVG icons locally
- Reviewbit.svg (litepaper): replace with ReviewBit_Logo1.png
- ReviewBit-micro-jobs.png (2 blog posts): replace with Revu.avif
"""

import re
from pathlib import Path

BASE_DIR = Path(r"C:\Users\rites\Downloads\code\WithSantosh\ReviewBit\jumptest_io\jumptask.io")
IMAGE_DIR = BASE_DIR / "_next" / "image"
REMOTE_BASE = "https://webassets-wordpress-prod.jumptask.io"

# --- Create simple SVG nav icons ---
# Each icon is 24x24, simple shapes in a neutral dark color (#4a4a4a)

SVG_ICONS = {
    "icon_translate.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
</svg>""",

    "icon_earn.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="M12 6v12M9 9h4.5a2 2 0 0 1 0 4H9a2 2 0 0 0 0 4H15"/>
</svg>""",

    "icon_token.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="12 2 19 6.5 19 17.5 12 22 5 17.5 5 6.5 12 2"/>
  <path d="M12 8v8M9 10h6"/>
</svg>""",

    "icon_reviews.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
</svg>""",

    "icon_contact.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="4" width="20" height="16" rx="2"/>
  <path d="M2 7l10 7 10-7"/>
</svg>""",

    "icon_services.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="7" height="7" rx="1"/>
  <rect x="14" y="3" width="7" height="7" rx="1"/>
  <rect x="3" y="14" width="7" height="7" rx="1"/>
  <rect x="14" y="14" width="7" height="7" rx="1"/>
</svg>""",

    "icon_blog.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <polyline points="14 2 14 8 20 8"/>
  <line x1="8" y1="13" x2="16" y2="13"/>
  <line x1="8" y1="17" x2="16" y2="17"/>
</svg>""",

    "icon_help.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
  <line x1="12" y1="17" x2="12.01" y2="17"/>
</svg>""",

    "icon_litepaper.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <polyline points="14 2 14 8 20 8"/>
  <line x1="8" y1="13" x2="16" y2="13"/>
  <line x1="8" y1="17" x2="12" y2="17"/>
</svg>""",

    "icon_whitepaper.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <polyline points="14 2 14 8 20 8"/>
  <line x1="8" y1="13" x2="16" y2="13"/>
  <line x1="8" y1="17" x2="16" y2="17"/>
  <line x1="8" y1="10" x2="9" y2="10"/>
</svg>""",
}

# Map of remote URL path → local filename to use
REPLACEMENTS = {}

# Add nav icons
for svg_name in SVG_ICONS:
    remote_path = f"/uploads/2023/09/{svg_name}"
    REPLACEMENTS[remote_path] = svg_name

# Special cases
REPLACEMENTS["/uploads/2023/12/Reviewbit.svg"] = "ReviewBit_Logo1.png"
REPLACEMENTS["/uploads/2025/11/ReviewBit-micro-jobs.png"] = "Revu.avif"

print("Step 1: Creating SVG nav icons...")
for svg_name, svg_content in SVG_ICONS.items():
    dest = IMAGE_DIR / svg_name
    dest.write_text(svg_content, encoding="utf-8")
    print(f"  Created: {svg_name}")

# Build full URL → local filename map
FULL_URL_MAP = {REMOTE_BASE + path: filename for path, filename in REPLACEMENTS.items()}

# Pattern to match remaining remote image URLs in src=
URL_PATTERN = re.compile(
    r'(src=")https://webassets-wordpress-prod\.jumptask\.io(/uploads/[^"]+)(")',
    re.IGNORECASE
)

def get_relative_prefix(html_file: Path) -> str:
    rel = html_file.relative_to(BASE_DIR)
    depth = len(rel.parts) - 1
    return "../" * depth

print("\nStep 2: Updating HTML files...")
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
    counter = [0]  # mutable container to track count inside closure

    def replace_url(match, _prefix=prefix, _counter=counter):
        url_path = match.group(2)
        full_url = REMOTE_BASE + url_path
        local_filename = FULL_URL_MAP.get(full_url)
        if local_filename:
            _counter[0] += 1
            return f'{match.group(1)}{_prefix}_next/image/{local_filename}{match.group(3)}'
        return match.group(0)

    new_content = URL_PATTERN.sub(replace_url, content)

    if new_content != content:
        html_file.write_text(new_content, encoding="utf-8")
        files_updated += 1
        total_replacements += counter[0]
        rel_path = html_file.relative_to(BASE_DIR)
        print(f"  Updated ({counter[0]:3d} imgs): {rel_path}")

print(f"\nDone! Updated {files_updated} files, {total_replacements} replacements.")

# Final check
remaining = 0
for html_file in BASE_DIR.rglob("*.html"):
    try:
        content = html_file.read_text(encoding="utf-8", errors="replace")
        if "webassets-wordpress-prod.jumptask.io" in content:
            remaining += 1
    except:
        pass

print(f"\nFiles still containing remote URLs: {remaining}")
