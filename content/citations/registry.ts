import { citationSchema, type Citation } from "@/lib/schemas/citation";
import { SEASON } from "@/content/seasons/2027";

// Topic links use the actual section numbers in the full rules, not the
// three numbered bullets on the resource landing page. No invented quotes.
const raw: Citation[] = [
  {
    id: "1",
    season: SEASON.year,
    ruleNumber: "4.4",
    topic: "Payload",
    sourceUrl: SEASON.rulesUrl,
  },
  {
    id: "2",
    season: SEASON.year,
    ruleNumber: "4.6",
    topic: "Altitude scoring",
    sourceUrl: SEASON.rulesUrl,
  },
  {
    id: "3",
    season: SEASON.year,
    ruleNumber: "4.5",
    topic: "Duration scoring",
    sourceUrl: SEASON.rulesUrl,
  },
  {
    id: "HANDBOOK",
    ruleNumber: "Team handbook",
    topic: "Competition guidance",
    sourceUrl:
      "https://www.rocketrychallenge.org/wp-content/uploads/ARC2027_Handbook.pdf",
  },
  {
    id: "MOTORS",
    ruleNumber: "Approved motors",
    topic: "Permitted motors",
    sourceUrl:
      "https://www.rocketrychallenge.org/resource/approved-motors-list/",
  },
  {
    id: "NAR-SC",
    ruleNumber: "NAR safety code",
    topic: "Model rocket safety",
    sourceUrl: "https://www.nar.org/ModelRocketSafetyCode",
  },
];
export const CITATIONS: Record<string, Citation> = Object.fromEntries(
  raw.map((c) => [c.id, citationSchema.parse(c)]),
);
export function resolveCitation(id: string): Citation | undefined {
  return CITATIONS[id];
}
