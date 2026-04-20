import Breadcrumbs from "@/components/Breadcrumbs";
import CourseList from "@/components/CourseList";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import { getCoursesByBereich } from "@/lib/data";
import { bereichSidebar } from "@/lib/sidebar";

export default function Page() {
  const list = getCoursesByBereich("wahlpflicht");
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Sidebar title="Studienbereiche" items={bereichSidebar("/wahlpflichtbereich")} />
      <div className="flex-1 min-w-0">
        <Breadcrumbs items={[{ href: "/", label: "Start" }, { label: "Wahlpflichtbereich" }]} />
        <PageHeading eyebrow="B.Sc. Informatik · Bereich" title="Wahlpflichtbereich"
          sub="Offener Wahlkatalog — wählbare Vertiefungsmodule. Aktuelle Auswahl:" />

        <div className="mb-6 border-l-4 border-tu-green bg-tu-greenFaint px-4 py-3 font-sans text-sm text-ink/80">
          Der Katalog ändert sich je Semester. Unten sind die Module aus dem aktuellen Angebot gelistet.
        </div>

        <CourseList courses={list} />
      </div>
    </div>
  );
}
