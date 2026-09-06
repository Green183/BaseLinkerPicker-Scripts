(function() {
    'use strict';

    const targetsToHide = [
        "Pakowanie",
        "Zwroty",
        "Dostawy",
        "Transfery",
        "Inwentaryzacje",
        "Ustawienia",
        "Wróć do panelu"
    ];

    function hideWmsButtons() {
        const actionNames = document.querySelectorAll('.wms-app-nav-item-action-name');

        actionNames.forEach(span => {
            const buttonText = span.textContent.trim();

            if (targetsToHide.includes(buttonText)) {
                const button = span.closest('button.wms-app-nav-item');

                if (button) {
                    button.style.display = 'none';
                }
            }
        });

        const divider = document.querySelector('.wms-app-nav-main hr.divider');

        if (divider) {
            divider.style.display = 'none';
        }
    }

    const observer = new MutationObserver(() => {
        hideWmsButtons();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    hideWmsButtons();
})();