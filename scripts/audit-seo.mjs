import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalog = JSON.parse(readFileSync(path.join(root, "assets/projects/catalog.json"), "utf8"));
const origin = catalog.siteOrigin.replace(/\/$/, "");
const siteRoot = path.join(root, "public");
const ignored = new Set([".git", "node_modules", "dist", "coverage"]);
const failures = [];
const pages = [];

assert.ok(existsSync(siteRoot), "Static output folder public/ must exist before the SEO audit.");

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignored.has(entry.name)) walk(path.join(directory, entry.name));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      pages.push(path.relative(siteRoot, path.join(directory, entry.name)).split(path.sep).join("/"));
    }
  }
}
function fail(file, message) { failures.push(file + ": " + message); }
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)]
    .map(match => [match[1].toLowerCase(), match[2]]));
}
function publicUrl(relative) {
  if (relative === "index.html") return origin + "/";
  if (relative === "en/index.html") return origin + "/en/";
  if (/^(?:en\/)?projects\/[^/]+\/index\.html$/.test(relative)) {
    return origin + "/" + relative.replace(/index\.html$/, "");
  }
  return origin + "/" + relative;
}
function pairedPaths(relative) {
  if (relative.startsWith("en/")) return { ar: relative.slice(3), en: relative };
  return { ar: relative, en: relative === "index.html" ? "en/index.html" : "en/" + relative };
}

walk(siteRoot);
pages.sort();
const nonIndexable = new Set(["404.html", "offline.html"]);
const publicPages = pages.filter(file => !nonIndexable.has(file));

for (const relative of pages.filter(file => nonIndexable.has(file))) {
  const html = readFileSync(path.join(siteRoot, relative), "utf8");
  if (!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
    fail(relative, "non-indexable utility page must declare robots noindex");
  }
}

for (const relative of publicPages) {
  const html = readFileSync(path.join(siteRoot, relative), "utf8");
  const linkTags = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0]));
  const canonicals = linkTags.filter(attrs => (attrs.rel || "").toLowerCase().split(/\s+/).includes("canonical"));
  if (canonicals.length !== 1) {
    fail(relative, "expected exactly one canonical link, found " + canonicals.length);
    continue;
  }
  const expectedCanonical = publicUrl(relative);
  if (canonicals[0].href !== expectedCanonical) {
    fail(relative, "canonical mismatch: expected " + expectedCanonical + ", found " + canonicals[0].href);
  }

  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]));
  const description = metaTags.find(attrs => attrs.name?.toLowerCase() === "description");
  if (!description?.content?.trim()) fail(relative, "missing meta description");

  const og = new Set(metaTags.filter(attrs => attrs.property?.startsWith("og:")).map(attrs => attrs.property));
  for (const property of ["og:title", "og:description", "og:image"]) {
    if (!og.has(property)) fail(relative, "missing Open Graph property " + property);
  }
  const twitter = new Set(metaTags.filter(attrs => attrs.name?.startsWith("twitter:")).map(attrs => attrs.name));
  if (!twitter.has("twitter:card")) fail(relative, "missing Twitter card declaration");

  const alternates = new Map();
  for (const attrs of linkTags) {
    if ((attrs.rel || "").toLowerCase().split(/\s+/).includes("alternate") && attrs.hreflang) {
      const key = attrs.hreflang.toLowerCase();
      if (alternates.has(key)) fail(relative, "duplicate hreflang entry: " + key);
      alternates.set(key, attrs.href);
    }
  }
  const pair = pairedPaths(relative);
  const expectedAlternates = {
    ar: publicUrl(pair.ar),
    en: publicUrl(pair.en),
    "x-default": publicUrl(pair.ar),
  };
  for (const [language, url] of Object.entries(expectedAlternates)) {
    if (alternates.get(language) !== url) fail(relative, "hreflang " + language + " must point to " + url);
  }

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); }
    catch { fail(relative, "invalid JSON-LD block"); }
  }
}

const sitemap = readFileSync(path.join(siteRoot, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(match => match[1]);
const sitemapSet = new Set(sitemapUrls);
if (sitemapUrls.length !== sitemapSet.size) fail("sitemap.xml", "duplicate URL entries found");
const expectedUrls = publicPages.map(publicUrl);
for (const url of expectedUrls) if (!sitemapSet.has(url)) fail("sitemap.xml", "missing public page: " + url);
for (const url of sitemapSet) if (!expectedUrls.includes(url)) fail("sitemap.xml", "URL has no matching public HTML page: " + url);

const robots = readFileSync(path.join(siteRoot, "robots.txt"), "utf8");
if (!robots.includes("Sitemap: " + origin + "/sitemap.xml")) fail("robots.txt", "Sitemap directive must point to the catalog production origin");
if (!/User-agent:\s*\*/i.test(robots)) fail("robots.txt", "missing generic user-agent rule");

console.log("SEO audit: " + publicPages.length + " deployed public pages and " + sitemapUrls.length + " sitemap URLs inspected.");
if (failures.length) {
  console.error("Found " + failures.length + " SEO issue(s):\n- " + failures.join("\n- "));
  process.exitCode = 1;
} else {
  console.log("Canonical URLs, reciprocal hreflang, descriptions, OG/Twitter metadata, JSON-LD syntax, sitemap coverage and robots reference passed.");
}
