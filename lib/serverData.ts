import "server-only";
import { courses, getCourse } from "./dummyCourses";
import { adminDb } from "./firebaseAdmin";
import type { Course, GradeDistribution } from "./types";

export async function getAllCoursesWithFirestore(): Promise<Course[]> {
  try {
    const snapshot = await adminDb.collection("courses").get();
    const hardcodedSlugs = new Set(courses.map(c => c.slug));

    const firestoreCourses: Course[] = snapshot.docs
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
        } satisfies Course;
      });

    return [...courses, ...firestoreCourses];
  } catch {
    return courses;
  }
}

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
      // Add only Firestore semesters not already present in hardcoded data
      const hardcodedSemesters = new Set(hardcoded.distributions.map(d => d.semester));
      const newDistributions = firestoreDistributions.filter(d => !hardcodedSemesters.has(d.semester));
      return { ...hardcoded, distributions: [...hardcoded.distributions, ...newDistributions] };
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
