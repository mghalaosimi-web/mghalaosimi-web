(()=> {
  "use strict";

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const header = document.querySelector(".site-header");
  const nav = header?.querySelector(".main-nav");
  const brand = header?.querySelector(".brand");

  if (header && nav && brand) {
    const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
    const labels = isEnglish
      ? { open: "Open navigation menu", close: "Close navigation menu" }
      : { open: "فتح قائمة التنقل", close: "إغلاق قائمة التنقل" };

    if (!nav.id) nav.id = "primary-navigation";

    const toggle = document.createElement("button");
    toggle.className = "mobile-nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-controls", nav.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", labels.open);
    toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    brand.after(toggle);

    const styleId = "home-mobile-nav-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = [
        ".mobile-nav-toggle{display:none;place-items:center;width:44px;height:44px;padding:0;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--text);cursor:pointer}",
        ".mobile-nav-toggle svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}",
        "@media(max-width:640px){",
        ".site-header.has-mobile-nav .header-inner{align-items:center;flex-direction:row;flex-wrap:wrap;justify-content:space-between;padding:12px 0}",
        ".site-header.has-mobile-nav .mobile-nav-toggle{display:grid}",
        ".site-header.has-mobile-nav .main-nav{width:100%;display:flex;flex-direction:column;align-items:stretch;gap:0;overflow:visible;white-space:normal;padding:8px 0 0;border-top:1px solid var(--line)}",
        ".site-header.has-mobile-nav:not(.nav-open) .main-nav{display:none}",
        ".site-header.has-mobile-nav .main-nav a{padding:11px 10px;border:0;border-radius:8px}",
        ".site-header.has-mobile-nav .main-nav a:hover{background:var(--surface)}",
        ".site-header.has-mobile-nav .main-nav a[aria-current=location]{background:var(--surface-2);color:var(--accent-soft)}",
        "}"
      ].join("");
      document.head.append(style);
    }

    const setOpen = (open, restoreFocus = false) => {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? labels.close : labels.open);
      if (!open && restoreFocus) toggle.focus();
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", event => {
      if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("click", event => {
      if (!header.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && header.classList.contains("nav-open")) setOpen(false, true);
    });

    const desktopQuery = window.matchMedia("(min-width: 641px)");
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", event => {
        if (event.matches) setOpen(false);
      });
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(event => {
        if (event.matches) setOpen(false);
      });
    }

    header.classList.add("has-mobile-nav");
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...document.querySelectorAll("[data-section-link]")];
  const revealItems = [...document.querySelectorAll(".reveal")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(element => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(element => revealObserver.observe(element));

  if (reducedMotion) return;

  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.id;
        links.forEach(link => {
          if (link.dataset.sectionLink === activeId) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
  sections.forEach(section => activeObserver.observe(section));
})();
