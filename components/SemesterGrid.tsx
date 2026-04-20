import type { Course } from "@/lib/types";
import CourseRow from "./CourseRow";

export default function SemesterGrid({ bySemester }: { bySemester: Record<number, Course[]> }) {
  const semesters = Object.keys(bySemester).map(Number).sort((a, b) => a - b);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {semesters.map(n => {
        const list = bySemester[n];
        const totalCP = list.reduce((s, c) => s + c.ects, 0);
        return (
          <div key={n} className="bg-card rounded-card shadow-card border border-rule overflow-hidden flex flex-col">
            <div className="bg-tu-greenFaint border-b border-tu-greenSoft px-4 py-2.5 flex items-baseline justify-between">
              <h3 className="font-serif text-[0.9rem] font-semibold text-tu-greenDark">
                {n}. Semester
              </h3>
              <span className="font-sans text-[10px] text-muted tabular-nums">{totalCP} CP</span>
            </div>
            <div className="flex-1">
              {list.map(c => <CourseRow key={c.slug} course={c} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
