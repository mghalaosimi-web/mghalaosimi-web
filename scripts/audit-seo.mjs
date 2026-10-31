import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const origin = "https://mghal.vercel.app";
const ignored = new Set([".git", "node_modules", "dist", "coverage"]);
const failures = [];
const pages = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignored.has(entry.name)) walk(path.join(directory, entry.name));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      pages.push(path.relative(root, path.join(directory, entry.name)).split(path.sep).join("/"));
    }
  }
}

function fail(file, message) {
  failures.push(file + ": " + message);
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(match => [match[1].toLowerCase(), match[2]]));
}

function publicUrl(relative) {
  if (relative === "index.html") return origin + "/";
  if (relative === "en/index.html") return origin + "/en/";
  return origin + "/" + relative;
}

function pairedPaths(relative) {
  if (relative.startsWith("en/")) {
    const arabic = relative.slice(3);
    return { ar: arabic, en: relative };
  }
  return { ar: relative, en: relative === "index.html" ? "en/index.html" : "en/" + relative };
}

walk(root);
pages.sort();
const publicPages = pages.filter(file => !["404.html", "offline.html"].includes(file));

for (const relative of publicPages) {
  const html = readFileSync(path.join(root, relative), "utf8");
  const canonicalMatches = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map(match => attributes(match[0]))
    .filter(attrs => (attrs.rel || "").toLowerCase().split(/\s+/).includes("canonical"));
  if (canonicalMatches.length !== 1) {
    fail(relative, "expected exactly one canonical link, found " + canonicalMatches.length);
    continue;
  }

  const canonical = canonicalMatches[0].href;
  const expectedCanonical = publicUrl(relative);
  if (canonical !== expectedCanonical) fail(relative, "canonical mismatch: expected " + expectedCanonical + ", found " + canonical);

  const description = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map(match => attributes(match[0]))
    .find(attrs => attrs.name?.toLowerCase() === "description");
  if (!description?.content?.trim()) fail(relative, "missing meta description");

  const alternates = new Map();
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
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
    if (alternates.get(language) !== url) {
      fail(relative, "hreflang " + language + " must point to " + url);
    }
  }

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch {
      fail(relative, "invalid JSON-LD block");
    }
  }
}

const sitemap = readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(match => match[1]);
const sitemapSet = new Set(sitemapUrls);
if (sitemapUrls.length !== sitemapSet.size) fail("sitemap.xml", "duplicate URL entries found");
const expectedUrls = publicPages.map(publicUrl);
for (const url of expectedUrls) if (!sitemapSet.has(url)) fail("sitemap.xml", "missing public page: " + url);
for (const url of sitemapSet) if (!expectedUrls.includes(url)) fail("sitemap.xml", "URL has no matching public HTML page: " + url);

const robots = readFileSync(path.join(root, "robots.txt"), "utf8");
if (!robots.includes("Sitemap: " + origin + "/sitemap.xml")) fail("robots.txt", "Sitemap directive must point to the production sitemap");

console.log("SEO audit: " + publicPages.length + " public pages and " + sitemapUrls.length + " sitemap URLs inspected.");
if (failures.length) {
  console.error("Found " + failures.length + " SEO issue(s):\n- " + failures.join("\n- "));
  process.exitCode = 1;
} else {
  console.log("Canonical URLs, reciprocal language alternates, descriptions, JSON-LD syntax, sitemap coverage and robots reference passed.");
}
