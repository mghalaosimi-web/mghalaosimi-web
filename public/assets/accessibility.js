"use strict";
const main = document.querySelector("main");
if (main && document.body) {
    const mainId = main.id || "main-content";
    main.id = mainId;

    const existingSkipLink = document.querySelector(".skip-link");
    const skipLink = existingSkipLink || document.createElement("a");

    if (!existingSkipLink) {
        skipLink.className = "skip-link";
        skipLink.href = "#" + mainId;
        skipLink.textContent = document.documentElement.lang.toLowerCase().startsWith("ar")
            ? "تجاوز إلى المحتوى الرئيسي"
            : "Skip to main content";
        document.body.insertBefore(skipLink, document.body.firstChild);
    } else {
        skipLink.href = "#" + mainId;
    }

    if (skipLink.dataset.focusBound !== "true") {
        skipLink.addEventListener("click", (event) => {
            event.preventDefault();
            main.setAttribute("tabindex", "-1");
            main.focus({ preventScroll: true });
            main.scrollIntoView({ block: "start" });
            main.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });
        });
        skipLink.dataset.focusBound = "true";
    }
}
