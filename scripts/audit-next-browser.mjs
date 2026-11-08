import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createRequire } from "node:module";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const root = process.cwd();
const port = Number(process.env.NEXT_BROWSER_PORT || 4174);
const base = `http://127.0.0.1:${port}`;
const artifacts = resolve("artifacts");
await mkdir(artifacts, { recursive: true });

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  cwd: root,
  env: { ...process.env, PORT: String(port), NEXT_TELEMETRY_DISABLED: "1", MGHAL_PREVIEW_API_BASE: "" },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverLog = "";
server.stdout.on("data", (chunk) => { serverLog = (serverLog + chunk.toString()).slice(-6000); });
server.stderr.on("data", (chunk) => { serverLog = (serverLog + chunk.toString()).slice(-6000); });

async function waitForServer() {
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error("Next server exited before ready: " + serverLog);
    try {
      const response = await fetch(base, { redirect: "manual" });
      if (response.status >= 200 && response.status < 500) return;
    } catch {}
    await delay(500);
  }
  throw new Error("Next server did not become ready within 90 seconds: " + serverLog);
}

async function newLocaleContext(browser, locale, width) {
  const context = await browser.newContext({
    viewport: { width, height: width < 600 ? 844 : width < 900 ? 1024 : 900 },
    isMobile: width < 600,
    hasTouch: width < 600,
    deviceScaleFactor: 1,
  });
  await context.addCookies([{ name: "portfolio-locale", value: locale, url: base, sameSite: "Lax" }]);
  return context;
}

async function dispatchSwipe(page, selector, startX, startY, endX, endY) {
  await page.evaluate(({ selector, startX, startY, endX, endY }) => {
    const target = document.querySelector(selector);
    if (!(target instanceof Element)) throw new Error("Swipe target not found: " + selector);
    const makeTouch = (x, y) => new Touch({
      identifier: 1,
      target,
      clientX: x,
      clientY: y,
      screenX: x,
      screenY: y,
    });
    const start = makeTouch(startX, startY);
    const end = makeTouch(endX, endY);
    target.dispatchEvent(new TouchEvent("touchstart", {
      bubbles: true, cancelable: true, touches: [start], changedTouches: [start],
    }));
    target.dispatchEvent(new TouchEvent("touchend", {
      bubbles: true, cancelable: true, touches: [], changedTouches: [end],
    }));
  }, { selector, startX, startY, endX, endY });
}

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});

const routes = ["/", "/about", "/skills", "/projects", "/labs", "/research", "/credentials", "/contact"];
const widths = [360, 768, 1024, 1440];
const checks = [];
const axeViolations = [];
const hydrationErrors = [];
const interactionChecks = [];

try {
  await waitForServer();

  for (const locale of ["ar", "en"]) {
    for (const width of widths) {
      const context = await newLocaleContext(browser, locale, width);
      for (const route of routes) {
        const page = await context.newPage();
        const pageErrors = [];
        page.on("pageerror", (error) => pageErrors.push(error.message));
        const response = await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 45000 });
        assert.ok(response && response.status() === 200, locale + " " + route + ": page did not return 200");
        await page.waitForSelector("[data-site-header]");
        await page.waitForSelector("main#main");
        await page.waitForTimeout(route === "/" || route === "/projects" ? 1200 : 250);

        const state = await page.evaluate(() => {
          const header = document.querySelector("[data-site-header]");
          const nav = document.querySelector(".mghal-primary-nav");
          const active = nav?.querySelector('[aria-current="page"]');
          const headerRect = header?.getBoundingClientRect();
          const navRect = nav?.getBoundingClientRect();
          const activeRect = active?.getBoundingClientRect();
          const progress = document.querySelector("[data-reading-progress]");
          const progressValue = Number(progress?.getAttribute("aria-valuenow"));
          return {
            lang: document.documentElement.lang,
            dir: document.documentElement.dir,
            headerPosition: header ? getComputedStyle(header).position : "",
            headerTop: headerRect?.top ?? null,
            navOverflowX: nav ? getComputedStyle(nav).overflowX : "",
            navTouchAction: nav ? getComputedStyle(nav).touchAction : "",
            navScrollWidth: nav?.scrollWidth ?? 0,
            navClientWidth: nav?.clientWidth ?? 0,
            activeCount: nav?.querySelectorAll('[aria-current="page"]').length ?? 0,
            activeVisible: !!(activeRect && navRect && activeRect.left >= navRect.left - 1 && activeRect.right <= navRect.right + 1),
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: innerWidth,
            progressExists: !!progress && progress.getAttribute("role") === "progressbar",
            progressLabel: progress?.getAttribute("aria-label") || "",
            progressValue,
          };
        });

        assert.equal(state.lang, locale, locale + " " + route + ": html lang mismatch");
        assert.equal(state.dir, locale === "ar" ? "rtl" : "ltr", locale + " " + route + ": document direction mismatch");
        assert.equal(state.headerPosition, "sticky", locale + " " + route + ": shared header is not sticky");
        assert.equal(state.navOverflowX, "auto", locale + " " + route + ": navigation rail is not horizontally scrollable");
        assert.equal(state.navTouchAction, "pan-x", locale + " " + route + ": navigation rail touch action is not pan-x");
        assert.equal(state.activeCount, 1, locale + " " + route + ": exactly one active navigation link is required");
        assert.ok(state.activeVisible, locale + " " + route + ": active navigation link is outside the rail viewport");
        assert.ok(state.documentWidth <= state.viewportWidth + 1, locale + " " + route + ": unexpected horizontal page overflow");
        assert.ok(state.progressExists, locale + " " + route + ": accessible reading progress is missing");
        assert.ok(state.progressLabel.length > 0, locale + " " + route + ": progress label is missing");
        if (width === 360) assert.ok(state.navScrollWidth > state.navClientWidth, locale + " " + route + ": phone navigation rail should overflow horizontally");

        if (route === "/" && width === 360) {
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          await page.waitForFunction(() => Number(document.querySelector("[data-reading-progress]")?.getAttribute("aria-valuenow")) >= 90, null, { timeout: 5000 });
          const endProgress = Number(await page.locator("[data-reading-progress]").getAttribute("aria-valuenow"));
          assert.ok(endProgress >= 90, locale + ": reading progress did not reach the end of the page");
          await page.evaluate(() => window.scrollTo(0, 520));
          await page.waitForTimeout(100);
          const stickyTop = await page.locator("[data-site-header]").evaluate((element) => element.getBoundingClientRect().top);
          assert.ok(Math.abs(stickyTop) <= 1, locale + ": sticky header moved away from the viewport top");
          await page.emulateMedia({ reducedMotion: "reduce" });
          const transitionDuration = await page.locator(".mghal-reading-progress > span").evaluate((element) => getComputedStyle(element).transitionDuration);
          assert.ok(transitionDuration.split(",").every((value) => Number.parseFloat(value) <= 0.001), locale + ": reduced motion must disable progress animation");
          interactionChecks.push({ locale, width, check: "sticky-header-and-reading-progress", endProgress, stickyTop, reducedMotion: true });
        }

        if (route === "/about" && width === 360) {
          const trigger = page.locator(".mghal-search-trigger");
          await trigger.click();
          await page.waitForFunction(() => document.querySelector(".mghal-search-dialog")?.open === true, null, { timeout: 3000 });
          const inputFocused = await page.locator(".mghal-search-dialog input").evaluate((element) => document.activeElement === element);
          assert.ok(inputFocused, locale + ": search palette must move focus to its input");
          await page.keyboard.press("Escape");
          await page.waitForFunction(() => document.querySelector(".mghal-search-dialog")?.open === false, null, { timeout: 3000 });
          const focusReturned = await trigger.evaluate((element) => document.activeElement === element);
          assert.ok(focusReturned, locale + ": closing search must restore focus to its trigger");
          interactionChecks.push({ locale, width, check: "search-dialog-focus-and-escape", passed: true });
        }

        if (route === "/about" && width === 1440) {
          await page.keyboard.press("Tab");
          const skipFocused = await page.evaluate(() => document.activeElement?.classList?.contains("skip-link") === true);
          assert.ok(skipFocused, locale + ": first keyboard stop must be the skip link");
          await page.keyboard.press("Tab");
          await page.keyboard.press("Tab");
          const keyboardState = await page.evaluate(() => ({
            insideNavigation: !!document.activeElement?.closest(".mghal-primary-nav"),
            focusVisible: document.activeElement?.matches(":focus-visible") === true,
          }));
          assert.ok(keyboardState.insideNavigation && keyboardState.focusVisible, locale + ": nav links must remain keyboard reachable with visible focus");
          interactionChecks.push({ locale, width, check: "keyboard-navigation-and-focus-visible", passed: true });
        }

        if (width === 1440) {
          await page.addScriptTag({ content: axeSource });
          const result = await page.evaluate(async () => window.axe.run(document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
          }));
          for (const violation of result.violations) {
            axeViolations.push({
              locale,
              route,
              id: violation.id,
              impact: violation.impact,
              help: violation.help,
              nodes: violation.nodes.length,
              targets: violation.nodes.slice(0, 3).map((node) => node.target),
            });
          }
        }

        if (pageErrors.length) {
          hydrationErrors.push(...pageErrors.map((message) => ({ locale, width, route, message })));
        }

        checks.push({ locale, width, route, status: response.status(), ...state, pageErrors: pageErrors.length });
        await page.close();
      }
      await context.close();
    }
  }

  for (const [locale, startX, endX] of [["ar", 200, 320], ["en", 320, 200]]) {
    const context = await newLocaleContext(browser, locale, 360);
    const page = await context.newPage();
    await page.goto(base + "/about", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForSelector("main#main");
    await page.waitForTimeout(400);
    await dispatchSwipe(page, "main p", startX, 260, endX, 262);
    await page.waitForURL("**/skills", { timeout: 6000 });
    interactionChecks.push({ locale, width: 360, check: "direction-aware-page-swipe", destination: new URL(page.url()).pathname });
    await page.close();
    await context.close();
  }

  for (const testCase of [
    { name: "vertical-scroll-is-not-page-swipe", startX: 200, startY: 240, endX: 212, endY: 370, selector: "main p" },
    { name: "system-edge-is-not-page-swipe", startX: 10, startY: 240, endX: 130, endY: 242, selector: "main p" },
    { name: "interactive-control-is-not-page-swipe", startX: 200, startY: 240, endX: 320, endY: 242, selector: "main button" },
    { name: "navigation-rail-is-not-page-swipe", startX: 300, startY: 25, endX: 180, endY: 27, selector: ".mghal-primary-nav a" },
  ]) {
    const context = await newLocaleContext(browser, "ar", 360);
    const page = await context.newPage();
    await page.goto(base + "/about", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForSelector("main#main");
    await page.waitForTimeout(300);
    await dispatchSwipe(page, testCase.selector, testCase.startX, testCase.startY, testCase.endX, testCase.endY);
    await page.waitForTimeout(250);
    assert.equal(new URL(page.url()).pathname, "/about", testCase.name + ": gesture unexpectedly changed route");
    interactionChecks.push({ locale: "ar", width: 360, check: testCase.name, passed: true });
    await page.close();
    await context.close();
  }

  const severe = axeViolations.filter((item) => item.impact === "critical" || item.impact === "serious");
  const report = {
    generatedAt: new Date().toISOString(),
    server: "Next.js production build served by next start",
    browser: "Playwright Chromium",
    locales: ["ar", "en"],
    widths,
    routes,
    pagesTested: checks.length,
    hydrationErrorCount: hydrationErrors.length,
    axeViolationGroups: axeViolations.length,
    criticalOrSeriousAxeGroups: severe.length,
    checks,
    interactionChecks,
    hydrationErrors,
    axeViolations,
  };
  await writeFile(join(artifacts, "next-browser-report.json"), JSON.stringify(report, null, 2));
  console.log(`Next.js browser audit: ${checks.length} route/locale/viewport combinations; ${interactionChecks.length} interaction checks; ${hydrationErrors.length} hydration errors; ${severe.length} serious/critical axe groups.`);
  if (hydrationErrors.length) console.log(JSON.stringify(hydrationErrors, null, 2));
  if (axeViolations.length) console.log(JSON.stringify(axeViolations, null, 2));
  assert.equal(hydrationErrors.length, 0, "React hydration errors detected in the Next.js production build");
  assert.equal(severe.length, 0, "Critical or serious WCAG violations detected in the Next.js routes");
} finally {
  await browser.close();
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await Promise.race([new Promise((resolveExit) => server.once("exit", resolveExit)), delay(5000)]);
    if (server.exitCode === null) server.kill("SIGKILL");
  }
}
