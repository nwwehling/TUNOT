import Link from "next/link";

export type SidebarItem = { href: string; label: string; active?: boolean };

export default function Sidebar({ items, title }: { items: SidebarItem[]; title?: string }) {
  return (
    <aside className="w-full md:w-52 shrink-0 font-sans text-sm space-y-3">
      <Link
        href="/search"
        className="flex items-center gap-2.5 w-full bg-card border border-rule rounded-card shadow-subtle px-4 py-2.5 text-muted hover:text-ink hover:border-tu-greenSoft hover:bg-tu-greenFaint transition-all no-underline hover:no-underline group"
      >
        <svg className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <span className="text-xs">Kurse suchen…</span>
      </Link>

      {title && <div className="label pt-1">{title}</div>}
      <nav className="bg-card rounded-card shadow-subtle border border-rule overflow-hidden">
        {items.map(it => (
          <Link
            key={it.href}
            href={it.href}
            className={`flex items-center gap-2 px-4 py-2.5 border-b border-rule last:border-b-0 no-underline hover:no-underline transition-colors ${
              it.active
                ? "bg-tu-greenFaint text-tu-greenDark font-semibold border-l-2 border-l-tu-greenDark pl-[14px]"
                : "hover:bg-fill text-ink"
            }`}
          >
            {it.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
