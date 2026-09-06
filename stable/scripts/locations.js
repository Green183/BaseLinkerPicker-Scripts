(function () {
    'use strict';

    const STYLE_ID = 'bl-locations-style';

    const LOCATOR_URL =
        'https://bl-locator.vercel.app/';

    const LOCATOR_ORIGIN =
        'https://bl-locator.vercel.app';

    const css = `

        .locations_container i {
            display: none !important;
        }

        .locations_container .lbl_location,
        .lbl_location {

            font-size: 9pt !important;

            padding: 2px 6px !important;

            line-height: 1.2 !important;

            margin-top: 2px !important;

            display: inline-block !important;

            cursor: pointer !important;

            transition: opacity 0.15s ease-in-out;

            background-color: #f1f5f9 !important;

            border: 1px solid #cbd5e1 !important;

            border-radius: 4px !important;

            color: #334155 !important;
        }

        .lbl_location:hover {
            opacity: 0.85 !important;
        }

        .lbl_no_location {

            background-color: #6c757d !important;

            color: #ffffff !important;

            border: none !important;

            border-radius: 4px !important;

            font-weight: bold !important;
        }
    `;


    // =========================================================
    // CSS
    // =========================================================

    function injectStyle() {

        if (
            document.getElementById(
                STYLE_ID
            )
        ) {
            return;
        }


        const style =
            document.createElement(
                'style'
            );


        style.id =
            STYLE_ID;


        style.textContent =
            css;


        (
            document.head ||
            document.documentElement
        ).appendChild(
            style
        );
    }


    // =========================================================
    // POBIERANIE PEŁNEGO SKU
    // =========================================================

    function getFullSku(el) {

        if (
            el.dataset.fullSku
        ) {
            return el.dataset.fullSku;
        }


        const skuElement =
            el.querySelector(
                '.custom_lbl_sku'
            );


        if (
            skuElement?.dataset?.fullSku
        ) {

            return skuElement
                .dataset
                .fullSku;
        }


        // Fallback, gdyby skrypt formatowania
        // był wyłączony.

        const text =
            el.textContent || '';


        const match =
            text.match(
                /SKU:\s*([A-Za-z0-9._+\/-]+)/
            );


        if (match) {
            return match[1];
        }


        return '';
    }


    // =========================================================
    // BRAK LOKALIZACJI
    // =========================================================

    function createFallbackBadge(
        container
    ) {

        if (!container) {
            return null;
        }


        const existing =
            container.querySelector(
                '.lbl_no_location'
            );


        if (existing) {
            return existing;
        }


        const badge =
            document.createElement(
                'span'
            );


        badge.className =
            'lbl_location lbl_no_location';


        badge.innerText =
            '[ BRAK LOKALIZACJI ]';


        container.appendChild(
            badge
        );


        return badge;
    }


    // =========================================================
    // ZAMKNIĘCIE MODALA
    // =========================================================

    function closeOverlay() {

        const overlay =
            document.getElementById(
                'mobile-location-overlay'
            );


        if (overlay) {
            overlay.remove();
        }
    }


    // =========================================================
    // OTWARCIE EDYTORA
    // =========================================================

    function openLocationEditor(
        badge,
        fullSku
    ) {

        const isFallback =
            badge.classList.contains(
                'lbl_no_location'
            );


        const currentLocation =
            isFallback
                ? ''
                : badge.innerText.trim();


        const targetUrl =
            LOCATOR_URL +
            '?sku=' +
            encodeURIComponent(fullSku) +
            '&loc=' +
            encodeURIComponent(currentLocation);


        document
            .querySelectorAll(
                '.active-editing-location'
            )
            .forEach(
                function (element) {

                    element.classList.remove(
                        'active-editing-location'
                    );
                }
            );


        badge.classList.add(
            'active-editing-location'
        );


        // =====================================================
        // KOMUNIKACJA Z BL-LOCATOR
        // =====================================================

        const messageHandler =
            function (event) {


                // Ignorujemy wiadomości
                // z innych domen.

                if (
                    event.origin !==
                    LOCATOR_ORIGIN
                ) {

                    return;
                }


                const data =
                    event.data;


                const isClose =
                    data ===
                    'closeLocationModal';


                const isDelete =
                    data ===
                    'locationDeleted' ||
                    (
                        data &&
                        data.type ===
                        'locationDeleted'
                    );


                const isUpdate =
                    data ===
                    'locationUpdated' ||
                    (
                        data &&
                        data.type ===
                        'locationUpdated'
                    );


                if (
                    !isClose &&
                    !isDelete &&
                    !isUpdate &&
                    !(data && data.newLocation)
                ) {

                    return;
                }


                closeOverlay();


                const currentBadge =
                    document.querySelector(
                        '.active-editing-location'
                    );


                if (!currentBadge) {

                    window.removeEventListener(
                        'message',
                        messageHandler
                    );

                    return;
                }


                const parentContainer =
                    currentBadge.parentNode;


                // =============================================
                // USUNIĘCIE LOKALIZACJI
                // =============================================

                if (isDelete) {

                    currentBadge.remove();


                    if (
                        parentContainer &&
                        parentContainer.querySelectorAll(
                            '.lbl_location'
                        ).length === 0
                    ) {

                        const fallback =
                            createFallbackBadge(
                                parentContainer
                            );


                        if (fallback) {

                            bindBadge(
                                fallback,
                                fullSku
                            );
                        }
                    }
                }


                // =============================================
                // DODANIE / ZMIANA
                // =============================================

                else if (
                    data &&
                    data.newLocation
                ) {


                    // NOWA LOKALIZACJA

                    if (
                        data.isAdd
                    ) {

                        const newBadge =
                            document.createElement(
                                'span'
                            );


                        const templateBadge =
                            document.querySelector(
                                '.lbl_location:not(.lbl_no_location)'
                            );


                        if (
                            templateBadge
                        ) {

                            newBadge.className =
                                templateBadge.className;

                        } else {

                            newBadge.className =
                                'lbl_location label label-default';
                        }


                        newBadge.classList.remove(
                            'active-editing-location'
                        );


                        newBadge.classList.remove(
                            'lbl_no_location'
                        );


                        newBadge.innerText =
                            data.newLocation;


                        newBadge.style.marginLeft =
                            '5px';


                        currentBadge.parentNode
                            .insertBefore(
                                newBadge,
                                currentBadge.nextSibling
                            );


                        bindBadge(
                            newBadge,
                            fullSku
                        );


                        if (
                            currentBadge.classList.contains(
                                'lbl_no_location'
                            )
                        ) {

                            currentBadge.remove();
                        }
                    }


                    // EDYCJA ISTNIEJĄCEJ

                    else {

                        currentBadge.innerText =
                            data.newLocation;


                        currentBadge.classList.remove(
                            'lbl_no_location'
                        );


                        const templateBadge =
                            document.querySelector(
                                '.lbl_location:not(.lbl_no_location):not(.active-editing-location)'
                            );


                        if (
                            templateBadge
                        ) {

                            currentBadge.className =
                                templateBadge.className;

                        } else {

                            currentBadge.className =
                                'lbl_location label label-default';
                        }
                    }
                }


                if (
                    currentBadge &&
                    currentBadge.parentNode
                ) {

                    currentBadge.classList.remove(
                        'active-editing-location'
                    );
                }


                window.removeEventListener(
                    'message',
                    messageHandler
                );
            };


        window.addEventListener(
            'message',
            messageHandler
        );


        // =====================================================
        // ANDROID / MOBILE
        // =====================================================

        const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
                .test(
                    navigator.userAgent
                );


        if (isMobile) {

            if (
                document.getElementById(
                    'mobile-location-overlay'
                )
            ) {

                return;
            }


            const overlay =
                document.createElement(
                    'div'
                );


            overlay.id =
                'mobile-location-overlay';


            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;


            const modal =
                document.createElement(
                    'div'
                );


            modal.style.cssText = `
                position: relative;
                width: 92%;
                max-width: 500px;
                height: 320px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            `;


            const closeButton =
                document.createElement(
                    'button'
                );


            closeButton.innerText =
                '✕';


            closeButton.style.cssText = `
                position: absolute;
                top: 12px;
                right: 12px;
                z-index: 1000001;
                background: #ff4d4d;
                color: white;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                font-size: 14px;
                cursor: pointer;
                font-weight: bold;
            `;


            closeButton.onclick =
                function () {

                    overlay.remove();

                    badge.classList.remove(
                        'active-editing-location'
                    );


                    window.removeEventListener(
                        'message',
                        messageHandler
                    );
                };


            const iframe =
                document.createElement(
                    'iframe'
                );


            iframe.src =
                targetUrl;


            iframe.style.cssText =
                'width:100%;height:100%;border:none;';


            modal.appendChild(
                closeButton
            );


            modal.appendChild(
                iframe
            );


            overlay.appendChild(
                modal
            );


            document.body.appendChild(
                overlay
            );
        }


        // =====================================================
        // DESKTOP - ZOSTAWIAMY FALLBACK
        // =====================================================

        else {

            const width =
                600;


            const height =
                360;


            const left =
                (
                    window.screen.width / 2
                ) -
                (
                    width / 2
                );


            const top =
                (
                    window.screen.height / 2
                ) -
                (
                    height / 2
                );


            window.open(

                targetUrl,

                'ModyfikacjaLokalizacji',

                `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
            );
        }
    }


    // =========================================================
    // UZBRAJANIE KAFELKA
    // =========================================================

    function bindBadge(
        badge,
        fullSku
    ) {

        if (
            badge.dataset.locationBound ===
            'true'
        ) {
            return;
        }


        badge.dataset.locationBound =
            'true';


        badge.title =
            `Kliknij, aby edytować lokalizację dla SKU: ${fullSku}`;


        badge.addEventListener(
            'click',
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                openLocationEditor(
                    badge,
                    fullSku
                );
            }
        );
    }


    // =========================================================
    // PRODUKT
    // =========================================================

    function processProduct(
        el
    ) {

        const fullSku =
            getFullSku(el);


        if (!fullSku) {
            return;
        }


        let locationContainer =
            el.querySelector(
                '.locations_container'
            );


        if (
            !locationContainer
        ) {

            locationContainer =
                el
                    .closest('tr')
                    ?.querySelector(
                        '.locations_container'
                    );
        }


        if (
            !locationContainer
        ) {
            return;
        }


        let badges =
            locationContainer
                .querySelectorAll(
                    '.lbl_location'
                );


        if (
            badges.length === 0
        ) {

            const fallback =
                createFallbackBadge(
                    locationContainer
                );


            if (fallback) {

                bindBadge(
                    fallback,
                    fullSku
                );
            }


            return;
        }


        badges.forEach(
            function (badge) {

                bindBadge(
                    badge,
                    fullSku
                );
            }
        );
    }


    // =========================================================
    // SKANOWANIE DOM
    // =========================================================

    function updateProducts() {

        document
            .querySelectorAll(
                '.cell_container_product_desc, [class*="product_desc"]'
            )
            .forEach(
                processProduct
            );
    }


    // =========================================================
    // START
    // =========================================================

    function start() {

        injectStyle();

        updateProducts();


        const observer =
            new MutationObserver(
                function (mutations) {

                    for (
                        const mutation
                        of mutations
                    ) {

                        if (
                            mutation
                                .addedNodes
                                .length > 0
                        ) {

                            updateProducts();

                            break;
                        }
                    }
                }
            );


        observer.observe(
            document.documentElement,
            {
                childList: true,
                subtree: true
            }
        );
    }


    start();

})();