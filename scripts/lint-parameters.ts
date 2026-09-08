import path from "node:path";
import { scanTimelessModules } from "@/lib/content/parameterLint";

const reports = scanTimelessModules(path.resolve(import.meta.dirname, ".."));
if (reports.length) {
  console.error("Parameter leak(s) found in timeless module content:");
  for (const r of reports) {
    console.error(`  ${r.modulePath}: ${r.numbers.join(", ")}`);
  }
  process.exit(1);
}
console.log("No parameter leaks found.");
