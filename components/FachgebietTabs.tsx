"use client";

import { useMemo, useState } from "react";
import type { Course, Fachgebiet } from "@/lib/types";
import { FACHGEBIET_LABEL } from "@/lib/types";
import CourseList from "./CourseList";

const ORDER: Fachgebiet[] = ["ki", "kvs", "csp", "swhw", "theorie"];

export default function FachgebietTabs({ courses }: { courses: Course[] }) {
  const [active, setActive] = useState<Fachgebiet | "all">("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: courses.length };
    for (const f of ORDER) c[f] = courses.filter(x => x.fachgebiete?.includes(f)).length;
    return c;
  }, [courses]);

  const filtered = active === "all"
    ? courses
    : courses.filter(c => c.fachgebiete?.includes(active));

  return (
    <>
      <div className="flex flex-wrap gap-1 mb-5 border-b rule">
        <TabButton label={`Alle (${counts.all})`} active={active === "all"} onClick={() => setActive("all")} />
        {ORDER.map(f => (
          <TabButton key={f}
            label={`${FACHGEBIET_LABEL[f]} (${counts[f] ?? 0})`}
            active={active === f}
            onClick={() => setActive(f)}
          />
        ))}
      </div>
      <CourseList courses={filtered} />
    </>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-sans text-sm px-3 py-2 -mb-px border-b-2 ${
        active
          ? "border-tu-green text-tu-greenDark font-medium"
          : "border-transparent text-muted hover:text-ink hover:border-rule"
      }`}
    >
      {label}
    </button>
  );
}
