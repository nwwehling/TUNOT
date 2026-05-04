import { adminDb } from "@/lib/firebaseAdmin";
import { GRADE_STEPS } from "@/lib/types";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseSlug, courseName, semester, grades } = body;

    if (!courseSlug || !courseName || !semester || !grades) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    for (const key of GRADE_STEPS) {
      if (typeof grades[key] !== "number" || grades[key] < 0) {
        return NextResponse.json({ error: `Invalid grade value for ${key}` }, { status: 400 });
      }
    }

    const totalStudents = GRADE_STEPS.reduce((sum, k) => sum + (grades[k] ?? 0), 0);
    if (totalStudents === 0) {
      return NextResponse.json({ error: "Total students must be greater than 0" }, { status: 400 });
    }

    const passing = GRADE_STEPS.filter(k => k !== "5.0").reduce((sum, k) => sum + (grades[k] ?? 0), 0);
    const passRate = Math.round((passing / totalStudents) * 1000) / 10;

    const weighted = GRADE_STEPS.reduce((sum, k) => sum + parseFloat(k) * (grades[k] ?? 0), 0);
    const avgGrade = Math.round((weighted / totalStudents) * 100) / 100;

    await adminDb.collection("submissions").add({
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
