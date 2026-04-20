export default function PageHeading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <header className="mb-6 pb-4 border-b-2 border-tu-green">
      {eyebrow && <div className="label mb-2">{eyebrow}</div>}
      <h1 className="font-serif text-3xl md:text-4xl text-tu-greenDark">{title}</h1>
      {sub && <p className="max-w-prose mt-3 font-serif text-ink/80">{sub}</p>}
    </header>
  );
}
