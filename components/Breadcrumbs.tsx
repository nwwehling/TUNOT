import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="font-sans text-xs text-muted mb-6">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-2">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:underline underline-offset-4">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
