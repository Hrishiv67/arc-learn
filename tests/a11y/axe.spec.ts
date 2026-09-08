import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/modules",
  "/modules/this-years-challenge",
  "/modules/this-years-challenge/lesson",
  "/modules/this-years-challenge/quiz",
  "/modules/building-it", // locked-module state
  "/account",
  "/legal",
  "/offline",
  "/styleguide",
];

for (const route of ROUTES) {
  test(`axe: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}
