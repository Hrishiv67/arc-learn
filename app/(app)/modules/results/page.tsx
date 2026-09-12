import type { Metadata } from "next";
import { ResultsClient } from "./ResultsClient";

export const metadata: Metadata = { title: "Your results" };

export default function ResultsPage() {
  return <ResultsClient />;
}
