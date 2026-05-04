import "server-only";
import { getCourse } from "./dummyCourses";
import { adminDb } from "./firebaseAdmin";
import type { Course, GradeDistribution } from "./types";

export async function getCourseWithDistributions(slug: string): Promise<Course | undefined> {
  const course = getCourse(slug);
  if (!course) return undefined;

  try {
    const snapshot = await adminDb
      .collection("courses")
      .doc(slug)
      .collection("distributions")
      .get();

    if (snapshot.empty) return course;

    const firestoreDistributions = snapshot.docs.map(
      doc => doc.data() as GradeDistribution
    );

    return { ...course, distributions: [...course.distributions, ...firestoreDistributions] };
  } catch {
    return course;
  }
}
