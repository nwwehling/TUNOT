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
      </div>
      {d ? (
        <div className="shrink-0 text-right">
          <div className={`font-sans text-xs tabular-nums font-semibold ${d.isDummy ? "text-ink/55 italic" : "text-ink"}`}>
            {d.avgGrade.toFixed(2)}
            {d.isDummy && <span className="ml-1 text-[9px] uppercase tracking-wider text-amber-600 not-italic font-semibold">vorl.</span>}
          </div>
          <div className="font-sans text-[10px] text-muted tabular-nums">{Math.round(d.passRate * 100)}% best.</div>
        </div>
      ) : (
        <div className="shrink-0 font-sans text-[10px] text-muted">—</div>
      )}
    </Link>
  );
}
