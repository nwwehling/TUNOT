import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="font-sans text-[11px] text-muted mb-5 flex items-center flex-wrap gap-0.5">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-0.5">
          {i > 0 && <span className="mx-1.5 text-rule">›</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-ink hover:underline underline-offset-4 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink/60">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
