import type { Course } from "@/lib/types";
import CourseRow from "./CourseRow";

export default function SemesterGrid({ bySemester }: { bySemester: Record<number, Course[]> }) {
  const semesters = Object.keys(bySemester).map(Number).sort((a, b) => a - b);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-rule border rule">
      {semesters.map(n => {
        const list = bySemester[n];
        const totalCP = list.reduce((s, c) => s + c.ects, 0);
        return (
          <div key={n} className="bg-paper flex flex-col">
            <div className="bg-tu-greenSoft border-b rule px-3 py-2 flex items-baseline justify-between">
              <h3 className="font-serif text-base text-tu-greenDark">
                {n}. Semester
              </h3>
              <span className="font-sans text-[11px] text-muted tabular-nums">{totalCP} CP</span>
            </div>
            <div className="bg-white flex-1">
              {list.map(c => <CourseRow key={c.slug} course={c} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
