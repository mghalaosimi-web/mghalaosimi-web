/** Keyboard navigation improvements shared by all public pages. */
const main = document.querySelector<HTMLElement>("main");

if (main && document.body) {
  const mainId = main.id || "main-content";
  main.id = mainId;

  let skipLink = document.querySelector<HTMLAnchorElement>(".skip-link");
  if (!skipLink) {
    skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.textContent = document.documentElement.lang.toLowerCase().startsWith("ar")
      ? "تجاوز إلى المحتوى الرئيسي"
      : "Skip to main content";
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  skipLink.href = "#" + mainId;

  if (skipLink.dataset.focusBound !== "true") {
    skipLink.dataset.focusBound = "true";
    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      main.setAttribute("tabindex", "-1");
      requestAnimationFrame(() => {
        main.focus({ preventScroll: true });
        main.scrollIntoView({ block: "start" });
      });
      main.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });
    });
  }
}
