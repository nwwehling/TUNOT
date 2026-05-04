import { adminDb } from "@/lib/firebaseAdmin";
import { courses } from "@/lib/dummyCourses";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const hardcodedSlugs = new Set(courses.map(c => c.slug));
    const snapshot = await adminDb.collection("courses").get();

    const firestoreCourses = snapshot.docs
      .filter(doc => !hardcodedSlugs.has(doc.id) && doc.data().isFirestore)
      .map(doc => {
        const d = doc.data();
        return {
          slug: doc.id,
          name: d.name,
          moduleId: d.moduleId || undefined,
          bereich: d.bereich,
          professor: d.professor,
          ects: d.ects,
          description: d.description ?? "",
          distributions: [],
          reviews: [],
        };
      });

    return NextResponse.json(firestoreCourses);
  } catch {
    return NextResponse.json([]);
  }
}
