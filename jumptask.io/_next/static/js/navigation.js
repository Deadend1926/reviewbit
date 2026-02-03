// Navigation Dropdown Script - Converts static buttons to functional dropdowns
document.addEventListener('DOMContentLoaded', function() {
  // Find the navigation container
  const navContainer = document.querySelector('.css-1y17kb0');
  if (!navContainer) return;

  // Define dropdown menus content
  const dropdownData = {
    'Earn money': {
      items: [
        { title: 'Explore all microtasks', href: 'jumptask-microtasks/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_microtasks.svg' },
        { title: 'Social media tasks', href: 'social-media-tasks/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/11/SocialMedia.svg' },
        { title: 'Watch videos', href: 'get-paid-to-watch-videos/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2024/03/VideoWatching.svg' },
        { title: 'Take surveys', href: 'get-paid-take-surveys/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/11/Surveys-1.svg' },
        { title: 'Play games', href: 'get-paid-play-games/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/11/Games.svg' },
        { title: 'Sell internet data', href: 'sell-internet-data/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/11/InternetSharing.svg' },
        { title: 'Test products', href: 'get-paid-to-test-products/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/11/ApplicationTesting.svg' },
        { title: 'Make translations', href: 'get-paid-to-translate-online/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_translate.svg' },
        { title: 'Train AI', href: 'get-paid-to-train-ai/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/11/AiTraining.svg' },
        { title: 'Download apps', href: 'get-paid-to-download-apps/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_download.svg' }
      ]
    },
    'How it works': {
      items: [
        { title: 'How to earn', desc: 'Learn how to make money while completing small tasks', href: 'how-does-jumptask-work/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_earn.svg' },
        { title: 'JMPT token', desc: 'Learn what JMPT is, how to earn it, and what you can do with it', href: 'jmpt-token/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_token.svg' },
        { title: 'Reviews', desc: 'See what real users are saying about their experience with Reviewbit', href: 'reviews/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_reviews.svg' }
      ]
    },
    'For business': {
      items: [
        { title: 'Get in touch', desc: 'Reach out to our team for personalized solutions', href: 'contact-form/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_contact.svg' },
        { title: 'Explore all services', desc: 'Explore tailored solutions to help your business grow and succeed', href: 'become-a-partner/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_services.svg' }
      ]
    },
    'Learn': {
      items: [
        { title: 'Blog', desc: 'Stay updated on Reviewbit, insights, gig economy, and crypto news', href: 'blog/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_blog.svg' },
        { title: 'Help', desc: 'Access our help center for any inquiries or assistance you may need', href: 'https://support.jumptask.io/hc/en-gb', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_help.svg', external: true },
        { title: 'Litepaper', desc: 'Explore Reviewbit: project details, tokenomics, team and more', href: 'litepaper/index.html', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_litepaper.svg' },
        { title: 'Whitepaper', desc: 'Dive into the technical details and vision behind Reviewbit', href: 'https://docs.jumptask.io/whitepaper/jumptask-whitepaper', icon: 'https://webassets-wordpress-prod.jumptask.io/uploads/2023/09/icon_whitepaper.svg', external: true }
      ]
    }
  };

  // Calculate base path based on current page depth
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

  // Create dropdown HTML
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

  // Clear existing buttons and add dropdowns
  navContainer.innerHTML = '';

  Object.keys(dropdownData).forEach(name => {
    const dropdown = createDropdown(name, dropdownData[name]);
    navContainer.appendChild(dropdown);
  });
});
