"use client";

import { GRADE_STEPS, GradeKey } from "@/lib/types";
import { useState, useMemo } from "react";

type CourseOption = { slug: string; name: string };

type Props = { courses: CourseOption[] };

const emptyGrades = () =>
  Object.fromEntries(GRADE_STEPS.map(k => [k, 0])) as Record<GradeKey, number>;

export default function SubmitForm({ courses }: Props) {
  const [courseSlug, setCourseSlug] = useState("");
  const [semester, setSemester] = useState("");
  const [grades, setGrades] = useState<Record<GradeKey, number>>(emptyGrades());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const totalStudents = useMemo(
    () => GRADE_STEPS.reduce((sum, k) => sum + (grades[k] ?? 0), 0),
    [grades]
  );

  const passRate = useMemo(() => {
    if (totalStudents === 0) return 0;
    const passing = GRADE_STEPS.filter(k => k !== "5.0").reduce((sum, k) => sum + grades[k], 0);
    return Math.round((passing / totalStudents) * 1000) / 10;
  }, [grades, totalStudents]);

  const avgGrade = useMemo(() => {
    if (totalStudents === 0) return 0;
    const weighted = GRADE_STEPS.reduce((sum, k) => sum + parseFloat(k) * grades[k], 0);
    return Math.round((weighted / totalStudents) * 100) / 100;
  }, [grades, totalStudents]);

  const selectedCourse = courses.find(c => c.slug === courseSlug);

  function setGrade(key: GradeKey, raw: string) {
    const val = Math.max(0, parseInt(raw, 10) || 0);
    setGrades(prev => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseSlug || !semester.trim() || totalStudents === 0) {
      setErrorMsg("Bitte Kurs, Semester und mindestens eine Noteneingabe ausfüllen.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          courseName: selectedCourse!.name,
          semester: semester.trim(),
          grades,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Unbekannter Fehler");
      }
      setStatus("success");
      setCourseSlug("");
      setSemester("");
      setGrades(emptyGrades());
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Fehler beim Einreichen.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-tu-green bg-tu-green/5 p-8 text-center">
        <p className="text-lg font-semibold text-tu-greenDark mb-2">Danke für deinen Beitrag!</p>
        <p className="text-muted text-sm mb-6">Die Notenverteilung wird geprüft und dann freigeschaltet.</p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-tu-green underline underline-offset-2"
        >
          Weitere Verteilung einreichen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Course picker */}
      <div className="space-y-2">
        <label className="label block">Kurs</label>
        <select
          value={courseSlug}
          onChange={e => setCourseSlug(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tu-green"
        >
          <option value="">— Kurs auswählen —</option>
          {courses.map(c => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Semester */}
      <div className="space-y-2">
        <label className="label block">Semester</label>
        <input
          type="text"
          value={semester}
          onChange={e => setSemester(e.target.value)}
          placeholder="z.B. SS25 oder WS24/25"
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tu-green"
        />
      </div>

      {/* Grade inputs */}
      <div className="space-y-3">
        <label className="label block">Notenverteilung (Anzahl Studierende)</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {GRADE_STEPS.map(key => (
            <div key={key} className="flex flex-col items-center gap-1">
              <span className={`text-xs font-semibold ${key === "5.0" ? "text-red-500" : "text-tu-greenDark"}`}>
                {key}
              </span>
              <input
                type="number"
                min={0}
                value={grades[key] === 0 ? "" : grades[key]}
                onChange={e => setGrade(key, e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-tu-green"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Live preview */}
      {totalStudents > 0 && (
        <div className="rounded-lg bg-muted/30 border border-border px-4 py-3 flex flex-wrap gap-6 text-sm">
          <span><span className="text-muted">Gesamt:</span> <strong>{totalStudents}</strong></span>
          <span><span className="text-muted">Ø Note:</span> <strong>{avgGrade.toFixed(2)}</strong></span>
          <span><span className="text-muted">Bestehensquote:</span> <strong>{passRate.toFixed(1)} %</strong></span>
        </div>
      )}

      {errorMsg && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-tu-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-tu-greenDark disabled:opacity-50 transition-colors"
      >
        {status === "loading" ? "Wird eingereicht…" : "Notenverteilung einreichen"}
      </button>
    </form>
  );
}
