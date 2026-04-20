import {
  courses,
  coursesByBereich,
  coursesByWahlSubtype,
  getCourse,
  pflichtBySemester,
} from "./dummyCourses";
import type { Bereich, Course, Subtype } from "./types";

export function getAllCourses(): Course[] {
  return courses;
}

export function getCoursesByBereich(bereich: Bereich): Course[] {
  return coursesByBereich(bereich);
}

export function getCoursesByWahlSubtype(subtype: Subtype): Course[] {
  return coursesByWahlSubtype(subtype);
}

export function getCourseBySlug(slug: string): Course | undefined {
  return getCourse(slug);
}

export function getPflichtBySemester(): Record<number, Course[]> {
  return pflichtBySemester();
}

export function getPopularCourses(limit = 6): Course[] {
  return courses.filter(c => c.distributions.length >= 2).slice(0, limit);
}

export function getBereichCounts(): Record<Bereich, number> {
  return {
    pflicht: coursesByBereich("pflicht").length,
    wahlpflicht: coursesByBereich("wahlpflicht").length,
    wahl: coursesByBereich("wahl").length,
  };
}
