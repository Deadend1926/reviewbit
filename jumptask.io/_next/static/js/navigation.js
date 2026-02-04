// Centralized Components Script - Header Logo, Navigation & Footer
// All shared UI components are managed here so changes apply to every page.
document.addEventListener('DOMContentLoaded', function() {

  // ===== BASE PATH UTILITY =====
  // Calculates relative path prefix based on current page depth
  function getBasePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    let basePath = '';
    for (let i = 0; i < depth; i++) {
      basePath += '../';
    }
    return basePath;
  }

  const basePath = getBasePath();

  // ===== HEADER LOGO (Centralized) =====
  // Update this section to change the logo across all pages
  function fixHeaderLogo() {
    const header = document.querySelector('header');
    if (!header) return;

    // Find the logo image inside the header
    const logoImg = header.querySelector('img[alt*="logo" i]');
    if (!logoImg) return;

    // Set the centralized logo
    logoImg.src = basePath + '_next/image/Reviewbit_Logo1.png';
    logoImg.alt = 'Reviewbit logo';

    // Fix the logo link to always point to home
    const logoLink = logoImg.closest('a');
    if (logoLink) {
      logoLink.href = basePath + 'index.html';
    }
  }

  fixHeaderLogo();

  // ===== VIEWPORT META TAG FIX =====
  // Ensures proper scaling on all mobile devices
  var viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
  }

  // ===== NAVIGATION DROPDOWNS (Centralized) =====
  // Update this section to change navigation menus across all pages
  const iconBase = basePath + '_next/static/icons/';
  const dropdownData = {
    'Earn money': {
      items: [
        { title: 'Explore all microtasks', href: 'jumptask-microtasks/index.html', icon: iconBase + 'icon_microtasks.svg' },
        { title: 'Social media tasks', href: 'social-media-tasks/index.html', icon: iconBase + 'SocialMedia.svg' },
        { title: 'Watch videos', href: 'get-paid-to-watch-videos/index.html', icon: iconBase + 'VideoWatching.svg' },
        { title: 'Take surveys', href: 'get-paid-take-surveys/index.html', icon: iconBase + 'Surveys-1.svg' },
        { title: 'Play games', href: 'get-paid-play-games/index.html', icon: iconBase + 'Games.svg' },
        { title: 'Sell internet data', href: 'sell-internet-data/index.html', icon: iconBase + 'InternetSharing.svg' },
        { title: 'Test products', href: 'get-paid-to-test-products/index.html', icon: iconBase + 'ApplicationTesting.svg' },
        { title: 'Make translations', href: 'get-paid-to-translate-online/index.html', icon: iconBase + 'icon_translate.svg' },
        { title: 'Train AI', href: 'get-paid-to-train-ai/index.html', icon: iconBase + 'AiTraining.svg' },
        { title: 'Download apps', href: 'get-paid-to-download-apps/index.html', icon: iconBase + 'icon_download.svg' }
      ]
    },
    'How it works': {
      items: [
        { title: 'How to earn', desc: 'Learn how to make money while completing small tasks', href: 'how-does-jumptask-work/index.html', icon: iconBase + 'icon_earn.svg' },
        { title: 'JMPT token', desc: 'Learn what JMPT is, how to earn it, and what you can do with it', href: 'jmpt-token/index.html', icon: iconBase + 'icon_token.svg' },
        { title: 'Reviews', desc: 'See what real users are saying about their experience with Reviewbit', href: 'reviews/index.html', icon: iconBase + 'icon_reviews.svg' }
      ]
    },
    'For business': {
      items: [
        { title: 'Get in touch', desc: 'Reach out to our team for personalized solutions', href: 'contact-form/index.html', icon: iconBase + 'icon_contact.svg' },
        { title: 'Explore all services', desc: 'Explore tailored solutions to help your business grow and succeed', href: 'become-a-partner/index.html', icon: iconBase + 'icon_services.svg' }
      ]
    },
    'Learn': {
      items: [
        { title: 'Blog', desc: 'Stay updated on Reviewbit, insights, gig economy, and crypto news', href: 'blog/index.html', icon: iconBase + 'icon_blog.svg' },
        { title: 'Help', desc: 'Access our help center for any inquiries or assistance you may need', href: 'https://support.jumptask.io/hc/en-gb', icon: iconBase + 'icon_help.svg', external: true },
        { title: 'Litepaper', desc: 'Explore Reviewbit: project details, tokenomics, team and more', href: 'litepaper/index.html', icon: iconBase + 'icon_litepaper.svg' },
        { title: 'Whitepaper', desc: 'Dive into the technical details and vision behind Reviewbit', href: 'https://docs.jumptask.io/whitepaper/jumptask-whitepaper', icon: iconBase + 'icon_whitepaper.svg', external: true }
      ]
    }
  };

  function createDropdown(name, data) {
    const dropdown = document.createElement('div');
    dropdown.className = 'nav-dropdown';

    const btn = document.createElement('button');
    btn.className = 'nav-dropdown-btn';
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('type', 'button');
    btn.innerHTML = `
      ${name}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
      </svg>
    `;

    const content = document.createElement('div');
    content.className = 'nav-dropdown-content';

    data.items.forEach(item => {
      const link = document.createElement('a');
      const href = item.external ? item.href : basePath + item.href;
      link.href = href;
      if (item.external) link.target = '_blank';

      if (item.desc) {
        link.innerHTML = `
          <img src="${item.icon}" alt="${item.title}" />
          <div class="menu-item-text">
            <span class="menu-item-title">${item.title}</span>
            <span class="menu-item-desc">${item.desc}</span>
          </div>
        `;
      } else {
        link.innerHTML = `
          <img src="${item.icon}" alt="${item.title}" />
          <span class="menu-item-title">${item.title}</span>
        `;
      }

      content.appendChild(link);
    });

    dropdown.appendChild(btn);
    dropdown.appendChild(content);

    return dropdown;
  }

  const navContainer = document.querySelector('.css-1y17kb0');
  if (navContainer) {
    navContainer.innerHTML = '';
    Object.keys(dropdownData).forEach(name => {
      const dropdown = createDropdown(name, dropdownData[name]);
      navContainer.appendChild(dropdown);
    });
  }

  // ===== DESKTOP DROPDOWN TOUCH/CLICK SUPPORT =====
  // Makes dropdowns work on touch devices alongside hover
  function setupDropdownClickToggle() {
    var dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(function(dropdown) {
      var btn = dropdown.querySelector('.nav-dropdown-btn');
      if (!btn) return;

      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var isActive = dropdown.classList.contains('active');

        // Close all other dropdowns first
        dropdowns.forEach(function(d) { d.classList.remove('active'); });

        // Toggle this one
        if (!isActive) {
          dropdown.classList.add('active');
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
      document.querySelectorAll('.nav-dropdown.active').forEach(function(d) {
        d.classList.remove('active');
      });
    });
  }

  setupDropdownClickToggle();

  // ===== MOBILE NAVIGATION DRAWER =====
  // Creates a slide-in menu for screens < 900px
  function buildMobileMenu() {
    // Create backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'mobile-menu-backdrop';

    // Create mobile menu panel
    var menu = document.createElement('div');
    menu.className = 'mobile-menu';

    // Menu header with logo and close button
    var menuHeader = document.createElement('div');
    menuHeader.className = 'mobile-menu-header';

    var logoLink = document.createElement('a');
    logoLink.href = basePath + 'index.html';
    var logoImg = document.createElement('img');
    logoImg.src = basePath + '_next/image/Reviewbit_Logo1.png';
    logoImg.alt = 'Reviewbit logo';
    logoLink.appendChild(logoImg);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-menu-close';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

    menuHeader.appendChild(logoLink);
    menuHeader.appendChild(closeBtn);
    menu.appendChild(menuHeader);

    // Menu content (accordion sections from dropdownData)
    var menuContent = document.createElement('div');
    menuContent.className = 'mobile-menu-content';

    Object.keys(dropdownData).forEach(function(sectionName) {
      var sectionData = dropdownData[sectionName];
      var section = document.createElement('div');
      section.className = 'mobile-nav-section';

      // Section header (accordion trigger)
      var header = document.createElement('button');
      header.className = 'mobile-nav-section-header';
      header.innerHTML = sectionName + '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>';

      // Section links
      var linksDiv = document.createElement('div');
      linksDiv.className = 'mobile-nav-section-links';

      sectionData.items.forEach(function(item) {
        var a = document.createElement('a');
        a.href = item.external ? item.href : basePath + item.href;
        if (item.external) a.target = '_blank';

        var linkHTML = '<img src="' + item.icon + '" alt="' + item.title + '" />';
        if (item.desc) {
          linkHTML += '<div class="mobile-link-text"><span class="mobile-link-title">' + item.title + '</span><span class="mobile-link-desc">' + item.desc + '</span></div>';
        } else {
          linkHTML += '<span class="mobile-link-title">' + item.title + '</span>';
        }
        a.innerHTML = linkHTML;

        // Close menu when a link is clicked
        a.addEventListener('click', function() {
          closeMobileMenu();
        });

        linksDiv.appendChild(a);
      });

      // Accordion toggle
      header.addEventListener('click', function() {
        var isExpanded = section.classList.contains('expanded');
        // Close all other sections
        menuContent.querySelectorAll('.mobile-nav-section').forEach(function(s) {
          s.classList.remove('expanded');
        });
        // Toggle this section
        if (!isExpanded) {
          section.classList.add('expanded');
        }
      });

      section.appendChild(header);
      section.appendChild(linksDiv);
      menuContent.appendChild(section);
    });

    menu.appendChild(menuContent);

    // Add to document
    document.body.appendChild(backdrop);
    document.body.appendChild(menu);

    // Open / close functions
    function openMobileMenu() {
      menu.classList.add('open');
      backdrop.classList.add('open');
      document.body.classList.add('mobile-menu-open');
    }

    function closeMobileMenu() {
      menu.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.classList.remove('mobile-menu-open');
    }

    // Wire close button
    closeBtn.addEventListener('click', closeMobileMenu);

    // Wire backdrop click to close
    backdrop.addEventListener('click', closeMobileMenu);

    // Wire hamburger button(s) to open menu
    var hamburgerBtns = document.querySelectorAll('.MuiIconButton-root[data-testid="MenuIcon"], button:has(svg[data-testid="MenuIcon"])');
    if (hamburgerBtns.length === 0) {
      // Fallback: find the button that contains the MenuIcon SVG
      var menuIcons = document.querySelectorAll('svg[data-testid="MenuIcon"]');
      menuIcons.forEach(function(icon) {
        var btn = icon.closest('button');
        if (btn) {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openMobileMenu();
          });
        }
      });
    } else {
      hamburgerBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          openMobileMenu();
        });
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  buildMobileMenu();

  // ===== FOOTER (Centralized) =====
  // Update this section to change footer links/content across all pages
  function fixFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    // --- Centralized footer link data ---
    // To add/remove/change footer links, edit this array only.
    const footerSections = [
      {
        title: 'DISCOVER',
        links: [
          { text: 'Earn free money', href: 'free-money-in-seconds/index.html' },
          { text: 'Money earning app', href: 'money-earning-app/index.html' },
          { text: 'Task earning app', href: 'task-earning-app/index.html' },
          { text: 'Is Reviewbit legit?', href: 'is-jumptask-legit/index.html' }
        ]
      },
      {
        title: 'WAYS TO EARN',
        links: [
          { text: 'All microtasks', href: 'jumptask-microtasks/index.html' },
          { text: 'Watch videos', href: 'get-paid-to-watch-videos/index.html' },
          { text: 'Take surveys', href: 'get-paid-take-surveys/index.html' },
          { text: 'Play games', href: 'get-paid-play-games/index.html' },
          { text: 'Sell internet data', href: 'sell-internet-data/index.html' },
          { text: 'Test products', href: 'get-paid-to-test-products/index.html' },
          { text: 'Make translations', href: 'get-paid-to-translate-online/index.html' }
        ]
      },
      {
        title: 'COMPANY',
        links: [
          { text: 'About us', href: 'about-us/index.html' },
          { text: 'Contact us', href: 'contact-us/index.html' },
          { text: 'Terms of service', href: 'user-agreement/index.html' },
          { text: 'Privacy policy', href: 'privacy-policy/index.html' }
        ]
      },
      {
        title: 'RESOURCES',
        links: [
          { text: 'Blog', href: 'blog/index.html' },
          { text: 'Help', href: 'https://support.jumptask.io/hc/en-gb', external: true },
          { text: 'Litepaper', href: 'litepaper/index.html' },
          { text: 'Whitepaper', href: 'https://docs.jumptask.io/whitepaper/jumptask-whitepaper', external: true },
          { text: 'Audit', href: 'https://github.com/Quillhash/QuillAudit_Reports/blob/master/JumpToken%20Audit%20Report%20-%20QuillAudits.pdf', external: true }
        ]
      },
      {
        title: 'FOR BUSINESS',
        links: [
          { text: 'Advertise with us', href: 'https://acquirox.com/', external: true },
          { text: 'Get website traffic', href: 'buy-website-traffic/index.html' },
          { text: 'Get X followers', href: 'buy-twitter-followers/index.html' },
          { text: 'Get YouTube likes', href: 'buy-youtube-likes/index.html' },
          { text: 'Get in touch', href: 'contact-form/index.html' }
        ]
      }
    ];

    // --- Centralized social links ---
    const socialLinks = [
      { icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_x.svg', href: '#', alt: 'X (Twitter)' },
      { icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_discord.svg', href: '#', alt: 'Discord' },
      { icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_telegram.svg', href: '#', alt: 'Telegram' },
      { icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_facebook.svg', href: '#', alt: 'Facebook' },
      { icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_instagram.svg', href: '#', alt: 'Instagram' },
      { icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_medium.svg', href: '#', alt: 'Medium' },
      { icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_youtube.svg', href: '#', alt: 'YouTube' }
    ];

    // Rebuild footer link sections
    var linkGrid = footer.querySelector('.css-umxjjy');
    if (!linkGrid) {
      // Fallback: find the nested MuiGrid2-container inside footer
      var containers = footer.querySelectorAll('.MuiGrid2-container');
      if (containers.length >= 2) linkGrid = containers[1];
    }

    if (linkGrid) {
      // Preserve <style> blocks so CSS isn't lost
      var styles = Array.from(linkGrid.querySelectorAll('style'));
      linkGrid.innerHTML = '';
      styles.forEach(function(s) { linkGrid.appendChild(s); });

      // Build each link section
      footerSections.forEach(function(section) {
        var gridItem = document.createElement('div');
        gridItem.className = 'MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-5 MuiGrid2-grid-sm-3.5 MuiGrid2-grid-md-2 css-8i8r46';

        var title = document.createElement('div');
        title.className = 'MuiTypography-root MuiTypography-body1 css-4z98n5';
        title.textContent = section.title;

        var linkStack = document.createElement('div');
        linkStack.className = 'MuiStack-root css-1v8my8o';

        section.links.forEach(function(link) {
          var a = document.createElement('a');
          a.className = 'css-ectypu';
          a.href = link.external ? link.href : basePath + link.href;
          if (link.external) a.target = '_blank';
          a.textContent = link.text;
          linkStack.appendChild(a);
        });

        gridItem.appendChild(title);
        gridItem.appendChild(linkStack);
        linkGrid.appendChild(gridItem);
      });
    }

    // Fix copyright text
    var copyrightEl = footer.querySelector('.MuiTypography-body2');
    if (copyrightEl) {
      copyrightEl.innerHTML = '\u00A9 2026, Reviewbit. <a class="css-ectypu" href="' + basePath + 'privacy-policy/index.html">Terms &amp; Privacy policy.</a>';
    }

    // Rebuild social icons
    var socialContainer = footer.querySelector('.css-kl5uk3');
    if (socialContainer) {
      socialContainer.innerHTML = '';
      socialLinks.forEach(function(social) {
        var a = document.createElement('a');
        a.target = '_blank';
        a.className = 'css-ectypu';
        a.href = social.href;
        a.innerHTML = '<img alt="' + social.alt + '" loading="lazy" width="1" height="1" decoding="async" style="width:100%;height:auto" src="' + social.icon + '" />';
        socialContainer.appendChild(a);
      });
    }
  }

  fixFooter();
});
