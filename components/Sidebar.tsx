import Link from "next/link";

export type SidebarItem = { href: string; label: string; active?: boolean };

export default function Sidebar({ items, title }: { items: SidebarItem[]; title?: string }) {
  return (
    <aside className="w-full md:w-56 shrink-0 font-sans text-sm">
      {title && (
        <div className="label mb-3 text-tu-greenDark">{title}</div>
      )}
      <ul className="divide-y rule border-y rule bg-white">
        {items.map(it => (
          <li key={it.href}>
            <Link
              href={it.href}
              className={`block px-4 py-2.5 no-underline hover:no-underline hover:bg-tu-greenFaint ${
                it.active ? "bg-tu-greenSoft font-semibold" : ""
              }`}
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
