import Link from "next/link";
import type { Course } from "@/lib/types";
import { FACHGEBIET_LABEL } from "@/lib/types";
import { latestDistribution } from "@/lib/filters";

export default function CourseCard({ course }: { course: Course }) {
  const latest = latestDistribution(course);
  return (
    <Link
      href={`/course/${course.slug}`}
      className="group block border rule bg-white hover:bg-tu-greenFaint transition-colors no-underline hover:no-underline"
    >
      <article className="p-4">
        {course.moduleId && (
          <div className="font-sans text-[10px] tracking-wider text-muted tabular-nums mb-1">{course.moduleId}</div>
        )}
        <h3 className="font-serif text-lg leading-tight mb-0.5 text-ink group-hover:text-tu-greenDark">{course.name}</h3>
        <div className="font-sans text-xs text-muted mb-2 line-clamp-2">
          {course.professor} · {course.ects} CP
          {course.semester && ` · ${course.semester}. Sem.`}
        </div>
        {course.fachgebiete && course.fachgebiete.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {course.fachgebiete.map(f => (
              <span key={f} className="font-sans text-[10px] px-1.5 py-0.5 bg-tu-greenFaint text-tu-greenDark border border-tu-greenSoft">
                {FACHGEBIET_LABEL[f]}
              </span>
            ))}
          </div>
        )}
        <div className="grid grid-cols-3 gap-2 border-t rule pt-2.5">
          <Stat label="Ø Note" value={latest.avgGrade.toFixed(2)} />
          <Stat label="Bestanden" value={`${Math.round(latest.passRate * 100)}%`} />
          <Stat label="Prüflinge" value={latest.totalStudents.toString()} />
        </div>
      </article>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-sans text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div className="font-serif text-base tabular-nums">{value}</div>
    </div>
  );
}
