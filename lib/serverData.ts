import "server-only";
import { getCourse } from "./dummyCourses";
import { adminDb } from "./firebaseAdmin";
import type { Course, GradeDistribution } from "./types";

export async function getCourseWithDistributions(slug: string): Promise<Course | undefined> {
  const hardcoded = getCourse(slug);

  try {
    const distSnap = await adminDb
      .collection("courses")
      .doc(slug)
      .collection("distributions")
      .get();

    const firestoreDistributions = distSnap.docs.map(doc => doc.data() as GradeDistribution);

    if (hardcoded) {
      if (distSnap.empty) return hardcoded;
      return { ...hardcoded, distributions: [...hardcoded.distributions, ...firestoreDistributions] };
    }

    // Course not in hardcoded data — check Firestore for course metadata
    const courseSnap = await adminDb.collection("courses").doc(slug).get();
    if (!courseSnap.exists) return undefined;

    const meta = courseSnap.data()!;
    return {
      slug,
      name: meta.name,
      moduleId: meta.moduleId || undefined,
      bereich: meta.bereich,
      professor: meta.professor,
      ects: meta.ects,
      description: meta.description ?? "",
      distributions: firestoreDistributions,
      reviews: [],
    } satisfies Course;
  } catch {
    return hardcoded;
  }
}
