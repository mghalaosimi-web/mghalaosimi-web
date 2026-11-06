import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "public");

const blockedNames = [
  /^Screenshot_/i,
  /Master Project Book/i,
  /m-gh-alaosimi-gmail-com/i,
  /PythonEssentials1Update20260725/i,
  /IT_Customer_Support_Basics_certificate_/i,
];

const blockedExtensions = new Set([
  ".md", ".markdown", ".sql", ".log", ".zip", ".7z", ".rar",
  ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".key", ".pem",
  ".p12", ".pfx", ".env", ".bak", ".dump",
]);

function shouldCopy(source) {
  const relative = path.relative(root, source);
  const parts = relative.split(path.sep);
  const base = path.basename(source);
  if (parts.some((part) => part === ".git" || part === "node_modules" || part === ".wrangler")) return false;
  if (base.startsWith(".") || blockedNames.some((pattern) => pattern.test(base))) return false;
  if (path.extname(base).toLowerCase() === ".txt" && relative !== "robots.txt") return false;
  if (blockedExtensions.has(path.extname(base).toLowerCase())) return false;
  if (/\.(?:map|tsbuildinfo)$/i.test(base)) return false;
  return true;
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.toLowerCase().endsWith(".html") && shouldCopy(path.join(root, entry.name))) {
    copyFileSync(path.join(root, entry.name), path.join(output, entry.name));
  }
}

for (const name of ["assets", "en", "projects", "admin"]) {
  const source = path.join(root, name);
  if (existsSync(source)) {
    cpSync(source, path.join(output, name), {
      recursive: true,
      filter: shouldCopy,
    });
  }
}

for (const name of ["favicon.svg", "manifest.json", "offline.html", "robots.txt", "sitemap.xml", "sw.js"]) {
  const source = path.join(root, name);
  if (existsSync(source) && shouldCopy(source)) {
    copyFileSync(source, path.join(output, name));
  }
}

console.log("Prepared sanitized static website output in ./public.");
