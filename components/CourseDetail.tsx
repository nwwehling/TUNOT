"use client";

import { useState } from "react";
import type { Course } from "@/lib/types";
import GradeBarChart from "./GradeBarChart";
import StatTile from "./StatTile";
import ReviewCard from "./ReviewCard";

export default function CourseDetail({ course }: { course: Course }) {
  const [semIdx, setSemIdx] = useState(0);
  const active = course.distributions[semIdx];

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatTile label="Ø Note" value={active.avgGrade.toFixed(2)} sub={active.semester} />
        <StatTile label="Bestehensquote" value={`${Math.round(active.passRate * 100)}%`} sub={active.semester} />
        <StatTile label="Prüflinge" value={active.totalStudents.toString()} sub={active.semester} />
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-serif text-2xl text-tu-greenDark">Notenverteilung</h2>
          <div className="flex gap-2 font-sans text-sm">
            {course.distributions.map((d, i) => (
              <button
                key={d.semester}
                type="button"
                onClick={() => setSemIdx(i)}
                className={`px-3 py-1 border rule ${i === semIdx ? "bg-tu-green text-tu-black border-tu-green" : "bg-white hover:bg-tu-greenFaint"}`}
              >
                {d.semester}
              </button>
            ))}
          </div>
        </div>
        <GradeBarChart distribution={active} />
        <div className="font-sans text-xs text-muted mt-2">
          Noten von 1,0 (sehr gut) bis 5,0 (nicht bestanden). Anzahl Studierender je Note.
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-tu-greenDark mb-3">Beschreibung</h2>
        <p className="max-w-prose font-serif">{course.description}</p>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-tu-greenDark mb-3">Bewertungen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.reviews.map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
