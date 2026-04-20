import Link from "next/link";
import { courses, coursesByBereich } from "@/lib/dummyCourses";
import CourseCard from "@/components/CourseCard";
import Sidebar from "@/components/Sidebar";
import { bereichSidebar } from "@/lib/sidebar";

export default function Home() {
  const counts = {
    pflicht: coursesByBereich("pflicht").length,
    wahlpflicht: coursesByBereich("wahlpflicht").length,
    wahl: coursesByBereich("wahl").length,
  };
  const popular = courses.filter(c => c.distributions.length >= 2).slice(0, 6);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Sidebar title="Studienbereiche" items={bereichSidebar("/")} />
      <div className="flex-1 min-w-0 space-y-10">
        <section className="border-b-2 border-tu-green pb-5">
          <div className="label mb-2">Informatik · B.Sc. · Notenverzeichnis</div>
          <h1 className="font-serif text-3xl md:text-4xl leading-[1.15] max-w-3xl text-tu-greenDark">
            Notenverteilungen, Dozenten und Bewertungen — an einem Ort.
          </h1>
          <p className="max-w-prose mt-3 font-serif text-ink/80">
            TUNOT bündelt, was bislang in Discord-Kanälen verstreut war: vergangene Notenspiegel,
            Bestehensquoten und studentische Einschätzungen.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-tu-greenDark mb-3 pb-1.5 border-b rule">Bereiche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <CategoryLink href="/pflichtbereich" title="Pflichtbereich" count={counts.pflicht}
              desc="Grundlagenmodule, 1.–5. Semester." />
            <CategoryLink href="/wahlpflichtbereich" title="Wahlpflichtbereich" count={counts.wahlpflicht}
              desc="Offener Wahlkatalog." />
            <CategoryLink href="/wahlbereich" title="Wahlbereich" count={counts.wahl}
              desc="Vorlesung · Seminar · Praktikum." />
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-tu-greenDark mb-3 pb-1.5 border-b rule">Beliebte Kurse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {popular.map(c => <CourseCard key={c.slug} course={c} />)}
          </div>
        </section>
      </div>
    </div>
  );
}

function CategoryLink({ href, title, desc, count }: { href: string; title: string; desc: string; count: number }) {
  return (
    <Link href={href} className="block border rule bg-white px-4 py-3 hover:bg-tu-greenFaint transition-colors no-underline hover:no-underline">
      <div className="flex items-baseline justify-between mb-0.5">
        <h3 className="font-serif text-lg text-tu-greenDark">{title}</h3>
        <span className="font-sans text-[11px] text-muted tabular-nums">{count} Kurse</span>
      </div>
      <p className="font-sans text-sm text-muted">{desc}</p>
    </Link>
  );
}
