import Link from "next/link";
import type { Course } from "@/lib/types";
import { latestDistribution } from "@/lib/filters";

export default function CourseRow({ course }: { course: Course }) {
  const d = latestDistribution(course);
  return (
    <Link
      href={`/course/${course.slug}`}
      className="group block border-t rule last:border-b first:border-t-0 hover:bg-tu-greenFaint no-underline hover:no-underline"
    >
      <div className="px-3 py-2.5 flex items-baseline gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-serif text-[15px] leading-tight text-ink group-hover:text-tu-greenDark truncate">
            {course.name}
          </div>
          <div className="font-sans text-[11px] text-muted mt-0.5 truncate">
            {course.professor}
          </div>
        </div>
        <div className="font-sans text-[11px] text-muted tabular-nums shrink-0">
          {course.ects} CP
        </div>
      </div>
      <div className="px-3 pb-2 flex gap-3 font-sans text-[11px] text-muted tabular-nums">
        <span><span className="text-ink font-medium">{d.avgGrade.toFixed(2)}</span> Ø</span>
        <span><span className="text-ink font-medium">{Math.round(d.passRate * 100)}%</span> best.</span>
        <span className="ml-auto">{d.semester}</span>
      </div>
    </Link>
  );
}
