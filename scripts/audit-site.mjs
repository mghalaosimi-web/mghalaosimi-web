import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const ignored = new Set([".git", "node_modules", "dist", "coverage"]);
const failures = [];
const pages = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignored.has(entry.name)) walk(path.join(directory, entry.name));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      pages.push(path.join(directory, entry.name));
    }
  }
}

function fail(file, message) {
  failures.push(`${path.relative(root, file)}: ${message}`);
}

function localTarget(raw, currentFile) {
  const value = raw.trim();
  if (!value || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value) || value.startsWith("#")) return null;
  let pathname;
  try {
    pathname = new URL(value, `https://mghal.invalid/${path.relative(root, currentFile).split(path.sep).join("/")}`).pathname;
    pathname = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  let target = path.resolve(root, `. ${pathname.startsWith("/") ? pathname : "/" + pathname}`.replace(/^\. /, "."));
  if (!target.startsWith(root + path.sep) && target !== root) return null;
  if (existsSync(target) && statSync(target).isDirectory()) target = path.join(target, "index.html");
  if (!path.extname(target) && existsSync(path.join(target, "index.html"))) target = path.join(target, "index.html");
  return target;
}

walk(root);
pages.sort();

for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const relative = path.relative(root, file);

  if (!/^\s*<!doctype html>/i.test(html)) fail(file, "missing HTML doctype");
  const htmlTag = html.match(/<html\b([^>]*)>/i)?.[1] ?? "";
  const lang = htmlTag.match(/\blang\s*=\s*["']([^"']+)["']/i)?.[1];
  const dir = htmlTag.match(/\bdir\s*=\s*["']([^"']+)["']/i)?.[1];
  if (!lang) fail(file, "missing html[lang]");
  if (!["rtl", "ltr"].includes((dir ?? "").toLowerCase())) fail(file, "html[dir] must be rtl or ltr");
  if (!/<title\b[^>]*>\s*[^<]+\s*<\/title>/i.test(html)) fail(file, "missing or empty title");
  if (!/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i.test(html)
      && !/<meta\b[^>]*content=["'][^"']+["'][^>]*name=["']description["'][^>]*>/i.test(html)) {
    fail(file, "missing meta description");
  }
  const mainCount = (html.match(/<main\b/gi) ?? []).length;
  if (mainCount !== 1) fail(file, `expected exactly one main landmark, found ${mainCount}`);

  const ids = new Set();
  for (const match of html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)) {
    const id = match[1];
    if (ids.has(id)) fail(file, `duplicate id="${id}"`);
    ids.add(id);
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt\s*=\s*["'][^"']*["']/i.test(match[1])) fail(file, "img element missing alt attribute");
  }

  const refs = [
    ...[...html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]),
  ];
  for (const reference of refs) {
    const target = localTarget(reference, file);
    if (target && !existsSync(target)) fail(file, `broken local reference: ${reference}`);
  }

  if (/certificates\.html$/i.test(relative)) {
    const count = (html.match(/class=["'][^"']*\bcredential-card\b[^"']*["']/gi) ?? []).length;
    if (count !== 18) fail(file, `expected 18 credential cards, found ${count}`);
  }
}

console.log(`HTML audit: ${pages.length} pages inspected.`);
if (failures.length) {
  console.error(`Found ${failures.length} issue(s):\n- ${failures.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log("HTML structure, landmarks, metadata, image alternatives, IDs and local references passed.");
}
