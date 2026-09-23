import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { MODULE_1_QUIZ } from "../../content/modules/01-this-years-challenge/quiz";

test("reading stays beside the quiz without losing selections or feedback", async ({
  page,
}, info) => {
  await page.goto("/modules/this-years-challenge/quiz");
  await page.getByRole("radio").nth(2).check();
  await page
    .getByRole("button", { name: "Open lesson notes", exact: true })
    .click();
  const notes = page.getByRole("complementary", { name: "Condensed lesson" });
  await expect(notes).toBeVisible();
  await expect(
    notes.getByRole("heading", { name: "Lower score wins" }),
  ).toBeVisible();
  await expect(page.getByRole("radio").nth(2)).toBeChecked();
  await notes.getByLabel("Jump to a topic").selectOption("parts");
  await expect(notes.locator("img")).toBeVisible();
  await notes.getByRole("button", { name: "Close notes" }).click();
  await expect(page.getByRole("radio").nth(2)).toBeChecked();
  await page
    .getByRole("button", { name: "Check my answer", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Review this in the reading" })
    .click();
  await expect(page.getByText("Correct", { exact: true })).toBeVisible();
  await expect(page.getByRole("radio").nth(2)).toBeChecked();
  await expect(page).toHaveURL(/\/quiz$/);
  await page.screenshot({
    path: `artifacts/ui/module-one-notes-${info.project.name}.png`,
  });
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
  await page
    .getByRole("button", { name: "Next question", exact: true })
    .click();
  await expect(page.getByText(/Question 2 of 11/)).toBeVisible();
  await expect(
    notes.getByRole("heading", { name: "The flight goal" }),
  ).toBeVisible();
  await notes.getByRole("button", { name: "Close notes" }).click();
  for (const q of MODULE_1_QUIZ.questions.slice(1)) {
    if (q.type !== "choice") throw new Error("Expected a choice question");
    if (q.image) {
      const image = page.locator("main figure img");
      await expect
        .poll(() =>
          image.evaluate((el) => (el as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
    }
    if (q.id === "q10")
      await page.screenshot({
        path: `artifacts/ui/module-one-photo-${info.project.name}.png`,
      });
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
  await page
    .getByRole("button", { name: "Review this in the reading" })
    .nth(9)
    .click();
  await expect(
    notes.getByRole("heading", { name: "Know the parts" }),
  ).toBeVisible();
  await expect(
    page.getByText("11 of 11 correct · 100% accuracy"),
  ).toBeVisible();
});
