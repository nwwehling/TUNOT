import { courses } from "@/lib/dummyCourses";
import { adminDb } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-admin-token") === process.env.ADMIN_SECRET;
}

function semesterToId(semester: string): string {
  return semester.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

// POST — migrate hardcoded distributions to Firestore
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let migrated = 0;
  let skipped = 0;

  for (const course of courses) {
    if (course.distributions.length === 0) continue;

    const realDistributions = course.distributions.filter(d => !d.isDummy);
    if (realDistributions.length === 0) {
      skipped += course.distributions.length;
      continue;
    }

    // Write course metadata to parent doc so it's visible in Firebase Console
    await adminDb.collection("courses").doc(course.slug).set({
      name: course.name,
      moduleId: course.moduleId ?? "",
      bereich: course.bereich,
      subtype: course.subtype ?? null,
      ects: course.ects,
      isFirestore: false, // hardcoded source — not user-submitted
    }, { merge: true });

    const distRef = adminDb.collection("courses").doc(course.slug).collection("distributions");

    for (const dist of realDistributions) {
      const docId = `hc-${semesterToId(dist.semester)}`;
      const existing = await distRef.doc(docId).get();
      if (existing.exists) { skipped++; continue; }

      await distRef.doc(docId).set({
        semester: dist.semester,
        grades: dist.grades,
        passRate: dist.passRate,
        avgGrade: dist.avgGrade,
        totalStudents: dist.totalStudents,
      });
      migrated++;
    }
  }

  return NextResponse.json({ ok: true, migrated, skipped });
}

// DELETE — remove all hc-* (hardcoded-migrated) distribution docs from Firestore
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let deleted = 0;

  for (const course of courses) {
    const distRef = adminDb.collection("courses").doc(course.slug).collection("distributions");
    const snap = await distRef.get();

    for (const doc of snap.docs) {
      if (doc.id.startsWith("hc-")) {
        await doc.ref.delete();
        deleted++;
      }
    }
  }

  return NextResponse.json({ ok: true, deleted });
}
