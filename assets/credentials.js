"use strict";
(() => {
    "use strict";
    const root = document.querySelector(".credentials-page");
    if (!root)
        return;
    const search = root.querySelector(".credential-search");
    const buttons = Array.from(root.querySelectorAll(".credential-filter"));
    const getCards = () => Array.from(root.querySelectorAll(".credential-card"));
    const count = root.querySelector(".credential-count");
    const empty = root.querySelector(".credential-empty");
    let activeFilter = "all";
    const normalize = (value) => String(value ?? "")
        .toLocaleLowerCase()
        .normalize("NFKD")
        .replace(/[\u064B-\u065F\u0670]/g, "")
        .replace(/[أإآ]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ة/g, "ه");
    const applyFilters = () => {
        const query = normalize(search?.value).trim();
        let visibleCount = 0;
        const cards = getCards();
        for (const card of cards) {
            const categoryMatches = activeFilter === "all" || card.dataset["category"] === activeFilter;
            const queryMatches = normalize(card.innerText).includes(query);
            const isVisible = categoryMatches && queryMatches;
            card.hidden = !isVisible;
            if (isVisible)
                visibleCount += 1;
        }
        if (count) {
            count.textContent =
                document.documentElement.lang === "ar"
                    ? `${visibleCount} من ${cards.length} اعتماداً معروضاً`
                    : `${visibleCount} of ${cards.length} credentials shown`;
        }
        if (empty)
            empty.hidden = visibleCount !== 0;
    };
    for (const button of buttons) {
        button.addEventListener("click", () => {
            activeFilter = button.dataset["filter"] ?? "all";
            for (const candidate of buttons) {
                candidate.setAttribute("aria-pressed", String(candidate === button));
            }
            applyFilters();
        });
    }
    search?.addEventListener("input", applyFilters);
    search?.addEventListener("keydown", (event) => {
        if (event.key !== "Escape")
            return;
        search.value = "";
        applyFilters();
    });
    applyFilters();
})();
