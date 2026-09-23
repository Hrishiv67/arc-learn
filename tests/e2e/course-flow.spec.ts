import { test, expect, type Page } from "@playwright/test";
import { MODULE_1_QUIZ } from "../../content/modules/01-this-years-challenge/quiz";
async function completeQuiz(page: Page) {
  for (const q of MODULE_1_QUIZ.questions) {
    if (q.type !== "choice") throw new Error("Unexpected question type");
    await page.getByRole("radio").nth(q.answerIndex).check();
    await page
      .getByRole("button", { name: "Check my answer", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Next question", exact: true })
      .click();
  }
  await expect(
    page.getByText("11 of 11 correct · 100% accuracy"),
  ).toBeVisible();
}

test("anonymous user can read Module 1 and complete the quiz", async ({
  page,
}) => {
  await page.goto("/modules/this-years-challenge/lesson");
  await expect(
    page.getByRole("heading", { name: "This Year's Challenge" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Next: Take the quiz" }).click();
  await expect(page).toHaveURL(/\/quiz$/);

  await completeQuiz(page);

  // Progress persisted to localStorage — course index reflects it. The
  // summary renders twice in the DOM (a mobile block and a desktop
  // sidebar, toggled with responsive classes) — only one is actually
  // visible at a given viewport, so filter to that one instead of
  // hardcoding which of the two it'll be.
  await page.goto("/modules");
  await expect(
    page
      .getByRole("progressbar", { name: "Rocket build" })
      .filter({ visible: true }),
  ).toBeVisible();
});

test("quiz retry works with no limit", async ({ page }) => {
  await page.goto("/modules/this-years-challenge/quiz");
  await completeQuiz(page);

  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText("Question 1 of 11")).toBeVisible();
});

test("safety-gate prerequisite logic is enforced (unit-level, see tests/unit/gating.test.ts)", async ({
  page,
}) => {
  await page.goto("/modules/building-it");
  await expect(page.getByText("Locked for now", { exact: true })).toBeVisible();
});
