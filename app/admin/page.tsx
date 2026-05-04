"use client";

import { useEffect, useState } from "react";

type Submission = {
  id: string;
  courseSlug: string;
  courseName: string;
  semester: string;
  grades: Record<string, number>;
  passRate: number;
  avgGrade: number;
  totalStudents: number;
  status: string;
};

export default function AdminPage() {
  const [token, setToken] = useState<string>("");
  const [input, setInput] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin-token");
    if (stored) {
      setToken(stored);
      fetchSubmissions(stored);
    }
  }, []);

  async function fetchSubmissions(t: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/submissions", {
        headers: { "x-admin-token": t },
      });
      if (res.status === 401) { setError("Falsches Passwort."); setToken(""); sessionStorage.removeItem("admin-token"); return; }
      if (!res.ok) throw new Error("Serverfehler");
      setSubmissions(await res.json());
    } catch {
      setError("Fehler beim Laden der Einreichungen.");
    } finally {
      setLoading(false);
    }
  }

  function login(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("admin-token", input);
    setToken(input);
    fetchSubmissions(input);
  }

  async function act(id: string, action: "approve" | "reject") {
    setActionLoading(id + action);
    try {
      const res = await fetch(`/api/submissions/${id}/${action}`, {
        method: "POST",
        headers: { "x-admin-token": token },
      });
      if (!res.ok) throw new Error();
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } catch {
      alert("Aktion fehlgeschlagen.");
    } finally {
      setActionLoading(null);
    }
  }

  if (!token) {
    return (
      <div className="max-w-sm mx-auto py-24 px-4">
        <h1 className="font-serif text-2xl text-tu-greenDark mb-6">Admin-Bereich</h1>
        <form onSubmit={login} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Passwort"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tu-green"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-tu-green px-4 py-2 text-sm font-semibold text-white hover:bg-tu-greenDark transition-colors"
          >
            Anmelden
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-tu-greenDark">Ausstehende Einreichungen</h1>
        <button
          onClick={() => { sessionStorage.removeItem("admin-token"); setToken(""); setSubmissions([]); }}
          className="text-xs text-muted hover:text-foreground"
        >
          Abmelden
        </button>
      </div>

      {loading && <p className="text-muted text-sm">Lade…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && submissions.length === 0 && (
        <p className="text-muted text-sm">Keine ausstehenden Einreichungen.</p>
      )}

      <div className="space-y-4">
        {submissions.map(s => (
          <div key={s.id} className="rounded-xl border border-border p-5 space-y-4">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span className="font-semibold text-tu-greenDark">{s.courseName}</span>
              <span className="text-muted">{s.semester}</span>
              <span className="text-muted">{s.totalStudents} Studierende</span>
              <span className="text-muted">Ø {s.avgGrade.toFixed(2)}</span>
              <span className="text-muted">{s.passRate.toFixed(1)} % bestanden</span>
            </div>

            <div className="grid grid-cols-6 gap-2 text-xs text-center">
              {Object.entries(s.grades).map(([grade, count]) => (
                <div key={grade} className="rounded bg-muted/30 px-1 py-1.5">
                  <div className="font-semibold text-tu-greenDark">{grade}</div>
                  <div>{count}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => act(s.id, "approve")}
                disabled={actionLoading !== null}
                className="rounded-lg bg-tu-green px-4 py-1.5 text-xs font-semibold text-white hover:bg-tu-greenDark disabled:opacity-50 transition-colors"
              >
                {actionLoading === s.id + "approve" ? "…" : "Freischalten"}
              </button>
              <button
                onClick={() => act(s.id, "reject")}
                disabled={actionLoading !== null}
                className="rounded-lg border border-border px-4 py-1.5 text-xs font-semibold hover:bg-muted/30 disabled:opacity-50 transition-colors"
              >
                {actionLoading === s.id + "reject" ? "…" : "Ablehnen"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
