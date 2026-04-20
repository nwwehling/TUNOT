import Link from "next/link";

const links = [
  { href: "/", label: "Aktuelles" },
  { href: "/pflichtbereich", label: "Pflicht" },
  { href: "/wahlpflichtbereich", label: "Wahlpflicht" },
  { href: "/wahlbereich", label: "Wahl" },
];

export default function Navbar() {
  return (
    <header className="font-sans">
      <div className="bg-tu-black text-white">
        <div className="mx-auto max-w-7xl px-6 h-8 flex items-center justify-end gap-6 text-xs">
          <span className="hidden sm:inline text-white/70">TU Darmstadt · Informatik · inoffiziell</span>
        </div>
      </div>

      <div className="bg-tu-green">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between gap-8">
          <Link href="/" className="flex items-baseline gap-3 no-underline hover:no-underline">
            <span className="font-serif text-3xl font-semibold tracking-tight text-tu-black">TUNOT</span>
            <span className="hidden md:inline text-[11px] uppercase tracking-[0.18em] text-tu-black/70">
              Notenverzeichnis Informatik
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 text-tu-black hover:bg-tu-greenSoft no-underline hover:no-underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="h-1 bg-tu-greenDark" />
    </header>
  );
}
