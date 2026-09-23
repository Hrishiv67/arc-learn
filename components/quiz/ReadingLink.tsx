"use client";
import { createContext, useContext } from "react";
export const QuizReadingContext = createContext<
  ((questionId?: string) => void) | null
>(null);
export function ReadingLink({
  href,
  questionId,
}: {
  href: string;
  questionId?: string;
}) {
  const open = useContext(QuizReadingContext);
  return open ? (
    <button
      type="button"
      onClick={() => open(questionId)}
      className="block mt-3 text-sm font-bold underline underline-offset-4"
    >
      Review this in the reading
    </button>
  ) : (
    <a
      href={href}
      className="block mt-3 text-sm font-bold underline underline-offset-4"
    >
      Review this in the reading
    </a>
  );
}
