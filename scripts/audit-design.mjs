import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../assets/theme.css", import.meta.url), "utf8");
const roots = [...css.matchAll(/:root\s*\{([^}]*)\}/g)];
assert.equal(roots.length, 1, "The corporate design system must have one canonical :root token block.");

const requiredTokens = {
  "--mghal-navy": "#172B4D",
  "--mghal-blue": "#315A85",
  "--mghal-white": "#fff",
  "--mghal-surface": "#F3F5F7",
  "--mghal-text": "#202B38",
  "--mghal-muted": "#5B6678",
  "--mghal-border": "#DCE2E8",
  "--mghal-gold": "#B69A62",
  "--mghal-gold-ink": "#806333",
};
for (const [token, value] of Object.entries(requiredTokens)) {
  assert.ok(roots[0][1].includes(token + ":" + value), "Incorrect or missing design token: " + token);
}

assert.match(css, /@media\s*\(max-width:\s*680px\)/i, "Missing mobile layout breakpoint.");
assert.match(css, /prefers-reduced-motion/i, "Missing reduced-motion support.");
assert.match(css, /forced-colors/i, "Missing forced-colors support.");
assert.match(css, /@media\s*print/i, "Missing print stylesheet rules.");
assert.match(css, /\.credential-card/, "Missing credential component styling.");
assert.match(css, /\.engineering-actions/, "Missing project action component styling.");

console.log("Design system audit passed (single token source, approved palette, responsive, accessibility and print rules).");
