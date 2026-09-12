import type { Metadata } from "next";
import { ModulesIndexClient } from "./ModulesIndexClient";

export const metadata: Metadata = { title: "Course" };

export default function ModulesIndexPage() {
  return <ModulesIndexClient />;
}
