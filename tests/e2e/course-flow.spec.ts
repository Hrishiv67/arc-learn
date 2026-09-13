import { test, expect, type Page, type Locator } from "@playwright/test";

/**
 * dnd-kit's PointerSensor needs real intermediate pointermove events past
 * its activation-distance threshold before it recognizes a drag — the
 * built-in Locator.dragTo() single-hop move isn't enough to trigger it
 * reliably, so this drives the mouse through explicit steps instead.
 *
 * Both elements must already be reachable without scrolling *during* the
 * drag: dnd-kit measures droppable rects once when the drag starts and
 * doesn't reliably re-measure them against a page scroll that happens
 * mid-drag (confirmed by instrumenting collision detection directly — the
 * droppable rects stayed pinned to their pre-scroll position while the
 * dragged item's own rect correctly tracked the new scroll position,
 * so the closest-center match silently landed on the wrong target). The
 * caller is responsible for giving the page enough viewport height that
 * nothing needs to scroll between mousedown and mouseup.
 */
async function dragOnto(page: Page, source: Locator, target: Locator) {
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  if (!from || !to) throw new Error("drag source/target not visible");

  const startX = from.x + from.width / 2;
  const startY = from.y + from.height / 2;
  const endX = to.x + to.width / 2;
  const endY = to.y + to.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 10, startY + 10, { steps: 5 });
  await page.mouse.move(endX, endY, { steps: 10 });
  await page.mouse.move(endX, endY, { steps: 2 });
  await page.mouse.up();
}

/** Answers every question in the 11-question Module 1 quiz, in order. */
async function completeQuiz(page: Page) {
  // Tall enough that the diagram + label bank (Q10) and the definition
  // grid + term bank (Q11) are always fully on-screen together, so
  // dragOnto never needs to scroll mid-drag (see its comment above).
  const width = page.viewportSize()?.width ?? 1280;
  await page.setViewportSize({ width, height: 2600 });

  for (let i = 0; i < 9; i++) {
    await page.getByRole("radio").first().check();
    await page.getByRole("button", { name: "Check my answer" }).click();
    await page.getByRole("button", { name: "Next question" }).click();
  }

  // Q10 — drag-label: drag every chip onto the diagram. Chips already
  // placed re-render as draggable too (so you can move them), so the
  // "next chip" query must stay scoped to the still-unplaced bank —
  // otherwise it keeps re-grabbing whatever was placed most recently.
  await expect(page.getByText(/Drag each part name/)).toBeVisible();
  const labelBank = page.getByTestId("label-bank");
  const initialChipCount = await labelBank
    .locator("button.cursor-grab")
    .count();
  for (let i = 0; i < initialChipCount; i++) {
    await dragOnto(
      page,
      labelBank.locator("button.cursor-grab").first(),
      page.locator('span:text-is("drop")').first(),
    );
  }
  await expect(
    page.getByRole("button", { name: "Check my answers" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Check my answers" }).click();
  await page.getByRole("button", { name: "Next question" }).click();

  // Q11 — drag-match: drag every term onto a definition slot.
  await expect(
    page.getByText(/Drag each term to its definition/),
  ).toBeVisible();
  const termBank = page.getByTestId("term-bank");
  const initialTermCount = await termBank.locator("button.cursor-grab").count();
  for (let i = 0; i < initialTermCount; i++) {
    await dragOnto(
      page,
      termBank.locator("button.cursor-grab").first(),
      page.locator('span:text-is("drop a term here")').first(),
    );
  }
  await expect(
    page.getByRole("button", { name: "Check my answers" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Check my answers" }).click();
  await page.getByRole("button", { name: "See your result" }).click();

  await expect(page.getByText(/correct · \d+% accuracy/)).toBeVisible();
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
  // Only Module 1 is live in this build (see the plan's scope decision), so
  // there is currently no *live* module with an unmet prerequisite to reach
  // through the browser — "Building It" and "Launch Day" both show as
  // "coming soon" rather than "locked" until a second module goes live.
  // The gating logic itself (isModuleUnlocked / lockedReason) is covered
  // directly in tests/unit/gating.test.ts, including the locked case.
  await page.goto("/modules/building-it");
  await expect(page.getByText("Coming soon").first()).toBeVisible();
});
