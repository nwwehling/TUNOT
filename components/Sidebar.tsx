import Link from "next/link";

export type SidebarItem = { href: string; label: string; active?: boolean };

export default function Sidebar({ items, title }: { items: SidebarItem[]; title?: string }) {
  return (
    <aside className="w-full md:w-52 shrink-0 font-sans text-sm">
      {title && <div className="label mb-3">{title}</div>}
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
