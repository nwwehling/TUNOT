export type Bereich = "pflicht" | "wahlpflicht" | "wahl";
export type Subtype = "vorlesung" | "seminar" | "praktika" | "lehre";

export const GRADE_STEPS = [
  "1.0", "1.3", "1.7", "2.0", "2.3", "2.7",
  "3.0", "3.3", "3.7", "4.0", "5.0",
] as const;

export type GradeKey = (typeof GRADE_STEPS)[number];

export type GradeDistribution = {
  semester: string;
  grades: Record<GradeKey, number>;
  passRate: number;
  avgGrade: number;
  totalStudents: number;
};

export type Review = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  semester: string;
};

export type Fachgebiet = "ki" | "kvs" | "csp" | "swhw" | "theorie";

export const FACHGEBIET_LABEL: Record<Fachgebiet, string> = {
  ki: "Künstliche Intelligenz",
  kvs: "Komplexe vernetzte Systeme",
  csp: "Cybersicherheit und Privatheit",
  swhw: "Software & Hardware",
  theorie: "Theorie",
};

export type Course = {
  slug: string;
  moduleId?: string;
  name: string;
  bereich: Bereich;
  subtype?: Subtype;
  fachgebiete?: Fachgebiet[];
  semester?: number;
  professor: string;
  ects: number;
  description: string;
  distributions: GradeDistribution[];
  reviews: Review[];
};

export const BEREICH_LABEL: Record<Bereich, string> = {
  pflicht: "Pflichtbereich",
  wahlpflicht: "Wahlpflichtbereich",
  wahl: "Wahlbereich",
};

export const SUBTYPE_LABEL: Record<Subtype, string> = {
  vorlesung: "Vorlesung",
  seminar: "Seminar",
  praktika: "Praktikum",
  lehre: "Praktikum in der Lehre",
};
