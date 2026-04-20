"use client";

import { useMemo, useState } from "react";
import type { Course } from "@/lib/types";
import { filterCourses } from "@/lib/filters";
import CourseCard from "./CourseCard";
import FilterBar from "./FilterBar";

export default function CourseList({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState("");
  const [selectedEcts, setSelectedEcts] = useState<number[]>([]);
  const [semesterType, setSemesterType] = useState<"all" | "WS" | "SS">("all");

  const ectsOptions = useMemo(
    () => Array.from(new Set(courses.map(c => c.ects))).sort((a, b) => a - b),
    [courses],
  );

  const toggleEcts = (n: number) =>
    setSelectedEcts(prev => (prev.includes(n) ? prev.filter(v => v !== n) : [...prev, n]));

  const filtered = useMemo(
    () => filterCourses(courses, { query, ects: selectedEcts, semesterType }),
    [courses, query, selectedEcts, semesterType],
  );

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        ectsOptions={ectsOptions}
        selectedEcts={selectedEcts}
        onToggleEcts={toggleEcts}
        semesterType={semesterType}
        onSemesterTypeChange={setSemesterType}
      />
      <div className="font-sans text-xs text-muted mb-3">
        {filtered.length} {filtered.length === 1 ? "Kurs" : "Kurse"}
      </div>
      {filtered.length === 0 ? (
        <div className="border rule bg-white p-10 text-center text-muted font-sans">
          Keine Kurse mit diesen Filtern.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      )}
    </>
  );
}
