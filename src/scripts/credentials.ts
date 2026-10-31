(() => {
  "use strict";

  const root = document.querySelector<HTMLElement>(".credentials-page");
  if (!root) return;

  const search = root.querySelector<HTMLInputElement>(".credential-search");
  const buttons = Array.from(
    root.querySelectorAll<HTMLButtonElement>(".credential-filter"),
  );
  const cards = Array.from(
    root.querySelectorAll<HTMLElement>(".credential-card"),
  );
  const count = root.querySelector<HTMLElement>(".credential-count");
  const empty = root.querySelector<HTMLElement>(".credential-empty");

  let activeFilter = "all";

  const normalize = (value: string | null | undefined): string =>
    String(value ?? "")
      .toLocaleLowerCase()
      .normalize("NFKD")
      .replace(/[\u064B-\u065F\u0670]/g, "")
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه");

  const applyFilters = (): void => {
    const query = normalize(search?.value).trim();
    let visibleCount = 0;

    for (const card of cards) {
      const categoryMatches =
        activeFilter === "all" || card.dataset["category"] === activeFilter;
      const queryMatches = normalize(card.innerText).includes(query);
      const isVisible = categoryMatches && queryMatches;

      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    }

    if (count) {
      count.textContent =
        document.documentElement.lang === "ar"
          ? `${visibleCount} من ${cards.length} اعتماداً معروضاً`
          : `${visibleCount} of ${cards.length} credentials shown`;
    }

    if (empty) empty.hidden = visibleCount !== 0;
  };

  for (const button of buttons) {
    button.addEventListener("click", () => {
      activeFilter = button.dataset["filter"] ?? "all";

      for (const candidate of buttons) {
        candidate.setAttribute(
          "aria-pressed",
          String(candidate === button),
        );
      }

      applyFilters();
    });
  }

  search?.addEventListener("input", applyFilters);

  search?.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    search.value = "";
    applyFilters();
  });

  applyFilters();
})();
