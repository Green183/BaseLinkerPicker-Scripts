(function () {
    'use strict';

    const STYLE_ID = 'bl-product-formatting-style';

    const css = `
        .cell_product_name,
        .cell_container_product_quantity,
        .cell_container_product_name {
            font-size: 11pt !important;
            font-weight: normal !important;
        }

        .custom_lbl_sku {
            font-size: 16pt !important;
            font-weight: bold !important;
            color: #0056b3 !important;
            display: inline-block;
        }

        .custom_lbl_ean {
            color: #000000 !important;
            font-weight: normal !important;
            font-size: 9.5pt !important;
            display: inline-block;
            margin-left: 10px;
        }
    `;

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = css;

        (document.head || document.documentElement).appendChild(style);
    }

    function processElement(el) {

        if (el.dataset.productFormattingProcessed === 'true') {
            return;
        }

        let html = el.innerHTML;

        const skuRegex = /(SKU:\s*)([A-Za-z0-9._+\/-]+)/;
        const eanRegex = /(EAN:\s*)([0-9]+)/;

        let modified = false;

        const skuMatch = html.match(skuRegex);

        if (skuMatch) {

            const fullSku = skuMatch[2];
            const shortenedSku = fullSku.slice(-5);

            // Zachowujemy pełne SKU dla skryptu lokalizacji.
            el.dataset.fullSku = fullSku;

            html = html.replace(
                skuRegex,
                `<span
                    class="custom_lbl_sku"
                    data-full-sku="${fullSku}"
                    title="Pełne SKU: ${fullSku}"
                >SKU: ${shortenedSku}</span>`
            );

            modified = true;
        }

        if (eanRegex.test(html)) {

            html = html.replace(
                eanRegex,
                function (match, prefix, ean) {
                    return `<span class="custom_lbl_ean">EAN: ${ean}</span>`;
                }
            );

            modified = true;
        }

        if (modified) {
            el.innerHTML = html;
        }

        el.dataset.productFormattingProcessed = 'true';
    }

    function updateProducts() {

        document
            .querySelectorAll(
                '.cell_container_product_desc, [class*="product_desc"]'
            )
            .forEach(processElement);
    }

    function start() {

        injectStyle();
        updateProducts();

        const observer = new MutationObserver(function (mutations) {

            for (const mutation of mutations) {

                if (mutation.addedNodes.length > 0) {
                    updateProducts();
                    break;
                }
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    start();

})();