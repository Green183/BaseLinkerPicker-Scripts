(function () {
    'use strict';

    const style = document.createElement('style');

    style.textContent = `
        a.product_pick_pack_quantity,
        a.dropdown-toggle,
        img.img_thumb {
            animation: none !important;
            transition: none !important;
        }
    `;

    (document.head || document.documentElement).appendChild(style);
})();