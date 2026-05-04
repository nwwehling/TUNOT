import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CourseDetail from "@/components/CourseDetail";
import Sidebar from "@/components/Sidebar";
import { getAllCourses } from "@/lib/data";
import { getCourseWithDistributions } from "@/lib/serverData";
import { bereichSidebar } from "@/lib/sidebar";
import { BEREICH_LABEL, SUBTYPE_LABEL } from "@/lib/types";

export const revalidate = 60;

export function generateStaticParams() {
  return getAllCourses().map(c => ({ slug: c.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseWithDistributions(slug);
  if (!course) return notFound();

  const bereichHref =
    course.bereich === "pflicht" ? "/pflichtbereich"
    : course.bereich === "wahlpflicht" ? "/wahlpflichtbereich"
    : "/wahlbereich";

  const sidebarActive = course.subtype ? `/wahlbereich/${course.subtype}` : bereichHref;

  const crumbsRaw: { href?: string; label: string }[] = [
    { href: "/", label: "Start" },
    { href: bereichHref, label: BEREICH_LABEL[course.bereich] },
  ];
  if (course.subtype) {
    crumbsRaw.push({ href: `/wahlbereich/${course.subtype}`, label: SUBTYPE_LABEL[course.subtype] });
  }
  crumbsRaw.push({ label: course.name });

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Sidebar title="Studienbereiche" items={bereichSidebar(sidebarActive)} />
      <div className="flex-1 min-w-0">
        <Breadcrumbs items={crumbsRaw} />
        <header className="mb-8 pb-5 border-b-2 border-tu-green">
          <div className="label mb-3">
            {BEREICH_LABEL[course.bereich]}
            {course.subtype && ` · ${SUBTYPE_LABEL[course.subtype]}`}
            {course.moduleId && ` · ${course.moduleId}`}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl leading-tight max-w-3xl text-tu-greenDark">
            {course.name}
          </h1>
          <div className="mt-4 font-sans text-sm text-muted flex flex-wrap gap-x-6 gap-y-1">
            <span>{course.professor}</span>
            <span>{course.ects} ECTS</span>
            <span>{course.distributions.length} Semester erfasst</span>
          </div>
        </header>
        <CourseDetail course={course} />
      </div>
    </div>
  );
}
