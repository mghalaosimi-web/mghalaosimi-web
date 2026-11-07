import { copyFileSync } from "node:fs";

const generated = ["credentials.js", "accessibility.js", "project-cards.js"];
for (const file of generated) {
  copyFileSync(`dist/scripts/${file}`, `assets/${file}`);
}
console.log("Synchronized generated browser scripts from TypeScript sources.");
