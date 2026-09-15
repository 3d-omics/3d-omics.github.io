/* Remove the ElectricBlaze free-plan promotion injected outside its widget.
 * The vendor mounts this banner directly under <body>, after cookie consent. */
(() => {
  'use strict';

  const removePromotion = () => {
    document.querySelectorAll('a[href*="electricblaze.com/twitter-feed"]').forEach((link) => {
      let element = link.parentElement;

      while (element && element !== document.body) {
        const paymentLink = element.querySelector('a[href="#buy"]');
        if (paymentLink?.textContent.trim() === 'Remove This Ad') {
          element.remove();
          break;
        }
        element = element.parentElement;
      }
    });
  };

  removePromotion();
  if (window.MutationObserver) {
    new MutationObserver(removePromotion).observe(document.body, { childList: true, subtree: true });
  }
})();
