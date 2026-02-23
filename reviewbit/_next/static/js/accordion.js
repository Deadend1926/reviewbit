document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll('.MuiAccordionSummary-root');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var accordion = btn.closest('.MuiAccordion-root');
      if (!accordion) return;

      var isExpanded = btn.getAttribute('aria-expanded') === 'true';
      var collapseDiv = accordion.querySelector('.MuiCollapse-root');
      var iconWrapper = btn.querySelector('.MuiAccordionSummary-expandIconWrapper');

      if (isExpanded) {
        // Collapse
        btn.setAttribute('aria-expanded', 'false');
        accordion.classList.remove('Mui-expanded');
        btn.classList.remove('Mui-expanded');
        if (iconWrapper) iconWrapper.classList.remove('Mui-expanded');

        if (collapseDiv) {
          collapseDiv.style.height = collapseDiv.scrollHeight + 'px';
          // Force reflow then set to 0 for animation
          collapseDiv.offsetHeight;
          collapseDiv.style.height = '0px';
          collapseDiv.style.visibility = 'hidden';
          collapseDiv.classList.add('MuiCollapse-hidden');
        }
      } else {
        // Expand
        btn.setAttribute('aria-expanded', 'true');
        accordion.classList.add('Mui-expanded');
        btn.classList.add('Mui-expanded');
        if (iconWrapper) iconWrapper.classList.add('Mui-expanded');

        if (collapseDiv) {
          collapseDiv.classList.remove('MuiCollapse-hidden');
          collapseDiv.style.visibility = 'visible';
          collapseDiv.style.height = '0px';
          // Force reflow then expand
          collapseDiv.offsetHeight;
          var contentHeight = collapseDiv.scrollHeight;
          collapseDiv.style.height = contentHeight + 'px';

          // After transition ends, set height to auto so content can reflow
          collapseDiv.addEventListener('transitionend', function handler() {
            collapseDiv.removeEventListener('transitionend', handler);
            if (btn.getAttribute('aria-expanded') === 'true') {
              collapseDiv.style.height = 'auto';
            }
          });
        }
      }
    });
  });
});
