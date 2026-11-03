(() => {
  "use strict";

  const grid = document.querySelector("main .grid");
  const panel = document.querySelector("[data-project-tools]");
  if (!grid || !panel) return;

  const cards = Array.from(grid.querySelectorAll(":scope > .card"));
  const search = panel.querySelector("#project-search");
  const technology = panel.querySelector("#project-technology");
  const reset = panel.querySelector("#project-reset");
  const count = document.querySelector("#project-count");
  const empty = document.querySelector("#project-empty");

  if (!cards.length || !search || !technology || !reset || !count || !empty) return;

  const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
  const normalize = value => String(value || "")
    .toLocaleLowerCase(isEnglish ? "en" : "ar")
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s.-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const technologyOptions = new Map();
  cards.forEach(card => {
    card.querySelectorAll(".tag").forEach(tag => {
      const label = tag.textContent.trim();
      const value = normalize(label);
      if (value && !technologyOptions.has(value)) technologyOptions.set(value, label);
    });
  });

  const collator = new Intl.Collator(isEnglish ? "en" : "ar", { sensitivity: "base", numeric: true });
  [...technologyOptions.entries()]
    .sort((a, b) => collator.compare(a[1], b[1]))
    .forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      technology.append(option);
    });

  const total = cards.length;
  const update = () => {
    const terms = normalize(search.value).split(" ").filter(Boolean);
    const selectedTechnology = technology.value;
    let visible = 0;

    cards.forEach(card => {
      const cardText = normalize(card.textContent);
      const cardTechnologies = Array.from(card.querySelectorAll(".tag"), tag => normalize(tag.textContent));
      const matchesQuery = terms.every(term => cardText.includes(term));
      const matchesTechnology = !selectedTechnology || cardTechnologies.includes(selectedTechnology);
      const matches = matchesQuery && matchesTechnology;

      card.hidden = !matches;
      if (matches) visible += 1;
    });

    count.textContent = isEnglish
      ? `Showing ${visible} of ${total} projects`
      : `عرض ${visible} من ${total} مشروعًا`;
    empty.hidden = visible !== 0;
  };

  search.addEventListener("input", update);
  technology.addEventListener("change", update);
  reset.addEventListener("click", () => {
    search.value = "";
    technology.value = "";
    update();
    search.focus();
  });

  panel.hidden = false;
  update();
})();
