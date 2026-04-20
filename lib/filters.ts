import type { Course } from "./types";

export type CourseFilters = {
  query?: string;
  ects?: number[];
  semesterType?: "all" | "WS" | "SS";
};

export function filterCourses(courses: Course[], filters: CourseFilters): Course[] {
  const { query, ects, semesterType } = filters;
  return courses.filter(c => {
    if (query) {
      const q = query.trim().toLowerCase();
      if (q && !c.name.toLowerCase().includes(q) && !c.professor.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (ects && ects.length > 0 && !ects.includes(c.ects)) return false;
    if (semesterType && semesterType !== "all") {
      const hasMatch = c.distributions.some(d => d.semester.startsWith(semesterType));
      if (!hasMatch) return false;
    }
    return true;
  });
}

export function latestDistribution(c: Course) {
  return c.distributions[0];
}
