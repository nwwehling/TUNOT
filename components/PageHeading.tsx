export default function PageHeading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <header className="mb-8 pb-6 border-b-2 border-tu-greenSoft">
      {eyebrow && <div className="label mb-2">{eyebrow}</div>}
      <h1 className="font-serif text-3xl md:text-[2.2rem] text-tu-greenDark leading-tight">{title}</h1>
      {sub && <p className="max-w-prose mt-3 font-serif text-[0.95rem] text-ink/75 leading-relaxed">{sub}</p>}
    </header>
  );
}
