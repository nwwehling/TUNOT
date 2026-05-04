"use client";

import { GRADE_STEPS, GradeKey, BEREICH_LABEL, Bereich } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";

type CourseOption = { slug: string; name: string };
type Props = { courses: CourseOption[] };

const emptyGrades = () =>
  Object.fromEntries(GRADE_STEPS.map(k => [k, 0])) as Record<GradeKey, number>;

function generateRecentSemesters(): string[] {
  const semesters: string[] = [];
  const year = new Date().getFullYear();
  for (let y = year; y >= year - 4; y--) {
    semesters.push(`WS${String(y).slice(2)}/${String(y + 1).slice(2)}`);
    semesters.push(`SS${String(y).slice(2)}`);
  }
  return semesters;
}

const STANDARD_SEMESTERS = generateRecentSemesters();
const BEREICH_OPTIONS: Bereich[] = ["pflicht", "wahlpflicht", "wahl"];

export default function SubmitForm({ courses }: Props) {
  const [isNewCourse, setIsNewCourse] = useState(false);

  // Existing course fields
  const [courseSlug, setCourseSlug] = useState("");

  // New course fields
  const [newName, setNewName] = useState("");
  const [newModuleId, setNewModuleId] = useState("");
  const [newBereich, setNewBereich] = useState<Bereich>("wahl");
  const [newEcts, setNewEcts] = useState("");
  const [newProfessor, setNewProfessor] = useState("");

  // Shared fields
  const [semesterChoice, setSemesterChoice] = useState("");
  const [customSemester, setCustomSemester] = useState("");
  const [takenSemesters, setTakenSemesters] = useState<Set<string>>(new Set());
  const [loadingSemesters, setLoadingSemesters] = useState(false);
  const [grades, setGrades] = useState<Record<GradeKey, number>>(emptyGrades());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const activeCourseSlug = isNewCourse ? null : courseSlug;

  useEffect(() => {
    if (!activeCourseSlug) { setTakenSemesters(new Set()); return; }
    setLoadingSemesters(true);
    setSemesterChoice("");
    setCustomSemester("");
    fetch(`/api/courses/${activeCourseSlug}/semesters`)
      .then(r => r.json())
      .then((taken: string[]) => setTakenSemesters(new Set(taken)))
      .catch(() => setTakenSemesters(new Set()))
      .finally(() => setLoadingSemesters(false));
  }, [activeCourseSlug]);

  const semester = semesterChoice === "__custom__" ? customSemester.trim() : semesterChoice;

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

  const courseReady = isNewCourse
    ? newName.trim() && newEcts && newProfessor.trim()
    : !!courseSlug;

  function setGrade(key: GradeKey, raw: string) {
    const val = Math.max(0, parseInt(raw, 10) || 0);
    setGrades(prev => ({ ...prev, [key]: val }));
  }

  function resetForm() {
    setCourseSlug(""); setNewName(""); setNewModuleId(""); setNewBereich("wahl");
    setNewEcts(""); setNewProfessor(""); setSemesterChoice(""); setCustomSemester("");
    setGrades(emptyGrades());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseReady || !semester || totalStudents === 0) {
      setErrorMsg("Bitte alle Pflichtfelder ausfüllen und mindestens eine Note eintragen.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const body = isNewCourse
        ? { isNewCourse: true, courseName: newName.trim(), moduleId: newModuleId.trim(), bereich: newBereich, ects: Number(newEcts), professor: newProfessor.trim(), semester, grades }
        : { isNewCourse: false, courseSlug, courseName: selectedCourse!.name, semester, grades };

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Unbekannter Fehler");
      }
      setStatus("success");
      resetForm();
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
        <button onClick={() => setStatus("idle")} className="text-sm text-tu-green underline underline-offset-2">
          Weitere Verteilung einreichen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden text-sm font-semibold">
        <button
          type="button"
          onClick={() => { setIsNewCourse(false); resetForm(); }}
          className={`flex-1 py-2 transition-colors ${!isNewCourse ? "bg-tu-green text-white" : "hover:bg-muted/30"}`}
        >
          Bestehendes Fach
        </button>
        <button
          type="button"
          onClick={() => { setIsNewCourse(true); resetForm(); }}
          className={`flex-1 py-2 transition-colors ${isNewCourse ? "bg-tu-green text-white" : "hover:bg-muted/30"}`}
        >
          Neues Fach
        </button>
      </div>

      {/* Existing course picker */}
      {!isNewCourse && (
        <div className="space-y-2">
          <label className="label block">Kurs</label>
          <select
            value={courseSlug}
            onChange={e => { setCourseSlug(e.target.value); setSemesterChoice(""); }}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tu-green"
          >
            <option value="">— Kurs auswählen —</option>
            {courses.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* New course fields */}
      {isNewCourse && (
        <div className="space-y-4 rounded-xl border border-border p-4">
          <div className="space-y-2">
            <label className="label block">Kursname <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="z.B. Grundlagen der Informatik"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tu-green"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label block">Modul-ID</label>
              <input
                type="text"
                value={newModuleId}
                onChange={e => setNewModuleId(e.target.value)}
                placeholder="z.B. 20-00-0052"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tu-green"
              />
            </div>
            <div className="space-y-2">
              <label className="label block">ECTS <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={newEcts}
                onChange={e => setNewEcts(e.target.value)}
                placeholder="z.B. 5"
                min={1}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tu-green"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label block">Bereich <span className="text-red-500">*</span></label>
              <select
                value={newBereich}
                onChange={e => setNewBereich(e.target.value as Bereich)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tu-green"
              >
                {BEREICH_OPTIONS.map(b => (
                  <option key={b} value={b}>{BEREICH_LABEL[b]}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="label block">Professor/in <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={newProfessor}
                onChange={e => setNewProfessor(e.target.value)}
                placeholder="z.B. Prof. Dr. Müller"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tu-green"
              />
            </div>
          </div>
        </div>
      )}

      {/* Semester picker — always shown once course is ready */}
      {courseReady && (
        <div className="space-y-2">
          <label className="label block">Semester</label>
          {loadingSemesters ? (
            <p className="text-xs text-muted">Lade vorhandene Semester…</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {STANDARD_SEMESTERS.map(s => {
                const taken = takenSemesters.has(s);
                const selected = semesterChoice === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={taken}
                    onClick={() => setSemesterChoice(selected ? "" : s)}
                    className={[
                      "rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
                      taken
                        ? "border-border text-muted/40 cursor-not-allowed line-through"
                        : selected
                          ? "border-tu-green bg-tu-green text-white"
                          : "border-border hover:border-tu-green hover:text-tu-green",
                    ].join(" ")}
                  >
                    {s}{taken && <span className="ml-1 text-[10px]">✓</span>}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setSemesterChoice(semesterChoice === "__custom__" ? "" : "__custom__")}
                className={[
                  "rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
                  semesterChoice === "__custom__"
                    ? "border-tu-green bg-tu-green text-white"
                    : "border-border hover:border-tu-green hover:text-tu-green",
                ].join(" ")}
              >
                Andere…
              </button>
            </div>
          )}
          {semesterChoice === "__custom__" && (
            <input
              type="text"
              value={customSemester}
              onChange={e => setCustomSemester(e.target.value)}
              placeholder="z.B. SS25 (Nachkl.)"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tu-green"
            />
          )}
        </div>
      )}

      {/* Grade inputs */}
      {courseReady && semesterChoice && (
        <>
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

          {totalStudents > 0 && (
            <div className="rounded-lg bg-muted/30 border border-border px-4 py-3 flex flex-wrap gap-6 text-sm">
              <span><span className="text-muted">Gesamt:</span> <strong>{totalStudents}</strong></span>
              <span><span className="text-muted">Ø Note:</span> <strong>{avgGrade.toFixed(2)}</strong></span>
              <span><span className="text-muted">Bestehensquote:</span> <strong>{passRate.toFixed(1)} %</strong></span>
            </div>
          )}

          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-tu-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-tu-greenDark disabled:opacity-50 transition-colors"
          >
            {status === "loading" ? "Wird eingereicht…" : "Notenverteilung einreichen"}
          </button>
        </>
      )}
    </form>
  );
}
