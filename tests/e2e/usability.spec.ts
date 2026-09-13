import { expect, test } from "@playwright/test";
import { MODULE_1_QUIZ as quiz } from "../../content/modules/01-this-years-challenge/quiz";

test("quiz can be completed using selects at a normal phone height", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/modules/this-years-challenge/quiz");
  for (const question of quiz.questions) {
    if (question.type === "choice") {
      await page.getByRole("radio").first().check();
      await page
        .getByRole("button", { name: "Check my answer", exact: true })
        .click();
    } else {
      await page
        .getByText("Prefer tapping? Choose answers from a list")
        .click();
      if (question.type === "drag-label") {
        for (const [index, target] of question.targets.entries())
          await page
            .getByLabel(`Diagram position ${index + 1}`)
            .selectOption(target.correctLabelId);
      } else {
        for (const pair of question.pairs)
          await page
            .getByLabel(pair.definition, { exact: true })
            .selectOption(pair.id);
      }
      await page
        .getByRole("button", { name: "Check my answers", exact: true })
        .click();
    }
    await page
      .getByRole("button", {
        name:
          question.type === "drag-match" ? "See your result" : "Next question",
        exact: true,
      })
      .click();
  }
  await expect(page.getByText(/correct · \d+% accuracy/)).toBeVisible();
  await page.reload();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("arc-learn:progress:v1") || "{}")[
          "this-years-challenge"
        ].quiz.total,
    ),
  ).toBe(11);
});

test("course has no horizontal overflow and starts the lesson directly", async ({
  page,
}) => {
  await page.goto("/modules");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Start learning" }).click();
  await expect(page).toHaveURL(/\/lesson$/);
  await expect(
    page.getByRole("button", { name: "Print / save lesson" }),
  ).toBeVisible();
});

test("an invalid confirmation link gives a recoverable error", async ({
  page,
}) => {
  await page.goto("/auth/callback?code=invalid");
  await expect(page).toHaveURL(/\/account\?auth_error=confirmation/);
  await expect(
    page.getByRole("alert").filter({ hasText: "could not be verified" }),
  ).toContainText("could not be verified");
});

test("technical terms reveal plain-language definitions", async ({ page }) => {
  await page.goto("/modules/this-years-challenge/lesson");
  await page.getByRole("button", { name: /apogee — see definition/i }).click();
  await expect(page.getByRole("tooltip")).toContainText(
    "The rocket climbs, slows, stops gaining altitude",
  );
});

test("rocket build shows honest progress before sections are earned", async ({
  page,
}) => {
  await page.goto("/modules");
  await expect(
    page
      .getByRole("heading", { name: "Start small. Aim high." })
      .filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("heading", { name: "Fin can and motor" })
      .filter({ visible: true }),
  ).toBeVisible();
});
