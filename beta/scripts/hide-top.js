(function () {
    'use strict';

    const TARGET_SELECTOR =
        '.pick_pack_personal_triggers_container_wrapper';

    function removeTopButtons() {

        document
            .querySelectorAll(TARGET_SELECTOR)
            .forEach(function (element) {
                element.remove();
            });
    }

    // Próba od razu po uruchomieniu skryptu
    removeTopButtons();

    // BaseLinker dynamicznie zmienia DOM,
    // dlatego obserwujemy pojawianie się nowych elementów.
    const observer = new MutationObserver(function () {
        removeTopButtons();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();