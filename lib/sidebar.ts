import type { SidebarItem } from "@/components/Sidebar";

export function bereichSidebar(active: string): SidebarItem[] {
  const items: SidebarItem[] = [
    { href: "/pflichtbereich", label: "Pflichtbereich" },
    { href: "/wahlpflichtbereich", label: "Wahlpflichtbereich" },
    { href: "/wahlbereich", label: "Wahlbereich" },
    { href: "/wahlbereich/vorlesung", label: "— Vorlesung" },
    { href: "/wahlbereich/seminar", label: "— Seminar" },
    { href: "/wahlbereich/praktika", label: "— Praktikum" },
    { href: "/wahlbereich/lehre", label: "— Praktikum i. d. Lehre" },
  ];
  return items.map(i => ({ ...i, active: i.href === active }));
}
