import { citationSchema, type Citation } from "@/lib/schemas/citation";

const RULES_URL =
  "https://www.rocketrychallenge.org/resource/2027-american-rocketry-challenge-rules/";

/**
 * Structured citation registry — never prose. Ported verbatim from the
 * prototype's verified data (project/arc-data.jsx). Rules 1-3 carry real
 * quoted text checked against the uploaded 2027 rules; HANDBOOK, MOTORS,
 * and NAR-SC are unverified placeholders (PDFs not yet read / no quote
 * pulled) and render "not yet verified" rather than invented text.
 */
const raw: Citation[] = [
  {
    id: "1",
    season: 2027,
    ruleNumber: "1",
    topic: "Payload",
    quotedText:
      "Design a rocket that cradles two raw Grade A Large egg of 55 to 63 grams weight, carried in any orientation that must survive the flight uncracked",
    sourceUrl: RULES_URL,
    verifiedAt: "2026-09-07",
  },
  {
    id: "2",
    season: 2027,
    ruleNumber: "2",
    topic: "Altitude goal",
    quotedText: "Reach an impressive 800 feet.",
    sourceUrl: RULES_URL,
    verifiedAt: "2026-09-07",
  },
  {
    id: "3",
    season: 2027,
    ruleNumber: "3",
    topic: "Flight time",
    quotedText: "Safely return to Earth within 37 to 40 seconds.",
    sourceUrl: RULES_URL,
    verifiedAt: "2026-09-07",
  },
  {
    id: "HANDBOOK",
    season: 2027,
    ruleNumber: "2027 Team Handbook",
    topic: "Scoring, deadlines, qualification procedure — PDF not yet read",
    sourceUrl: "https://www.rocketrychallenge.org/resource/2027-team-handbook/",
  },
  {
    id: "MOTORS",
    season: 2027,
    ruleNumber: "Approved Motors List",
    topic: "Permitted motors — PDF not yet read",
    sourceUrl:
      "https://www.rocketrychallenge.org/resource/approved-motors-list/",
  },
  {
    id: "NAR-SC",
    ruleNumber: "NAR Model Rocket Safety Code",
    topic: "Model rocket safety code",
    sourceUrl:
      "https://www.nar.org/safety-information/model-rocket-safety-code/",
  },
];

export const CITATIONS: Record<string, Citation> = Object.fromEntries(
  raw.map((c) => [c.id, citationSchema.parse(c)]),
);

export function resolveCitation(id: string): Citation | undefined {
  return CITATIONS[id];
}
