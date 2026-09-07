(function () {
    'use strict';

    const USERS = [
        'Kamil',
        'Dawid',
        'Ania'
    ];

    function createUserSelector() {

        const mainWrapper =
            document.querySelector('.main-wrapper');

        if (!mainWrapper) {
            console.log('Nie znaleziono .main-wrapper');
            return;
        }

        if (
            document.querySelector(
                '#base-user-selector'
            )
        ) {
            return;
        }

        const selector =
            document.createElement('div');

        selector.id =
            'base-user-selector';

        selector.innerHTML = `
            <div class="user-selector-box">

                <h2>
                    Wybierz użytkownika
                </h2>

                <div class="user-grid">

                    ${USERS.map((name, index) => `
                        <button
                            class="user-tile"
                            data-user-index="${index}"
                        >
                            ${name}
                        </button>
                    `).join('')}

                </div>

            </div>
        `;

        document.body.appendChild(selector);

        document
            .querySelectorAll('.user-tile')
            .forEach(button => {

                button.addEventListener(
                    'click',
                    function () {

                        const index =
                            Number(
                                button.dataset.userIndex
                            );

                        const userName =
                            USERS[index];

                        /*
                         * Najpierw usuwamy ekran wyboru.
                         * I WAŻNE:
                         * nic później go już nie tworzy ponownie.
                         */
                        const selector =
                            document.querySelector(
                                '#base-user-selector'
                            );

                        if (selector) {
                            selector.remove();
                        }

                        if (
                            window.AndroidLogin &&
                            typeof window.AndroidLogin.loginUser === 'function'
                        ) {

                            window.AndroidLogin.loginUser(
                                userName
                            );

                        } else {

                            console.log(
                                'Brak AndroidLogin bridge'
                            );
                        }
                    }
                );
            });
    }


    function addStyles() {

        if (
            document.getElementById(
                'base-user-selector-style'
            )
        ) {
            return;
        }

        const style =
            document.createElement('style');

        style.id =
            'base-user-selector-style';

        style.textContent = `

            #base-user-selector {

                position: fixed;

                inset: 0;

                z-index: 999999;

                background: #171717;

                display: flex;

                align-items: center;

                justify-content: center;

                padding: 20px;

                box-sizing: border-box;
            }

            .user-selector-box {

                width: 100%;

                max-width: 500px;

                text-align: center;
            }

            .user-selector-box h2 {

                color: white;

                font-family: Arial, sans-serif;

                font-size: 28px;

                margin-bottom: 30px;
            }

            .user-grid {

                display: grid;

                grid-template-columns:
                    repeat(2, 1fr);

                gap: 18px;
            }

            .user-tile {

                min-height: 110px;

                border: none;

                border-radius: 14px;

                background: white;

                font-size: 24px;

                font-weight: bold;

                cursor: pointer;

                padding: 20px;
            }

            .user-tile:active {

                transform:
                    scale(0.97);
            }
        `;

        document.head.appendChild(style);
    }


    /*
     * Tak jak w oryginalnym Tampermonkey.
     * Bez MutationObserver.
     */
    setTimeout(
        function () {

            addStyles();

            createUserSelector();

        },
        800
    );

})();