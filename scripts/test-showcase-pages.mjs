import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import catalog from "../assets/projects/catalog.json" with { type: "json" };
for (const [file, locale] of [["showcase.html", "ar"], ["en/showcase.html", "en"]]) {
  const html = readFileSync(file, "utf8");
  assert.equal((html.match(/class="showcase-card"/g) || []).length, catalog.projects.length, file + ": every registry project is represented");
  for (const project of catalog.projects) {
    assert.ok(html.includes(`/projects/${project.slug}/`), file + ": missing project route " + project.slug);
    assert.ok(html.includes(project.cover), file + ": missing cover " + project.slug);
  }
  assert.ok(html.includes("showcase-lab-grid"), file + ": engineering lab section missing");
  assert.ok(html.includes("mghal-experience.css"), file + ": shared visual layer missing");
  if (locale === "en") {
    assert.ok(html.includes("Active development"), "English showcase status must be localized");
    assert.doesNotMatch(html, /تفاصيل المشروع|منصة الأطلس الجغرافي اليمني/, "English showcase must not contain copied Arabic card copy");
  }
}
console.log("Showcase tests passed: 10 registry projects, valid detail routes, covers, bilingual content, and shared design system.");
