(function () {
    'use strict';

    function hideBottomButtons() {
        const container = document.querySelector(
            '#pick_pack_buttons_container'
        );

        if (container) {
            container.style.display = 'none';
        }
    }

    const observer = new MutationObserver(() => {
        hideBottomButtons();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    hideBottomButtons();
})();