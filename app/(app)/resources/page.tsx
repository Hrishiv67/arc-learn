import Link from "next/link";
import { COURSE_RESOURCES } from "@/content/resources";
import { Container } from "@/components/ui/Container";

export const metadata = { title: "Course resources | ARC Learn" };

export default function ResourcesPage() {
  const groups = [...new Set(COURSE_RESOURCES.map((r) => r.group))];
  return (
    <Container className="py-8 md:py-12">
      <Link href="/modules" className="text-sm text-sky-800 underline">
        ← Back to the course
      </Link>
      <p className="eyebrow mt-8">Keep learning</p>
      <h1 className="mt-2 text-3xl md:text-5xl">
        The right resource, when you need it.
      </h1>
      <p className="mt-4 max-w-2xl text-sky-800">
        Start with the lessons. Use these guides, demonstrations, and forms when
        you design, build, or fly. For season targets, the full current rules
        take priority over older videos and examples.
      </p>
      <nav
        aria-label="Resource categories"
        className="my-6 flex flex-wrap gap-3"
      >
        {groups.map((group, i) => (
          <a
            className="border border-mist-600 px-3 py-2 text-sm hover:bg-mist-300"
            key={group}
            href={`#resource-group-${i}`}
          >
            {group}
          </a>
        ))}
      </nav>
      {groups.map((group, i) => (
        <section
          id={`resource-group-${i}`}
          key={group}
          className="scroll-mt-24 border-t border-mist-600 py-7"
        >
          <h2 className="text-2xl">{group}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {COURSE_RESOURCES.filter((r) => r.group === group).map((r) => (
              <a
                key={r.id}
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="block border border-mist-600 p-5 hover:bg-mist-200 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <h3 className="text-lg">
                  {r.title} <span aria-hidden="true">↗</span>
                </h3>
                <p className="mt-2 text-sm text-sky-800">{r.note}</p>
              </a>
            ))}
          </div>
        </section>
      ))}
    </Container>
  );
}
