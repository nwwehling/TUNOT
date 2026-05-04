import { adminDb } from "@/lib/firebaseAdmin";
import { GRADE_STEPS } from "@/lib/types";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

function slugify(name: string): string {
  return (
    "fs-" +
    name
      .toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { semester, grades, isNewCourse } = body;

    for (const key of GRADE_STEPS) {
      if (typeof grades[key] !== "number" || grades[key] < 0) {
        return NextResponse.json({ error: `Ungültiger Notenwert für ${key}` }, { status: 400 });
      }
    }

    const totalStudents = GRADE_STEPS.reduce((sum, k) => sum + (grades[k] ?? 0), 0);
    if (totalStudents === 0) {
      return NextResponse.json({ error: "Mindestens eine Note muss eingetragen sein." }, { status: 400 });
    }

    const passing = GRADE_STEPS.filter(k => k !== "5.0").reduce((sum, k) => sum + (grades[k] ?? 0), 0);
    const passRate = Math.round((passing / totalStudents) * 1000) / 10;
    const weighted = GRADE_STEPS.reduce((sum, k) => sum + parseFloat(k) * (grades[k] ?? 0), 0);
    const avgGrade = Math.round((weighted / totalStudents) * 100) / 100;

    if (isNewCourse) {
      const { courseName, moduleId, bereich, ects, professor } = body;
      if (!courseName || !bereich || !ects || !professor || !semester) {
        return NextResponse.json({ error: "Fehlende Pflichtfelder für neues Fach." }, { status: 400 });
      }
      const courseSlug = slugify(courseName);
      await adminDb.collection("submissions").add({
        isNewCourse: true,
        courseSlug,
        courseName,
        moduleId: moduleId ?? "",
        bereich,
        ects: Number(ects),
        professor,
        semester: semester.trim(),
        grades,
        passRate,
        avgGrade,
        totalStudents,
        status: "pending",
        submittedAt: FieldValue.serverTimestamp(),
      });
    } else {
      const { courseSlug, courseName } = body;
      if (!courseSlug || !courseName || !semester) {
        return NextResponse.json({ error: "Fehlende Pflichtfelder." }, { status: 400 });
      }
      await adminDb.collection("submissions").add({
        isNewCourse: false,
        courseSlug,
        courseName,
        semester: semester.trim(),
        grades,
        passRate,
        avgGrade,
        totalStudents,
        status: "pending",
        submittedAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
