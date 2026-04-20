import Link from "next/link";
import { getBereichCounts, getPopularCourses } from "@/lib/data";
import CourseCard from "@/components/CourseCard";
import Sidebar from "@/components/Sidebar";
import { bereichSidebar } from "@/lib/sidebar";

export default function Home() {
  const counts = getBereichCounts();
  const popular = getPopularCourses();

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <Sidebar title="Studienbereiche" items={bereichSidebar("/")} />
      <div className="flex-1 min-w-0 space-y-12">
        <section className="pb-8 border-b-2 border-tu-greenSoft">
          <div className="label mb-3">Informatik · B.Sc. · Notenverzeichnis</div>
          <h1 className="font-serif text-3xl md:text-[2.4rem] leading-[1.1] max-w-2xl text-tu-greenDark">
            Notenverteilungen, Dozenten und Bewertungen — an einem Ort.
          </h1>
          <p className="max-w-prose mt-4 font-serif text-[1rem] text-ink/75 leading-relaxed">
            TUNOT bündelt, was bislang in Discord-Kanälen verstreut war: vergangene Notenspiegel,
            Bestehensquoten und studentische Einschätzungen.
          </p>
        </section>

        <section>
          <h2 className="section-heading">Bereiche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CategoryLink href="/pflichtbereich" title="Pflichtbereich" count={counts.pflicht}
              desc="Grundlagenmodule, 1.–5. Semester." />
            <CategoryLink href="/wahlpflichtbereich" title="Wahlpflichtbereich" count={counts.wahlpflicht}
              desc="Offener Wahlkatalog." />
            <CategoryLink href="/wahlbereich" title="Wahlbereich" count={counts.wahl}
              desc="Vorlesung · Seminar · Praktikum." />
          </div>
        </section>

        <section>
          <h2 className="section-heading">Beliebte Kurse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popular.map(c => <CourseCard key={c.slug} course={c} />)}
          </div>
        </section>
      </div>
    </div>
  );
}

function CategoryLink({ href, title, desc, count }: { href: string; title: string; desc: string; count: number }) {
  return (
    <Link
      href={href}
      className="group block bg-card rounded-card shadow-card hover:shadow-card-hover border border-rule hover:border-tu-greenSoft px-5 py-4 transition-all duration-200 no-underline hover:no-underline"
    >
      <div className="flex items-baseline justify-between mb-1.5">
        <h3 className="font-serif text-[1.05rem] text-tu-greenDark group-hover:text-tu-greenDark">{title}</h3>
        <span className="font-sans text-[10px] text-muted tabular-nums bg-fill px-2 py-0.5 rounded-full">{count} Kurse</span>
      </div>
      <p className="font-sans text-xs text-muted leading-relaxed">{desc}</p>
    </Link>
  );
}
