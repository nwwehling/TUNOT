import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import SemesterGrid from "@/components/SemesterGrid";
import { pflichtBySemester } from "@/lib/dummyCourses";
import { bereichSidebar } from "@/lib/sidebar";

export default function Page() {
  const bySem = pflichtBySemester();
  const totalCourses = Object.values(bySem).flat().length;
  const totalCP = Object.values(bySem).flat().reduce((s, c) => s + c.ects, 0);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Sidebar title="Studienbereiche" items={bereichSidebar("/pflichtbereich")} />
      <div className="flex-1 min-w-0">
        <Breadcrumbs items={[{ href: "/", label: "Start" }, { label: "Pflichtbereich" }]} />
        <PageHeading eyebrow="B.Sc. Informatik · Bereich" title="Pflichtbereich"
          sub="Studienverlauf der verpflichtenden Module, gegliedert nach Semestern. Klick auf einen Kurs öffnet Notenverteilung und Bewertungen." />

        <div className="flex gap-6 font-sans text-xs text-muted mb-5">
          <span><span className="text-ink font-medium tabular-nums">{totalCourses}</span> Module</span>
          <span><span className="text-ink font-medium tabular-nums">{totalCP}</span> CP gesamt</span>
          <span><span className="text-ink font-medium">5</span> Semester</span>
        </div>

        <SemesterGrid bySemester={bySem} />
      </div>
    </div>
  );
}
