import { readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const output = path.resolve("public");
if (!existsSync(output) || !statSync(output).isDirectory()) {
  throw new Error("Static output directory ./public was not generated.");
}

const forbiddenExtensions = new Set([
  ".md", ".markdown", ".sql", ".log", ".zip", ".7z", ".rar",
  ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".key", ".pem",
  ".p12", ".pfx", ".env", ".bak", ".dump",
]);
const forbiddenNames = [
  /^Screenshot_/i,
  /Master Project Book/i,
  /m-gh-alaosimi-gmail-com/i,
  /PythonEssentials1Update20260725/i,
  /IT_Customer_Support_Basics_certificate_/i,
];
const violations = [];
let files = 0;

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else {
      files += 1;
      if ((path.extname(entry.name).toLowerCase() === ".txt" && path.relative(output, full) !== "robots.txt") ||
          forbiddenExtensions.has(path.extname(entry.name).toLowerCase()) ||
          forbiddenNames.some((pattern) => pattern.test(entry.name)) ||
          entry.name.startsWith(".")) {
        violations.push(path.relative(output, full));
      }
    }
  }
}
walk(output);

for (const required of ["index.html", "en/index.html", "assets", "projects", "admin", "robots.txt", "sitemap.xml"]) {
  if (!existsSync(path.join(output, required))) violations.push(`MISSING:${required}`);
}
if (violations.length) {
  console.error("Static output security audit failed:", violations);
  process.exit(1);
}
console.log(`Static output security audit passed (${files} files checked).`);
