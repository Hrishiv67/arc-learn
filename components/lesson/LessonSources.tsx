import { COURSE_RESOURCES } from "@/content/resources";

export function LessonSources({ ids }: { ids: string[] }) {
  return (
    <div className="mt-4 border-t border-mist-600 pt-4 text-sm">
      <p className="font-bold text-arc-navy">Go deeper when you need it</p>
      <ul>
        {ids.map((id) => {
          const source = COURSE_RESOURCES.find((r) => r.id === id);
          return source ? (
            <li key={id}>
              <a href={source.href} target="_blank" rel="noreferrer">
                {source.title}
              </a>{" "}
              — {source.note}
            </li>
          ) : null;
        })}
      </ul>
      <a href="/resources">All course resources →</a>
    </div>
  );
}
