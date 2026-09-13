/** Links to existing lesson sections; question wording stays in content. */
const CHALLENGE_SECTIONS: Record<string, string> = {
  q1: "the-flight-goal-for-this-season",
  q2: "the-flight-goal-for-this-season",
  q3: "why-a-rocket-flies-straight",
  q4: "why-a-rocket-flies-straight",
  q5: "how-a-flight-is-scored",
  q6: "why-the-eggs-decide-the-flight",
  q7: "why-the-eggs-decide-the-flight",
  q8: "the-flight-goal-for-this-season",
  q10: "the-parts-of-your-rocket",
  q11: "the-flight-goal-for-this-season",
};
export function quizReadingHref(
  moduleId: string,
  slug: string,
  questionId: string,
) {
  if (moduleId === "this-years-challenge" && questionId === "q9")
    return "/legal";
  const section =
    moduleId === "this-years-challenge"
      ? CHALLENGE_SECTIONS[questionId]
      : undefined;
  return "/modules/" + slug + "/lesson" + (section ? "#" + section : "");
}
