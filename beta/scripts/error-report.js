(function () {
    'use strict';

    const BUTTON_ID = 'bl-error-report-button';
    const MODAL_ID = 'bl-error-report-modal';

    const TARGET_CONTAINER =
        '#pick_pack_sale_comments';


    // =========================================================
    // STYLE
    // =========================================================

    function addStyles() {

        if (document.getElementById('bl-error-report-style')) {
            return;
        }

        const style = document.createElement('style');

        style.id = 'bl-error-report-style';

        style.textContent = `

            #${BUTTON_ID} {
                background: #d9534f;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 7px 12px;
                margin-left: 10px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
            }

            #${BUTTON_ID}:active {
                transform: scale(0.97);
            }

            #${MODAL_ID} {
                position: fixed;
                inset: 0;
                z-index: 9999999;
                background: rgba(0,0,0,0.65);

                display: flex;
                align-items: center;
                justify-content: center;

                padding: 15px;
                box-sizing: border-box;
            }

            .bl-error-box {
                width: 100%;
                max-width: 440px;

                background: white;

                border-radius: 10px;

                padding: 20px;

                box-sizing: border-box;

                font-family: Arial, sans-serif;
            }

            .bl-error-box h2 {
                margin: 0 0 20px 0;
                font-size: 22px;
            }

            .bl-error-box label {
                display: block;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 6px;
            }

            .bl-error-box input,
            .bl-error-box textarea {

                width: 100%;

                box-sizing: border-box;

                border: 1px solid #ccc;
                border-radius: 6px;

                padding: 11px;

                font-size: 16px;

                margin-bottom: 16px;
            }

            .bl-error-box textarea {
                min-height: 100px;
                resize: vertical;
            }

            .bl-error-actions {

                display: flex;

                gap: 10px;
            }

            .bl-error-actions button {

                flex: 1;

                padding: 12px;

                border-radius: 6px;

                font-size: 15px;

                font-weight: bold;

                cursor: pointer;
            }

            .bl-error-cancel {

                background: #f1f1f1;

                border: 1px solid #ccc;
            }

            .bl-error-send {

                background: #d9534f;

                color: white;

                border: none;
            }

            .bl-error-send:disabled {

                opacity: 0.6;

                cursor: default;
            }

            .bl-error-status {

                margin-top: 15px;

                font-size: 14px;

                font-weight: bold;

                text-align: center;
            }
        `;

        (document.head || document.documentElement)
            .appendChild(style);
    }


    // =========================================================
    // PRZYCISK
    // =========================================================

    function injectButton() {

        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        const container =
            document.querySelector(TARGET_CONTAINER);

        if (!container) {
            return;
        }

        const button =
            document.createElement('button');

        button.id = BUTTON_ID;

        button.type = 'button';

        button.textContent =
            '⚠️ Zgłoś problem';


        button.addEventListener(
            'click',
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                openReportForm();
            }
        );


        container.appendChild(button);
    }


    // =========================================================
    // FORMULARZ
    // =========================================================

    function openReportForm() {

        if (document.getElementById(MODAL_ID)) {
            return;
        }


        const overlay =
            document.createElement('div');

        overlay.id = MODAL_ID;


        const box =
            document.createElement('div');

        box.className = 'bl-error-box';


        const title =
            document.createElement('h2');

        title.textContent =
            '⚠️ Zgłoszenie problemu';


        const skuLabel =
            document.createElement('label');

        skuLabel.textContent =
            'SKU lub REF';


        const skuInput =
            document.createElement('input');

        skuInput.type = 'text';

        skuInput.placeholder =
            'np. FHU-ABCDE-00234';


        const infoLabel =
            document.createElement('label');

        infoLabel.textContent =
            'Co jest nie tak?';


        const infoInput =
            document.createElement('textarea');

        infoInput.placeholder =
            'Np. kod nie działa, zła lokalizacja, błędny produkt...';


        const actions =
            document.createElement('div');

        actions.className =
            'bl-error-actions';


        const cancelButton =
            document.createElement('button');

        cancelButton.className =
            'bl-error-cancel';

        cancelButton.textContent =
            'Anuluj';


        const sendButton =
            document.createElement('button');

        sendButton.className =
            'bl-error-send';

        sendButton.textContent =
            'Wyślij';


        const status =
            document.createElement('div');

        status.className =
            'bl-error-status';


        cancelButton.addEventListener(
            'click',
            function () {

                overlay.remove();
            }
        );


        sendButton.addEventListener(
            'click',
            function () {

                const sku =
                    skuInput.value.trim();

                const info =
                    infoInput.value.trim();


                if (!sku) {

                    alert(
                        'Wpisz SKU lub REF.'
                    );

                    skuInput.focus();

                    return;
                }


                if (!info) {

                    alert(
                        'Napisz, na czym polega problem.'
                    );

                    infoInput.focus();

                    return;
                }


                if (
                    !window.AndroidReport ||
                    typeof window.AndroidReport.sendReport !== 'function'
                ) {

                    alert(
                        'Moduł wysyłania zgłoszeń jest niedostępny.'
                    );

                    return;
                }


                sendButton.disabled =
                    true;

                sendButton.textContent =
                    'Wysyłam...';

                status.textContent = '';


                window.AndroidReport.sendReport(
                    sku,
                    info,
                    window.location.href
                );
            }
        );


        actions.appendChild(
            cancelButton
        );

        actions.appendChild(
            sendButton
        );


        box.appendChild(
            title
        );

        box.appendChild(
            skuLabel
        );

        box.appendChild(
            skuInput
        );

        box.appendChild(
            infoLabel
        );

        box.appendChild(
            infoInput
        );

        box.appendChild(
            actions
        );

        box.appendChild(
            status
        );


        overlay.appendChild(
            box
        );


        document.body.appendChild(
            overlay
        );


        setTimeout(
            function () {
                skuInput.focus();
            },
            100
        );


        // ===============================================
        // ODPOWIEDŹ Z ANDROIDA
        // ===============================================

        window.onAndroidReportResult =
            function (
                success,
                message
            ) {

                if (
                    !document.body.contains(
                        overlay
                    )
                ) {
                    return;
                }


                if (success) {

                    status.textContent =
                        '✅ Zgłoszenie wysłane';

                    sendButton.textContent =
                        '✓ Wysłano';


                    setTimeout(
                        function () {

                            overlay.remove();

                            const mainButton =
                                document.getElementById(
                                    BUTTON_ID
                                );

                            if (mainButton) {

                                mainButton.textContent =
                                    '✅ Zgłoszono';

                                mainButton.style.background =
                                    '#2ba347';


                                setTimeout(
                                    function () {

                                        mainButton.textContent =
                                            '⚠️ Zgłoś problem';

                                        mainButton.style.background =
                                            '#d9534f';

                                    },
                                    2500
                                );
                            }

                        },
                        1000
                    );

                } else {

                    status.textContent =
                        '❌ ' + message;

                    sendButton.disabled =
                        false;

                    sendButton.textContent =
                        'Spróbuj ponownie';
                }
            };
    }


    // =========================================================
    // START
    // =========================================================

    function start() {

        addStyles();

        injectButton();


        const observer =
            new MutationObserver(
                function () {

                    injectButton();
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