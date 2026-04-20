"use client";

import { useState, useMemo } from "react";
import { getAllCourses } from "@/lib/data";
import { filterCourses } from "@/lib/filters";
import { BEREICH_LABEL, SUBTYPE_LABEL } from "@/lib/types";
import CourseCard from "@/components/CourseCard";
import Sidebar from "@/components/Sidebar";
import { bereichSidebar } from "@/lib/sidebar";

const allCourses = getAllCourses();

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return filterCourses(allCourses, { query });
  }, [query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <Sidebar title="Studienbereiche" items={bereichSidebar("")} />
      <div className="flex-1 min-w-0">
        <header className="mb-8 pb-6 border-b-2 border-tu-greenSoft">
          <div className="label mb-2">Kurssuche</div>
          <h1 className="font-serif text-3xl md:text-[2.2rem] text-tu-greenDark leading-tight mb-6">
            Kurse suchen
          </h1>
          <div className="relative max-w-xl">
            <input
              type="search"
              autoFocus
              placeholder="Kursname oder Dozent…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-card border border-rule rounded-card px-4 py-3 pr-10 font-sans text-[0.95rem] text-ink placeholder:text-muted shadow-subtle focus:outline-none focus:border-tu-greenDark focus:ring-2 focus:ring-tu-greenFaint transition"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors font-sans text-lg leading-none"
                aria-label="Suche leeren"
              >
                ×
              </button>
            )}
          </div>
        </header>

        {!hasQuery && (
          <div className="font-serif text-ink/50 text-[1rem]">
            Gib einen Kursnamen oder Dozenten ein, um zu suchen.
          </div>
        )}

        {hasQuery && results.length === 0 && (
          <div className="font-serif text-ink/50 text-[1rem]">
            Keine Kurse für „{query}" gefunden.
          </div>
        )}

        {hasQuery && results.length > 0 && (
          <>
            <div className="label mb-4">{results.length} Ergebnis{results.length !== 1 ? "se" : ""}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(c => (
                <div key={c.slug} className="flex flex-col">
                  <CourseCard course={c} />
                  <div className="mt-1.5 font-sans text-[10px] text-muted px-0.5">
                    {BEREICH_LABEL[c.bereich]}
                    {c.subtype && ` · ${SUBTYPE_LABEL[c.subtype]}`}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
