import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import { coursesByWahlSubtype } from "@/lib/dummyCourses";
import { bereichSidebar } from "@/lib/sidebar";

const subtypes: { slug: "vorlesung" | "seminar" | "praktika" | "lehre"; title: string; desc: string }[] = [
  { slug: "vorlesung", title: "Vorlesung",              desc: "Vertiefende Fachvorlesungen zur Wahl." },
  { slug: "seminar",   title: "Seminar",                desc: "Arbeit mit aktueller Forschung in Kleingruppen." },
  { slug: "praktika",  title: "Praktikum",              desc: "Praktische Projekte und Laborarbeiten." },
  { slug: "lehre",     title: "Praktikum in der Lehre", desc: "Mitwirkung an der Lehre einer Veranstaltung." },
];

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Sidebar title="Studienbereiche" items={bereichSidebar("/wahlbereich")} />
      <div className="flex-1 min-w-0">
        <Breadcrumbs items={[{ href: "/", label: "Start" }, { label: "Wahlbereich" }]} />
        <PageHeading eyebrow="Bereich" title="Wahlbereich"
          sub="Kurse nach freier Wahl — gegliedert in Vorlesungen, Seminare und Praktika." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subtypes.map(s => {
            const count = coursesByWahlSubtype(s.slug).length;
            return (
              <Link key={s.slug} href={`/wahlbereich/${s.slug}`}
                className="block border rule bg-white p-6 hover:bg-tu-greenFaint transition-colors no-underline hover:no-underline">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-serif text-2xl text-tu-greenDark">{s.title}</h3>
                  <span className="font-sans text-xs text-muted tabular-nums">{count} Kurse</span>
                </div>
                <p className="font-serif text-ink/80">{s.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
