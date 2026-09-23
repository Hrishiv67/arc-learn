"use client";
import {
  CHALLENGE_NOTES,
  type NoteId,
} from "@/content/modules/01-this-years-challenge/notes";
import { QuizImage } from "./QuizImage";
export function QuizReadingPanel({
  active,
  onSelect,
  onClose,
}: {
  active: NoteId;
  onSelect: (id: NoteId) => void;
  onClose: () => void;
}) {
  const note = CHALLENGE_NOTES.find((n) => n.id === active)!;
  return (
    <aside
      id="quiz-reading"
      aria-label="Condensed lesson"
      className="border border-mist-600 bg-mist-200 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto self-start order-first lg:order-last"
    >
      <div className="flex justify-between items-start gap-4 p-5 border-b border-mist-600">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-sky-800">
            Module 01 / Quick reference
          </p>
          <h2 className="font-heading font-bold text-xl mt-1">Lesson notes</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-sm underline underline-offset-4 py-2"
        >
          Close notes
        </button>
      </div>
      <div className="p-5">
        <label
          htmlFor="note-topic"
          className="block text-xs font-bold mb-2 text-sky-800"
        >
          Jump to a topic
        </label>
        <select
          id="note-topic"
          value={active}
          onChange={(e) => onSelect(e.target.value as NoteId)}
          className="w-full border border-navy-300 bg-white p-3 text-sm rounded-none"
        >
          {CHALLENGE_NOTES.map((n) => (
            <option key={n.id} value={n.id}>
              {n.title}
            </option>
          ))}
        </select>
        <h3 className="font-heading text-xl font-bold mt-6 mb-4">
          {note.title}
        </h3>
        <ul className="space-y-4 text-sm leading-relaxed">
          {note.points.map((p) => (
            <li key={p} className="border-l-2 border-mist-600 pl-3">
              {p}
            </li>
          ))}
        </ul>
        {(active === "parts" || active === "stability") && (
          <div className="mt-5">
            <QuizImage name={active} />
          </div>
        )}
        <p className="mt-6 border-t border-mist-600 pt-4 text-xs text-sky-800">
          Your place and answers stay here while you read.
        </p>
      </div>
    </aside>
  );
}
