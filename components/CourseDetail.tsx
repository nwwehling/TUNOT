"use client";

import { useState, useMemo } from "react";
import type { Course, GradeDistribution } from "@/lib/types";
import GradeBarChart from "./GradeBarChart";
import StatTile from "./StatTile";
import ReviewCard from "./ReviewCard";

function semesterSortKey(s: string): number {
  const nachkl = s.includes("Nachkl") ? 0.1 : 0;
  const ss = s.match(/^SS(\d{2})/);
  if (ss) return 2000 + parseInt(ss[1]) + 0.3 + nachkl;
  const ws = s.match(/^WS(\d{2})\/\d{2}/);
  if (ws) return 2000 + parseInt(ws[1]) + 0.8 + nachkl;
  return 0;
}

function sortedDistributions(distributions: GradeDistribution[]): GradeDistribution[] {
  return [...distributions].sort((a, b) => semesterSortKey(b.semester) - semesterSortKey(a.semester));
}

export default function CourseDetail({ course }: { course: Course }) {
  const sorted = useMemo(() => sortedDistributions(course.distributions), [course.distributions]);
  const [semIdx, setSemIdx] = useState(0);
  const active = sorted[semIdx];

  if (!active) return null;

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatTile label="Ø Note" value={active.avgGrade.toFixed(2)} sub={active.semester} />
        <StatTile label="Bestehensquote" value={`${Math.round(active.passRate * 100)}%`} sub={active.semester} />
        <StatTile label="Prüflinge" value={active.totalStudents.toString()} sub={active.semester} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4 gap-4">
          <h2 className="section-heading m-0 border-0 p-0 shrink-0">Notenverteilung</h2>
          {sorted.length > 1 && (
            <div className="overflow-x-auto">
              <div className="flex gap-1.5 font-sans text-xs pb-1">
                {sorted.map((d, i) => (
                  <button
                    key={d.semester}
                    type="button"
                    onClick={() => setSemIdx(i)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded border transition-colors ${
                      i === semIdx
                        ? "bg-tu-greenDark text-white border-tu-greenDark"
                        : "bg-card border-rule text-muted hover:bg-tu-greenFaint hover:border-tu-greenSoft"
                    }`}
                  >
                    {d.semester}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="bg-card rounded-card shadow-card border border-rule p-5">
          <GradeBarChart distribution={active} />
        </div>
        <div className="font-sans text-xs text-muted mt-2 pl-1">
          Noten von 1,0 (sehr gut) bis 5,0 (nicht bestanden). Anzahl Studierender je Note.
        </div>
      </section>

      <section>
        <h2 className="section-heading">Beschreibung</h2>
        <p className="max-w-prose font-serif text-ink/85 leading-relaxed">{course.description}</p>
      </section>

      {course.reviews.length > 0 && (
        <section>
          <h2 className="section-heading">Bewertungen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.reviews.map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
