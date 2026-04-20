import Link from "next/link";
import type { Course } from "@/lib/types";
import { FACHGEBIET_LABEL } from "@/lib/types";
import { latestDistribution } from "@/lib/filters";

export default function CourseCard({ course }: { course: Course }) {
  const latest = latestDistribution(course);
  return (
    <Link
      href={`/course/${course.slug}`}
      className="group flex flex-col bg-card rounded-card shadow-card hover:shadow-card-hover transition-all duration-200 no-underline hover:no-underline border border-rule hover:border-tu-greenSoft h-full"
    >
      <article className="p-5 flex flex-col flex-1">
        {course.moduleId && (
          <div className="font-sans text-[10px] tracking-widest text-muted tabular-nums mb-1.5 uppercase">{course.moduleId}</div>
        )}
        <h3 className="font-serif text-[1.05rem] leading-snug mb-1 text-ink group-hover:text-tu-greenDark transition-colors">{course.name}</h3>
        <div className="font-sans text-xs text-muted mb-3">
          {course.professor} · {course.ects} CP{course.semester && ` · ${course.semester}. Sem.`}
        </div>
        {course.fachgebiete && course.fachgebiete.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {course.fachgebiete.map(f => (
              <span key={f} className="font-sans text-[10px] px-2 py-0.5 bg-tu-greenFaint text-tu-greenDark rounded-full border border-tu-greenSoft font-medium">
                {FACHGEBIET_LABEL[f]}
              </span>
            ))}
          </div>
        )}
        <div className="grid grid-cols-3 gap-2 border-t border-rule pt-3 mt-auto">
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
      <div className="font-sans text-[9px] uppercase tracking-wider text-muted mb-0.5">{label}</div>
      <div className="font-serif text-[1rem] tabular-nums font-semibold">{value}</div>
    </div>
  );
}
