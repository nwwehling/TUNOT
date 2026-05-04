import Link from "next/link";

export default function Navbar() {
  return (
    <header className="font-sans">
      <div className="bg-tu-black text-white">
        <div className="mx-auto max-w-screen-2xl px-8 h-8 flex items-center justify-end gap-6 text-xs">
          <span className="hidden sm:inline text-white/70">TU Darmstadt · Informatik · inoffiziell</span>
        </div>
      </div>

      <div className="bg-tu-green shadow-subtle">
        <div className="mx-auto max-w-screen-2xl px-8 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-baseline gap-3 no-underline hover:no-underline group">
            <span className="font-serif text-[2rem] font-bold tracking-tight text-tu-black leading-none">TUNOT</span>
            <span className="hidden md:inline text-[10px] uppercase tracking-[0.2em] text-tu-black/60 font-sans font-medium">
              Notenverzeichnis Informatik
            </span>
          </Link>

          <div className="ml-auto">
            <Link
              href="/submit"
              className="inline-flex items-center gap-1.5 rounded-md bg-tu-black/10 hover:bg-tu-black/20 px-3 py-1.5 text-xs font-semibold text-tu-black transition-colors no-underline"
            >
              <span>+ Noten einreichen</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="h-[3px] bg-tu-greenDark" />
    </header>
  );
}
