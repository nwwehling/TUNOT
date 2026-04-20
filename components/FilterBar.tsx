"use client";

import { Search } from "lucide-react";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  ectsOptions: number[];
  selectedEcts: number[];
  onToggleEcts: (v: number) => void;
  semesterType: "all" | "WS" | "SS";
  onSemesterTypeChange: (v: "all" | "WS" | "SS") => void;
};

export default function FilterBar(props: Props) {
  const {
    query, onQueryChange,
    ectsOptions, selectedEcts, onToggleEcts,
    semesterType, onSemesterTypeChange,
  } = props;

  return (
    <div className="border rule bg-white p-5 mb-8 font-sans">
      <div className="flex items-center gap-3 border-b rule pb-4 mb-4">
        <Search size={16} className="text-muted" />
        <input
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder="Kurs oder Dozent suchen …"
          className="flex-1 bg-transparent outline-none text-base"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <div>
          <div className="label mb-2">ECTS</div>
          <div className="flex flex-wrap gap-2">
            {ectsOptions.map(n => {
              const on = selectedEcts.includes(n);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => onToggleEcts(n)}
                  className={`px-3 py-1 border rule text-sm ${on ? "bg-tu-green text-tu-black border-tu-green" : "bg-white hover:bg-tu-greenFaint"}`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="label mb-2">Semester</div>
          <div className="flex gap-2">
            {(["all", "WS", "SS"] as const).map(s => {
              const on = semesterType === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSemesterTypeChange(s)}
                  className={`px-3 py-1 border rule text-sm ${on ? "bg-tu-green text-tu-black border-tu-green" : "bg-white hover:bg-tu-greenFaint"}`}
                >
                  {s === "all" ? "Alle" : s}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
