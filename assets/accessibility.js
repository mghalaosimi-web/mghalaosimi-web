"use strict";
const main = document.querySelector("main");
if (main && document.body && !document.querySelector(".skip-link")) {
    const mainId = main.id || "main-content";
    main.id = mainId;
    const skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = "#" + mainId;
    skipLink.textContent = document.documentElement.lang.toLowerCase().startsWith("ar")
        ? "تجاوز إلى المحتوى الرئيسي"
        : "Skip to main content";
    document.body.insertBefore(skipLink, document.body.firstChild);
    skipLink.addEventListener("click", () => {
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
        main.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });
    });
}
