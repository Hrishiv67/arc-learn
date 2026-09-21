import { test, expect } from "@playwright/test";
import { MODULES } from "../../content/modules/registry";
import AxeBuilder from "@axe-core/playwright";

test("every lesson renders, fits the screen, and loads its images", async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.addInitScript(() =>
    localStorage.setItem(
      "arc-learn:progress:v1",
      JSON.stringify({
        "safety-first": { read: true, quiz: { score: 4, total: 4 } },
      }),
    ),
  );
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const mod of MODULES) {
    await page.goto(`/modules/${mod.slug}/lesson`);
    await expect(
      page.getByRole("heading", { level: 1, name: mod.title }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Next: Take the quiz" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      mod.slug,
    ).toBe(true);
    const images = page.locator(".prose-lesson img");
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((node) => (node as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
    }
  }
  expect(errors).toEqual([]);
});

test("score explorer teaches penalties and disqualification", async ({
  page,
}) => {
  await page.goto("/modules/this-years-challenge/lesson");
  const calculator = page.getByRole("region", {
    name: "Practice flight score",
  });
  await calculator.getByLabel("Peak altitude (ft)").fill("810");
  await calculator.getByLabel("Official duration (sec)").fill("42");
  await expect(calculator.getByRole("status")).toContainText("18 points");
  await calculator.getByLabel("An egg cracked").check();
  await expect(calculator.getByRole("status")).toContainText("Disqualified");
  await calculator.getByLabel("An egg cracked").uncheck();
  await calculator.getByLabel("Peak altitude (ft)").fill("");
  await expect(calculator.getByRole("status")).toContainText(
    "Enter a nonnegative",
  );
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

test("passing safety opens the build lesson and persists after reload", async ({
  page,
}) => {
  await page.goto("/modules/building-it/lesson");
  await expect(page.getByText("Locked", { exact: true })).toBeVisible();
  await page.goto("/modules/safety-first/lesson");
  await page.getByRole("link", { name: "Next: Take the quiz" }).click();
  for (const answer of [2, 1, 0, 2]) {
    await page.getByRole("radio").nth(answer).check();
    await page
      .getByRole("button", { name: "Check my answer", exact: true })
      .click();
    await page.getByRole("button", { name: "Next question" }).click();
  }
  await expect(page.getByText("4 of 4 correct · 100% accuracy")).toBeVisible();
  await page.goto("/modules/building-it/lesson");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Dry-fit before glue" }),
  ).toBeVisible();
});

test("resources and sourced diagrams remain readable on the current viewport", async ({
  page,
}, testInfo) => {
  await page.goto("/modules/anatomy-of-a-rocket/lesson");
  await page
    .getByRole("link", { name: "Open full-size parts diagram" })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `artifacts/ui/content-anatomy-${testInfo.project.name}.png`,
  });
  await page.goto("/resources");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "The right resource",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
  await page.screenshot({
    path: `artifacts/ui/content-resources-${testInfo.project.name}.png`,
  });
});
