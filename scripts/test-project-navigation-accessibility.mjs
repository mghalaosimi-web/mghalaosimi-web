import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const arabic = read("../app/projects/ProjectsPageArabic.tsx");
const english = read("../app/projects/ProjectsExplorerEnglish.tsx");

function assertDialogFocus(source, locale) {
  for (const marker of [
    "modalRef=useRef<HTMLElement|null>(null)",
    "openerRef=useRef<HTMLElement|null>(null)",
    "document.activeElement instanceof HTMLElement",
    "modalRef.current?.querySelector<HTMLElement>('.project-modal-close')?.focus()",
    "openerRef.current?.focus()",
    "if(event.key!=='Tab')return",
    "ref={modalRef}",
    'role="dialog" aria-modal="true"',
  ]) {
    assert.ok(source.includes(marker), locale + " project dialog is missing focus behavior: " + marker);
  }
}

assertDialogFocus(arabic, "Arabic");
assertDialogFocus(english, "English");

assert.ok(arabic.includes("onClick={()=>openProject(p)}"), "Arabic project cards must capture the dialog opener before opening.");
assert.ok(english.includes("onClick={()=>openProject(p)}"), "English project cards must capture the dialog opener before opening.");
assert.ok(english.includes("onClick={()=>openProject(featured)}"), "English featured project must use the focus-aware opener.");

for (const [locale, source, paths] of [
  ["Arabic", arabic, ["/projects/waynah", "/projects/"]],
  ["English", english, ["/en/projects/waynah", "/en/projects/"]],
]) {
  assert.ok(source.includes('<a href="' + paths[0] + '"'), locale + " featured project detail must use a native anchor.");
  assert.ok(source.includes("<a href={'" + paths[1] + "'+p.slug}>"), locale + " project cards must use native anchors for static detail routes.");
  assert.ok(!source.includes('<Link href="' + paths[0] + '"'), locale + " featured static route must not trigger Next.js RSC prefetch.");
  assert.ok(!source.includes("<Link href={'" + paths[1] + "'+p.slug}>"), locale + " project card static routes must not trigger Next.js RSC prefetch.");
}

assert.ok(arabic.includes("<a href={'/projects/'+selectedProject.slug}>"), "Arabic dialog detail link must use native navigation.");
assert.ok(english.includes("<a href={'/en/projects/'+selected.slug}>"), "English dialog detail link must use native navigation.");

console.log("Project navigation and modal accessibility tests passed (AR/EN focus entry, Tab trap, focus restoration, and static detail anchors).");
