import Link from "next/link";
import type { Course } from "@/lib/types";
import { latestDistribution } from "@/lib/filters";

export default function CourseRow({ course }: { course: Course }) {
  const d = latestDistribution(course);
  return (
    <Link
      href={`/course/${course.slug}`}
      className="group flex items-center gap-4 px-4 py-3 border-t border-rule first:border-t-0 hover:bg-tu-greenFaint no-underline hover:no-underline transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="font-serif text-[14px] leading-snug text-ink group-hover:text-tu-greenDark transition-colors truncate">
          {course.name}
        </div>
        <div className="font-sans text-[11px] text-muted mt-0.5 truncate">{course.professor}</div>
      </div>
      <div className="shrink-0 text-right">
        <div className="font-sans text-xs tabular-nums font-semibold text-ink">{d.avgGrade.toFixed(2)}</div>
        <div className="font-sans text-[10px] text-muted tabular-nums">{Math.round(d.passRate * 100)}% best.</div>
      </div>
    </Link>
  );
}
