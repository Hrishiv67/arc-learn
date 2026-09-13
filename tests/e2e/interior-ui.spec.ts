import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("interiors fit desktop and phone widths with saved results", async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript(() =>
    localStorage.setItem(
      "arc-learn:progress:v1",
      JSON.stringify({
        "this-years-challenge": { read: true, quiz: { score: 9, total: 11 } },
      }),
    ),
  );
  for (const width of [1600, 1240, 390, 375]) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
    for (const [label, route] of [
      ["course", "/modules"],
      ["lesson", "/modules/this-years-challenge/lesson"],
      ["quiz", "/modules/this-years-challenge/quiz"],
      ["results", "/modules/results"],
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      await page.screenshot({
        caret: "initial",
        path: `artifacts/ui/${label}-${width}.png`,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
  expect(errors).toEqual([]);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("quiz supports arrow keys, answer feedback, and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/modules/this-years-challenge/quiz");
  const radios = page.getByRole("radio");
  await expect(
    page.getByRole("button", { name: "Check my answer", exact: true }),
  ).toBeDisabled();
  await radios.first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(radios.nth(1)).toBeChecked();
  await page
    .getByRole("button", { name: "Check my answer", exact: true })
    .click();
  await expect(page.getByText("Not this time", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Review this in the reading" }),
  ).toHaveAttribute("href", /lesson#the-flight-goal-for-this-season$/);
  await expect(radios.first()).toBeDisabled();
  await page
    .getByRole("button", { name: "Next question", exact: true })
    .click();
  await expect(page.getByText(/Question 2 of 11/)).toBeVisible();
});
