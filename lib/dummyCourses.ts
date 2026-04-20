import type { Course, GradeDistribution } from "./types";

const dist = (
  semester: string,
  grades: number[],
  totalStudents: number,
): GradeDistribution => {
  const keys = ["1.0", "1.3", "1.7", "2.0", "2.3", "2.7", "3.0", "3.3", "3.7", "4.0", "5.0"] as const;
  const gradeMap = Object.fromEntries(keys.map((k, i) => [k, grades[i] ?? 0])) as GradeDistribution["grades"];
  const failed = gradeMap["5.0"];
  const passed = totalStudents - failed;
  const passRate = totalStudents === 0 ? 0 : passed / totalStudents;
  const numeric = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0, 5.0];
  const weighted = grades.reduce((sum, count, i) => sum + count * numeric[i], 0);
  const total = grades.reduce((s, n) => s + n, 0) || 1;
  const avgGrade = Math.round((weighted / total) * 100) / 100;
  return { semester, grades: gradeMap, passRate, avgGrade, totalStudents };
};

// Generate a plausible seminar distribution seeded by moduleId for stable dummy data.
function seminarDist(moduleId: string, capacity: number): GradeDistribution {
  let seed = 0;
  for (let i = 0; i < moduleId.length; i++) seed = (seed * 31 + moduleId.charCodeAt(i)) >>> 0;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0x100000000; };
  const enrolled = Math.max(8, Math.floor(capacity * (0.45 + rand() * 0.5)));
  // Seminars skew to good grades. Weights over grades 1.0..5.0
  const weights = [18, 22, 20, 14, 10, 6, 4, 3, 1, 1, 2].map(w => w * (0.7 + rand() * 0.6));
  const total = weights.reduce((a, b) => a + b, 0);
  const grades = weights.map(w => Math.max(0, Math.round((w / total) * enrolled)));
  const diff = enrolled - grades.reduce((a, b) => a + b, 0);
  grades[3] += diff; // adjust into grade 2.0 bucket
  return dist("SS26", grades, enrolled);
}

function seminar(moduleId: string, name: string, professor: string, capacity: number): Course {
  const slug = "sem-" + moduleId.replace(/-/g, "");
  return {
    slug, moduleId, name, bereich: "wahl", subtype: "seminar", professor, ects: 3,
    description: `Seminar im Wahlbereich Informatik. Modulnummer ${moduleId}.`,
    distributions: [ seminarDist(moduleId, capacity) ],
    reviews: [],
  };
}

function praktikumDist(moduleId: string, capacity: number): GradeDistribution {
  let seed = 0;
  for (let i = 0; i < moduleId.length; i++) seed = (seed * 31 + moduleId.charCodeAt(i)) >>> 0;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0x100000000; };
  const enrolled = Math.max(5, Math.floor(capacity * (0.4 + rand() * 0.55)));
  const weights = [22, 24, 20, 14, 10, 6, 4, 2, 1, 1, 2].map(w => w * (0.7 + rand() * 0.6));
  const total = weights.reduce((a, b) => a + b, 0);
  const grades = weights.map(w => Math.max(0, Math.round((w / total) * enrolled)));
  const diff = enrolled - grades.reduce((a, b) => a + b, 0);
  grades[3] += diff;
  return dist("SS26", grades, enrolled);
}

function praktikum(moduleId: string, name: string, professor: string, capacity: number): Course {
  const slug = "pk-" + moduleId.replace(/-/g, "");
  return {
    slug, moduleId, name, bereich: "wahl", subtype: "praktika", professor, ects: 6,
    description: `Praktikum / Projektpraktikum im Wahlbereich Informatik. Modulnummer ${moduleId}.`,
    distributions: [ praktikumDist(moduleId, capacity) ],
    reviews: [],
  };
}

function praktika(): Course[] {
  return [
    praktikum("18-sm-1020", "Praktikum Kommunikationsnetze I", "Prof. Dr. rer. nat. Björn Scheuermann", 67),
    praktikum("18-sm-1030", "Projekt Kommunikationsnetze I", "Prof. Dr. rer. nat. Björn Scheuermann", 9),
    praktikum("18-sm-2070", "Praktikum Kommunikationsnetze II", "Prof. Dr. rer. nat. Björn Scheuermann", 25),
    praktikum("18-sm-2080", "Projekt Kommunikationsnetze II", "Prof. Dr. rer. nat. Björn Scheuermann", 5),
    praktikum("20-00-0114", "Hacker Contest", "Prof. Dr. phil. nat. Marc Fischlin; Matthias Göhring; M.Sc. Tobias Hamann", 62),
    praktikum("20-00-0189", "Praktikum Algorithmen", "Prof. Dr. rer. nat. Karsten Weihe", 29),
    praktikum("18-de-2060", "Serious Games Praktikum", "PD Dr.-Ing. Stefan Peter Göbel", 80),
    praktikum("20-00-0248", "Robotik-Projektpraktikum", "Prof. Dr. rer. nat. Oskar von Stryk", 22),
    praktikum("20-00-0276", "Praktikum Algorithmen II (Vertiefung)", "Prof. Dr. rer. nat. Karsten Weihe", 2),
    praktikum("20-00-0306", "Implementierung von Programmiersprachen", "Prof. Dr.-Ing. Ermira Mezini", 23),
    praktikum("20-00-0357", "Integriertes Robotik-Projekt 2", "Prof. Dr. rer. nat. Oskar von Stryk", 6),
    praktikum("20-00-0412", "Praktikum aus Künstlicher Intelligenz", "Prof. Dr. rer. nat. Kristian Kersting", 192),
    praktikum("20-00-0418", "Praktikum Visual Computing", "Prof. Dr.-Ing. Jörn Kohlhammer; Prof. Dr. Arjan Kuijper; Ph.D. Anirban Mukhopadhyay; Prof. Ph. D. Stefan Roth; Prof. Dr.-Ing. André Stork", 137),
    praktikum("20-00-0485", "Projektpraktikum Telekooperation", "Prof. Dr. rer. nat. Eberhard Max Mühlhäuser; Dr. rer. nat. Ephraim Zimmer", 1),
    praktikum("20-00-0537", "Fortgeschrittenes Praktikum Visual Computing", "Prof. Dr. techn. Wolf Dietrich Fellner; Prof. Dr.-Ing. Jörn Kohlhammer; Prof. Dr. Arjan Kuijper; Ph.D. Anirban Mukhopadhyay; Prof. Ph. D. Stefan Roth; Prof. Dr.-Ing. André Stork", 10),
    praktikum("20-00-0603", "Implementierung in Forensik und Mediensicherheit", "Honorarprof. Dr.-Ing. Martin Steinebach", 27),
    praktikum("20-00-0647", "Praktikum zu Technischer Informatik", "Prof. Dr.-Ing. Andreas Koch", 6),
    praktikum("18-de-2070", "Serious Games Projektseminar", "PD Dr.-Ing. Stefan Peter Göbel", 62),
    praktikum("20-00-0673", "Software Development Tools", "Prof. Dr.-Ing. Ermira Mezini", 49),
    praktikum("20-00-0753", "Lernende Roboter: Integriertes Projekt - Teil 1", "Prof. Ph. D. Jan Peters", 58),
    praktikum("20-00-0754", "Lernende Roboter: Integriertes Projekt - Teil 2", "Prof. Ph. D. Jan Peters", 20),
    praktikum("20-00-0959", "Embedded System Hands-On 1: Entwurf und Realisierung von Hardware/Software-Systemen", "Prof. Dr.-Ing. Andreas Koch", 67),
    praktikum("20-00-1001", "Fortgeschrittene Themen in Eingebetteten Systemen und ihren Anwendungen", "Prof. Dr.-Ing. Andreas Koch", 7),
    praktikum("20-00-1008", "Parallele Programmiertechnologie", "Prof. Dr. rer. nat. Felix Wolf; M.Sc. Taylan Özden", 23),
    praktikum("20-00-1013", "Compiler Tooling", "Prof. Dr. Christian Bischof", 28),
    praktikum("20-00-1020", "Praktikum Friedens-, Sicherheits- und Kriseninformatik", "Prof. Dr. Dr. Christian Reuter", 41),
    praktikum("20-00-1027", "Projektpraktikum Friedens- und Kriseninformatik", "Prof. Dr. Dr. Christian Reuter", 7),
    praktikum("20-00-1029", "Projektpraktikum Algorithmik", "Prof. Dr. rer. nat. Karsten Weihe", 4),
    praktikum("20-00-1041", "Systems Praktikum", "Prof. Dr. rer. nat. Carsten Binnig; Prof. Ph.D. Zsolt Istvan", 131),
    praktikum("20-00-1042", "Systems Projektpraktikum", "Prof. Dr. rer. nat. Carsten Binnig; Prof. Ph.D. Zsolt Istvan", 49),
    praktikum("20-00-1108", "Expertenpraktikum im Robot Learning", "Prof. Ph. D. Jan Peters", 1),
    praktikum("20-00-1130", "Leistungsanalyse und Modellierung von Softwaresystemen", "Prof. Ph.D. Zsolt Istvan", 35),
    praktikum("20-00-1137", "Projektpraktikum – Systematische Analyse der Sicherheit in Embedded und AI-basierten Systemen", "Prof. Dr.-Ing. Ahmad-Reza Sadeghi", 6),
    praktikum("20-00-1138", "Praktikum – Systematische Analyse der Sicherheit in Embedded und KI-basierten Systemen", "Prof. Dr.-Ing. Ahmad-Reza Sadeghi", 22),
    praktikum("20-00-1166", "Praktikum Augmented and Virtual Reality", "Prof. Dr. Arjan Kuijper; Dr.-Ing. Pavel Rojtberg", 7),
    praktikum("20-00-1170", "Praktikum zur intelligenten Robotermanipulation: Part II", "Prof. Ph.D. Georgia Chalvatzaki", 21),
    praktikum("20-00-1199", "Praktikum Verteilte Robotiksysteme", "Prof. Dr. Roderich Groß", 22),
    praktikum("20-00-1217", "KI-Startup: Von der Idee zur Umsetzung", "Prof. Dr. rer. pol. Peter Buxmann; Dr. rer. pol. Nihal Wahl-Islam", 61),
    praktikum("20-00-1221", "Praktikum KI und Sicherheit in der Praxis", "Dr. Oren Halvani; Prof. Dr. rer. nat. Michael Waidner", 38),
    praktikum("20-00-1222", "Sketching with Hardware", "Prof. Dr. rer. nat. Florian Benjamin Müller", 27),
    praktikum("20-00-1223", "3D Scanning & Spatial Learning", "Prof. Dr.-Ing. Justus Thies", 28),
    praktikum("20-00-1245", "Software Engineering for Kids", "Prof. Dr. rer. nat. Isabella Graßl", 61),
    praktikum("20-00-1249", "Practical Side-Channel Analysis Attacks on Embedded Processors", "Prof. Dr. Amir Moradi", 17),
  ];
}

function vorlesungDist(moduleId: string, capacity: number, sem: string): GradeDistribution {
  let seed = 0;
  for (let i = 0; i < moduleId.length + sem.length; i++) {
    const ch = i < moduleId.length ? moduleId.charCodeAt(i) : sem.charCodeAt(i - moduleId.length);
    seed = (seed * 31 + ch) >>> 0;
  }
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0x100000000; };
  const enrolled = Math.max(30, Math.floor(capacity * (0.35 + rand() * 0.45)));
  // Vorlesungen: broader spread, notable fail rate
  const weights = [10, 14, 18, 22, 24, 22, 18, 14, 10, 7, 22].map(w => w * (0.75 + rand() * 0.5));
  const total = weights.reduce((a, b) => a + b, 0);
  const grades = weights.map(w => Math.max(0, Math.round((w / total) * enrolled)));
  const diff = enrolled - grades.reduce((a, b) => a + b, 0);
  grades[4] += diff;
  return dist(sem, grades, enrolled);
}

function vorlesung(
  moduleId: string, name: string, professor: string, ects: number,
  fachgebiete: NonNullable<Course["fachgebiete"]>, capacity: number,
  realDistributions?: GradeDistribution[],
): Course {
  const slug = "vl-" + moduleId.replace(/-/g, "");
  return {
    slug, moduleId, name, bereich: "wahl", subtype: "vorlesung", fachgebiete,
    professor, ects,
    description: `Wahlbereich-Vorlesung. Modulnummer ${moduleId}.`,
    distributions: realDistributions && realDistributions.length > 0
      ? realDistributions
      : [
          vorlesungDist(moduleId, capacity, "SS25"),
          vorlesungDist(moduleId, capacity, "SS24"),
        ],
    reviews: [],
  };
}

function vorlesungen(): Course[] {
  return [
    // Künstliche Intelligenz
    vorlesung("20-00-0052", "Data Mining und Maschinelles Lernen", "Prof. Dr. rer. nat. Kristian Kersting", 6, ["ki"], 759),
    vorlesung("20-00-0358", "Statistisches Maschinelles Lernen", "Prof. Dr.-Ing. Marcus Rohrbach; Prof. Dr. Simone Schaub-Meyer", 9, ["ki", "theorie"], 539),
    vorlesung("20-00-0401", "Computer Vision II", "Prof. Ph. D. Stefan Roth", 6, ["ki"], 185),
    vorlesung("10-30-0036", "Bioinformatik", "M.Sc. Magnus Behringer; Prof. Dr. rer. nat. Kay Hamacher; Dr. rer. nat. Arnulf Kletzin", 6, ["ki"], 95),
    vorlesung("20-00-0660", "Automatisches Beweisen", "Prof. Dr. rer. nat. Reiner Hähnle", 6, ["ki", "theorie"], 167),
    vorlesung("20-00-0947", "Deep Learning für Natural Language Processing", "Ph.D. Simone Balloccu; Prof. Dr. phil. Iryna Gurevych", 9, ["ki"], 402),
    vorlesung("20-00-1034", "Deep Learning: Architectures & Methods", "Prof. Dr. rer. nat. Kristian Kersting", 9, ["ki"], 496),
    vorlesung("20-00-1047", "Reinforcement Learning: Von Grundlagen zu den tiefen Ansätzen", "Prof. Ph.D. Georgia Chalvatzaki; Ph.D. Davide Tateo", 6, ["ki"], 346),
    vorlesung("20-00-1061", "Ethik in Natürlicher Sprachverarbeitung", "Prof. Dr. rer. nat. Ilia Kuznetsov", 6, ["ki"], 380),
    vorlesung("20-00-1176", "Technologietransfer und Unternehmertum mit Schwerpunkt auf Künstliche Intelligenz", "Prof. Dr. rer. nat. Dominik Michels", 6, ["ki"], 246),
    vorlesung("20-00-1180", "3D Scanning & Motion Capture", "Prof. Dr.-Ing. Justus Thies", 6, ["ki"], 86),
    vorlesung("20-00-1191", "Explainable Artificial Intelligence for Computer Vision", "Prof. Dr. Simone Schaub-Meyer", 6, ["ki"], 144),
    vorlesung("20-00-1192", "AI-based 3D Graphics & Vision", "Prof. Dr.-Ing. Justus Thies", 6, ["ki"], 22),
    vorlesung("20-00-1193", "Multimodal Artificial Intelligence", "Prof. Dr.-Ing. Anna Rohrbach; Prof. Dr.-Ing. Marcus Rohrbach", 6, ["ki"], 289),
    vorlesung("20-00-1225", "Robot Learning 1", "Prof. Ph. D. Jan Peters", 6, ["ki"], 341),
    vorlesung("20-00-1226", "Robot Learning 2", "Prof. Ph. D. Jan Peters", 6, ["ki"], 140),

    // Komplexe vernetzte Systeme (Platzhalter; Module mit realen Noten werden separat als Einträge geführt)
    vorlesung("20-00-1039", "Advanced Data Management Systems", "Prof. Dr. rer. nat. Carsten Binnig; Prof. Ph.D. Zsolt Istvan", 6, ["kvs"], 163),
    vorlesung("20-00-1215", "Fortgeschrittene parallele Programmierung", "M.Sc. Marvin Rene Kaster; Prof. Dr. rer. nat. Felix Wolf", 6, ["kvs"], 88),

    // Software & Hardware
    vorlesung("18-su-2010", "Software-Engineering – Wartung und Qualitätssicherung", "Prof. Dr. rer. nat. Andreas Schürr; M.Sc. Alexander Lieb", 6, ["swhw"], 519),
    vorlesung("20-00-0041", "Graphische Datenverarbeitung II", "Dr. Ing. Daniel Jan Ströter", 6, ["swhw"], 41),
    vorlesung("20-00-0160", "Augmented Vision", "Dr.-Ing. Pavel Rojtberg", 6, ["swhw"], 71),
    vorlesung("18-de-2050", "Serious Games", "PD Dr.-Ing. Stefan Peter Göbel", 6, ["swhw"], 282),
    vorlesung("20-00-0535", "Human Computer Interaction", "Prof. Dr. rer. nat. Jan Gugenheimer", 6, ["swhw"], 173),
    vorlesung("20-00-0682", "Physikalisch-basierte Simulation und Animation", "Dr.-Ing. Daniel Weber", 6, ["swhw"], 75),
    vorlesung("20-00-0701", "Fortgeschrittener Compilerbau", "Prof. Dr.-Ing. Andreas Koch", 6, ["swhw"], 75),
    vorlesung("20-00-0793", "User-Centered Design in Visual Computing", "Prof. Dr.-Ing. Jörn Kohlhammer", 6, ["swhw"], 52),
    vorlesung("20-00-1118", "Mensch- und Identitätsfokussiertes Maschinelles Lernen", "Naser Damer", 6, ["swhw"], 155),
    vorlesung("20-00-1246", "Type Systems", "Dr. rer. nat. David Richter", 6, ["swhw"], 68),

    // Cybersicherheit und Privatheit
    vorlesung("20-00-0093", "Sicherheit in Multimedia Systemen und Anwendungen", "Honorarprof. Dr.-Ing. Martin Steinebach", 6, ["csp"], 79, [
      dist("SS25", [ 4,  3,  4,  4,  3,  4,  4,  3,  2,  0, 12],  41),
      dist("SS23", [ 3,  9, 12,  6,  7,  9,  9,  4,  5,  1,  3],  68),
    ]),
    vorlesung("20-00-0219", "IT Sicherheit", "Dr. Donika Mirdita; Prof. Dr. Haya Schulmann; Prof. Dr. rer. nat. Michael Waidner", 6, ["csp"], 264, [
      dist("SS25", [12, 16, 14,  9, 13, 15, 12, 17, 11,  6, 12], 137),
    ]),
    vorlesung("20-00-0362", "Formale Methoden der Informationssicherheit", "Prof. Dr.-Ing. Heiko Mantel", 6, ["csp"], 54, [
      dist("SS25", [ 7,  0,  1,  0,  1,  0,  0,  0,  1,  1,  0],  11),
      dist("SS23", [ 1,  2,  2,  1,  1,  1,  4,  2,  1,  1,  3],  19),
    ]),
    vorlesung("20-00-0512", "Netzsicherheit", "M.Sc. Lucas Becker; Prof. Dr.-Ing. Matthias Hollick; M.Sc. Leon Janzen", 6, ["csp"], 293, [
      dist("WS25/26", [ 1,  2,  1,  6,  0,  1,  4,  2,  0,  0,  0],  17),
      dist("SS25",    [11, 10, 12, 13, 10, 13,  7, 15, 12,  3, 33], 139),
      dist("SS24",    [ 5,  6,  5,  7, 13,  9,  9,  6, 12,  7, 38], 117),
      dist("SS23",    [11, 12,  6,  3,  8,  5, 15,  6,  6,  5, 16],  93),
      dist("WS22/23", [ 0,  0,  0,  0,  0,  2,  0,  1,  3,  1,  6],  13),
    ]),
    vorlesung("20-00-0581", "Embedded System Security", "Prof. Dr.-Ing. Ahmad-Reza Sadeghi", 6, ["csp"], 101, [
      dist("SS25", [ 3,  5, 13, 13, 11,  6,  2,  7,  3,  1,  4],  68),
    ]),
    vorlesung("20-00-0583", "Sichere Mobile Systeme", "Prof. Dr.-Ing. Matthias Hollick", 6, ["csp"], 130),
    vorlesung("20-00-0969", "Schutz in vernetzten Systemen – Vertrauen, Widerstandsfähigkeit und Privatheit", "Priv.-Doz. Dr. habil. Andrea Tundis", 6, ["csp"], 32, [
      dist("SS24", [ 6,  2,  4,  1,  6,  1,  2,  3,  2,  2,  0],  29),
      dist("SS23", [ 2,  2,  1,  1,  3,  3,  1,  1,  2,  1,  2],  19),
    ]),
    vorlesung("20-00-1010", "Blockchain Technology", "Prof. Ph.D. Sebastian Faust", 6, ["csp"], 144),
    vorlesung("20-00-1032", "Kryptographische Protokolle", "Prof. Dr.-Ing. Thomas Schneider", 6, ["csp"], 84, [
      dist("SS25", [ 4,  0,  0,  4,  2,  1,  2,  0,  3,  3,  4],  23),
    ]),
    vorlesung("20-00-1174", "FLSec: Securing Federated Learning against Poisoning Attacks", "Dr.-Ing. Phillip Erik Rieger; Prof. Dr.-Ing. Ahmad-Reza Sadeghi", 6, ["csp"], 36),
    vorlesung("20-00-1190", "Cryptography on Hardware", "Prof. Dr. Amir Moradi", 6, ["csp"], 36, [
      dist("SS24", [ 0,  3,  1,  1,  3,  0,  0,  0,  0,  1,  0],   9),
    ]),
    vorlesung("20-00-0720", "Sichere Kritische Infrastrukturen", "Prof. Dr.-Ing. Matthias Hollick", 6, ["csp"], 100, [
      dist("WS25/26", [ 1,  2,  1,  5, 10,  9,  7, 11, 13,  7, 14],  80),
      dist("WS24/25", [ 4, 10,  7, 12, 15,  5, 14,  6,  5,  6, 13],  97),
      dist("WS22/23", [ 1,  5,  6,  6,  7, 13,  7,  2, 10,  5, 10],  72),
    ]),
    vorlesung("20-00-1026", "Informationstechnologie für Frieden und Sicherheit", "Prof. Dr. Dr. Christian Reuter", 6, ["csp"], 100, [
      dist("SS25",    [11,  8,  6, 10,  5, 10,  7,  5,  4,  2,  9],  77),
      dist("WS22/23", [ 2,  6, 10,  6,  9,  6,  3,  3,  4,  1,  2],  52),
    ]),
    vorlesung("20-00-1219", "Datenschutz- und Cybersicherheitsrecht - eine Einführung für Informatiker", "TU Darmstadt", 6, ["csp"], 300, [
      dist("WS25/26", [43, 58,126, 17,  9,  2,  0,  0,  0,  0,  0], 255),
      dist("SS25",    [37, 18, 12,  4,  1,  0,  0,  0,  0,  0,  0],  72),
    ]),
    vorlesung("20-00-1218", "Theory and Practice of Symmetric Cryptography", "Prof. Dr. phil. nat. Marc Fischlin", 6, ["csp"], 20, [
      dist("SS25", [ 2,  1,  1,  1,  1,  0,  0,  0,  0,  1,  0],   7),
    ]),
    vorlesung("20-00-0632", "Post-Quantum Kryptographie", "Prof. Dr. phil. nat. Marc Fischlin", 6, ["csp"], 40, [
      dist("SS20", [ 1,  2,  2,  2,  1,  4,  3,  3,  6,  1,  7],  32),
    ]),
    vorlesung("20-00-0121", "Ubiquitous Computing in Geschäftsprozessen", "Prof. Dr. rer. nat. Eberhard Max Mühlhäuser", 6, ["csp"], 50, [
      dist("WS22/23", [ 1,  0,  0,  4,  6,  1,  6,  5,  3,  1,  6],  33),
    ]),
    vorlesung("20-00-0745", "Physical Layer Security in Drahtlosen Systemen", "Prof. Dr.-Ing. Matthias Hollick", 6, ["csp"], 30, [
      dist("WS22/23", [ 1,  4,  4,  2,  1,  2,  2,  3,  2,  0,  0],  21),
    ]),
    vorlesung("20-00-1163", "Mobile Security", "Prof. Dr.-Ing. Matthias Hollick", 6, ["csp"], 30, [
      dist("WS22/23", [11,  4,  5,  1,  0,  0,  0,  0,  0,  0,  0],  21),
    ]),
    vorlesung("20-00-0085", "Einführung in die Kryptographie", "Prof. Dr. phil. nat. Marc Fischlin", 6, ["csp"], 150, [
      dist("WS25/26", [ 9,  2,  5,  4,  9,  5,  6,  6,  8,  7, 56], 117),
      dist("WS24/25", [ 7,  3,  6,  8, 11,  3,  5,  7, 10, 14, 34], 108),
    ]),
    vorlesung("20-00-0993", "Kryptographie in der Praxis", "Prof. Dr.-Ing. Thomas Schneider", 6, ["csp"], 50, [
      dist("WS24/25", [ 0,  0,  3,  5,  5,  6,  3,  4,  3,  2,  7],  38),
    ]),
    vorlesung("20-00-1123", "Informationssicherheitsmanagement", "TU Darmstadt", 6, ["csp"], 120, [
      dist("SS22",    [ 0,  1,  1,  1,  2,  0,  0,  2,  1,  0,  3],  11),
      dist("WS21/22", [ 3,  8, 14, 14, 22, 10, 10,  6,  4,  3,  8], 102),
    ]),
    vorlesung("20-00-1216", "Vorbereitung und Reaktion auf Cybervorfälle", "Prof. Dr. Ira Helsloot; Prof. Dr. Dr. Christian Reuter", 6, ["csp"], 85),
    vorlesung("20-00-1224", "Digitale Textforensik", "Dr. Oren Halvani; Prof. Dr. rer. nat. Michael Waidner", 6, ["csp"], 57),
    vorlesung("20-00-1243", "Benutzbare Sicherheit und Privatheit", "Dr. rer. nat. Marc-André Kaufhold; Prof. Dr. Dr. Christian Reuter", 6, ["csp"], 103),

    // Theorie (nur neue, die nicht in KI sind)
    vorlesung("20-00-1136", "Einführung in das Quantencomputing", "Prof. Dr. rer. nat. Mariami Gachechiladze", 6, ["theorie"], 244),
    vorlesung("20-00-1248", "Interactive Theorem Proving with Lean", "Prof. Dr. rer. nat. Andres Goens", 6, ["theorie"], 70),
  ];
}

function lehre(moduleId: string, name: string, professor: string, capacity: number): Course {
  const slug = "pil-" + moduleId.replace(/-/g, "");
  return {
    slug, moduleId, name, bereich: "wahl", subtype: "lehre", professor, ects: 3,
    description: `Praktikum in der Lehre. Mitwirkung bei der Durchführung der Veranstaltung. Modulnummer ${moduleId}.`,
    distributions: [ praktikumDist(moduleId, capacity) ],
    reviews: [],
  };
}

function lehrepraktika(): Course[] {
  return [
    lehre("20-00-0187", "Praktikum in der Lehre – Funktionale und objektorientierte Programmierkonzepte", "Prof. Dr. rer. nat. Karsten Weihe", 3),
    lehre("20-00-0289", "Praktikum in der Lehre – Algorithmen und Datenstrukturen", "Prof. Ph.D. Zsolt Istvan; Prof. Ph. D. Stefan Roth", 5),
    lehre("20-00-0333", "Praktikum in der Lehre – Allgemeine Informatik I", "Prof. Dr. Roderich Groß", 3),
    lehre("20-00-0443", "Praktikum in der Lehre – Softwaretechnik", "Prof. Dr.-Ing. Ermira Mezini", 1),
    lehre("20-00-0531", "Praktikum in der Lehre – Formale Methoden im Softwareentwurf", "Dr. rer. nat. Richard Bubel", 2),
    lehre("20-00-0954", "Praktikum in der Lehre – Graphische Datenverarbeitung II", "Prof. Dr. techn. Wolf Dietrich Fellner", 1),
    lehre("20-00-0957", "Praktikum in der Lehre – Internetsicherheit und Sicherheit in Mobilen Netzen", "Prof. Dr.-Ing. Matthias Hollick", 3),
    lehre("20-00-0962", "Praktikum in der Lehre – Computernetzwerke und verteilte Systeme", "Prof. Ph.D. Zsolt Istvan; Prof. Dr. Marco Zimmerling", 13),
    lehre("20-00-0965", "Praktikum in der Lehre – Rechnerorganisation", "Prof. Dr.-Ing. Andreas Koch", 2),
    lehre("20-00-0970", "Praktikum in der Lehre – IT in der Grundlehre", "Prof. Dr. rer. nat. Karsten Weihe", 1),
    lehre("20-00-0971", "Praktikum in der Lehre – Computational Engineering und Robotik", "Prof. Ph. D. Jan Peters", 5),
    lehre("20-00-1040", "Praktikum in der Lehre – Data Management", "Prof. Dr. rer. nat. Carsten Binnig; Prof. Ph.D. Zsolt Istvan", 3),
    lehre("20-00-1044", "Praktikum in der Lehre – Deep Learning for Natural Language Processing", "Prof. Dr. phil. Iryna Gurevych", 5),
    lehre("20-00-1045", "Praktikum in der Lehre – SIT", "Dr. Donika Mirdita; Prof. Dr. Haya Schulmann; Prof. Dr. rer. nat. Michael Waidner", 5),
    lehre("20-00-1060", "Praktikum in der Lehre – Echtzeitsysteme", "Prof. Dr. rer. nat. Andreas Schürr", 5),
    lehre("20-00-1070", "Praktikum in der Lehre – Statistisches Maschinelles Lernen", "Prof. Dr.-Ing. Marcus Rohrbach; Prof. Dr. Simone Schaub-Meyer", 5),
    lehre("20-00-1100", "Praktikum in der Lehre – System Security", "Prof. Dr.-Ing. Ahmad-Reza Sadeghi", 5),
    lehre("20-00-1111", "Praktikum in der Lehre – Technische Informatik", "Prof. Dr.-Ing. Andreas Koch", 5),
    lehre("20-00-1127", "Praktikum in der Lehre – Natural Language Processing", "Dr. rer. nat. Thomas Otmar Arnold; Prof. Dr. phil. Iryna Gurevych", 9),
    lehre("20-00-1169", "Praktikum in der Lehre – Reinforcement Learning", "Prof. Ph.D. Georgia Chalvatzaki; Ph.D. Davide Tateo", 1),
    lehre("20-00-1171", "Praktikum in der Lehre – Intelligent Robotermanipulation", "Prof. Ph.D. Georgia Chalvatzaki", 5),
    lehre("20-00-1175", "Praktikum in der Lehre – Informatik, Frieden, Sicherheit", "Prof. Dr. Dr. Christian Reuter", 1),
    lehre("20-00-1241", "Reflexion eigener Informatikunterricht in Schulen", "Prof. Dr. rer. nat. Karsten Weihe", 1),
  ];
}

function seminars(): Course[] {
  return [
    seminar("20-00-0182", "Design und Implementierung moderner Programmiersprachen", "Prof. Dr.-Ing. Ermira Mezini", 27),
    seminar("20-00-0216", "3D Animation & Visualisierung", "Dipl.-Inform. Martin Knuth; Prof. Dr. Arjan Kuijper", 39),
    seminar("20-00-0268", "Visual Analytics: Interaktive Visualisierung sehr großer Datenmengen", "Prof. Dr.-Ing. Jörn Kohlhammer; Dr.-Ing. Thorsten May", 56),
    seminar("20-00-0328", "Serious Games Seminar", "PD Dr.-Ing. Stefan Peter Göbel", 69),
    seminar("20-00-0469", "Skalenraum- und PDE-Methoden in der Bildanalyse und -verarbeitung", "Prof. Dr. Arjan Kuijper", 21),
    seminar("20-00-0518", "Algorithmen zum Graphendesign", "PD Elias Dahlhaus", 17),
    seminar("20-00-0652", "System und Hardware Sicherheit", "Prof. Dr.-Ing. Ahmad-Reza Sadeghi", 106),
    seminar("20-00-0693", "Seminar Angewandte Aspekte der Informatik im Unterricht", "Prof. Dr. rer. nat. Karsten Weihe", 20),
    seminar("20-00-0694", "Seminar Praktische Aspekte der Informatik im Unterricht", "Prof. Dr. rer. nat. Karsten Weihe", 2),
    seminar("20-00-0695", "Seminar Theoretische Aspekte der Informatik im Unterricht", "Prof. Dr. rer. nat. Karsten Weihe", 20),
    seminar("20-00-0702", "Symbolische Ausführung", "Prof. Dr. rer. nat. Reiner Hähnle; Dr. rer. nat. Richard Bubel", 67),
    seminar("20-00-0724", "Angewandte Themen der Computergraphik", "Prof. Dr.-Ing. André Stork", 17),
    seminar("20-00-0807", "Privatheit & Anonymität in einer vernetzten Welt", "Prof. Dr. rer. nat. Michael Waidner", 101),
    seminar("20-00-0961", "Zivile Sicherheit", "Honorarprof. Dr.-Ing. Martin Steinebach", 58),
    seminar("20-00-0963", "IT in der Grundlehre", "Prof. Dr. rer. nat. Karsten Weihe", 18),
    seminar("20-00-0994", "Parallel Computing", "M.Sc. Gustavo Alves Prudencio de Morais; Prof. Dr. rer. nat. Felix Wolf", 62),
    seminar("20-00-1038", "Performance Engineering", "Prof. Dr. Christian Bischof", 54),
    seminar("20-00-1139", "Künstliche Intelligenz für Coding Assistance", "Prof. Dr.-Ing. Ermira Mezini", 154),
    seminar("20-00-1168", "Intelligente Robotermanipulation: Part II", "Prof. Ph.D. Georgia Chalvatzaki; Ph.D. Davide Tateo", 20),
    seminar("20-00-1172", "Large Language Models", "Prof. Dr. rer. nat. Ilia Kuznetsov", 181),
    seminar("20-00-1173", "Language-Based Security For Distributed Systems", "Prof. Dr.-Ing. Heiko Mantel", 11),
    seminar("20-00-1194", "Advanced Topics in Multimodal AI", "Prof. Dr.-Ing. Anna Rohrbach", 76),
    seminar("20-00-1205", "Implementation Security", "Prof. Dr. Amir Moradi", 25),
    seminar("20-00-1210", "Ausgewählte Themen KI-gestützter Sicherheit in der Praxis", "Dr. Oren Halvani; Prof. Dr. rer. nat. Michael Waidner", 33),
    seminar("20-00-1227", "(Gender) Diversity in Software Development", "Prof. Dr. rer. nat. Isabella Graßl", 78),
    seminar("20-00-1242", "Human-Computer Interaction Seminar", "Prof. Dr. rer. nat. Florian Benjamin Müller", 37),
    seminar("20-00-1250", "Seminar on Private Data Systems", "Prof. Ph.D. Zsolt Istvan; M.Sc. Shaza Zeitouni", 28),
  ];
}

const pflicht = (
  slug: string, name: string, sem: number, ects: number,
  professor: string, description: string,
  distributions: GradeDistribution[],
  reviews: Course["reviews"] = [],
): Course => ({ slug, name, bereich: "pflicht", semester: sem, ects, professor, description, distributions, reviews });

export const courses: Course[] = [
  // ── Semester 1 ─────────────────────────────────────────────
  pflicht("erfolgreich-ins-studium", "Erfolgreich ins Informatik-Studium starten", 1, 1,
    "Prof. Dr. Schneider",
    "Einführungsmodul zu Studienorganisation, Lernstrategien und Studienstruktur.",
    [ dist("WS24/25", [40, 30, 20, 15, 10, 8, 5, 3, 2, 1, 6], 140) ]),
  {
    ...pflicht("fop", "Funktionale und objektorientierte Programmierkonzepte", 1, 10,
      "Prof. Dr.-Ing. Ermira Mezini",
      "Grundlagen der Programmierung: funktional und objektorientiert, Rekursion, Typsysteme, Entwurfsmuster.",
      [
        // 1. Okt. 2025 — SS25 Nachklausur (Modulangebot WS22/23) — 143, Ø 3,527
        dist("SS25 (Nachkl.)",    [  2,  3, 11,  8, 13,  7, 17, 13, 10, 11,  48], 143),
        // 15. Apr. 2025 — WS24/25 Hauptklausur — 836, Ø 3,086
        dist("WS24/25",           [168, 49, 46, 49, 40, 49, 45, 35, 36, 31, 288], 836),
        // 2. Okt. 2024 — SS24 Nachklausur — 107, Ø 3,934
        dist("SS24 (Nachkl.)",    [  3,  1,  3,  6,  4,  5,  9, 11,  5,  5,  55], 107),
        // 9. Apr. 2024 — WS23/24 Hauptklausur — 592, Ø 1,876 (kein 5,0!)
        dist("WS23/24",           [255, 41, 45, 48, 36, 41, 35, 34, 30, 27,   0], 592),
        // 4. Okt. 2023 — SS23 Nachklausur — 130, Ø 3,048
        dist("SS23 (Nachkl.)",    [  9, 10,  7,  9, 11, 14, 16, 11, 10,  5,  28], 130),
        // 4. Apr. 2023 — WS22/23 Hauptklausur — 756, Ø 3,718
        dist("WS22/23",           [ 26, 22, 37, 50, 41, 52, 60, 49, 47, 17, 355], 756),
        // 5. Okt. 2022 — SS22 Nachklausur — 99, Ø 3,158
        dist("SS22 (Nachkl.)",    [  1,  5,  7, 11, 14,  8, 11,  7,  9,  2,  24],  99),
        // 5. Apr. 2022 — WS21/22 Hauptklausur — 566, Ø 3,479
        dist("WS21/22",           [ 27, 21, 32, 43, 43, 35, 47, 53, 36, 13, 216], 566),
        // 6. Okt. 2021 — SS21 Nachklausur — 69, Ø 3,059
        dist("SS21 (Nachkl.)",    [  4,  6,  5,  6,  3,  8,  6,  6,  5,  6,  14],  69),
      ]),
    moduleId: "20-00-0004",
  },
  {
    ...pflicht("digitaltechnik", "Digitaltechnik", 1, 5,
      "Prof. Dr.-Ing. Andreas Koch",
      "Grundlagen digitaler Schaltungen, Boolesche Algebra, kombinatorische und sequentielle Logik.",
      [
        // 3. Mär. 2026 — WS25/26 — 491, Ø 3,370
        dist("WS25/26",         [13, 25, 29, 25, 37, 41, 43, 46, 46, 67, 119], 491),
        // 29. Jul. 2025 — SS25 Nachklausur — 76, Ø 3,664
        dist("SS25 (Nachkl.)",  [ 0,  0,  1,  3,  3,  8,  8, 17,  6, 10,  20],  76),
        // 28. Mär. 2025 — WS24/25 — 500, Ø 3,697
        dist("WS24/25",         [ 9, 10, 13, 26, 30, 36, 50, 51, 43, 51, 181], 500),
        // 5. Mär. 2024 — WS23/24 — 583, Ø 3,750
        dist("WS23/24",         [12, 18, 17, 19, 38, 33, 47, 50, 61, 64, 224], 583),
        // 18. Jul. 2023 — SS23 Nachklausur (Modulangebot WS19/20) — 33, Ø 4,509
        dist("SS23 (Nachkl.)",  [ 0,  0,  0,  0,  0,  0,  1,  1,  4,  7,  20],  33),
        // 7. Mär. 2023 — WS22/23 — 525, Ø 3,867
        dist("WS22/23",         [ 4,  4, 11,  8, 15, 35, 56, 63, 68, 75, 186], 525),
        // 19. Jul. 2022 — SS22 Nachklausur — 19, Ø 4,200
        dist("SS22 (Nachkl.)",  [ 1,  0,  0,  0,  0,  1,  0,  1,  4,  2,  10],  19),
        // 8. Mär. 2022 — WS21/22 — 298, Ø 3,519
        dist("WS21/22",         [ 3,  4, 11, 19, 21, 28, 26, 41, 35, 33,  77], 298),
        // 4. Okt. 2021 — SS21 Nachklausur — 42, Ø 4,319
        dist("SS21 (Nachkl.)",  [ 0,  0,  0,  0,  0,  2,  3,  4,  4,  6,  23],  42),
        // 5. Mär. 2019 — WS18/19 — 423, Ø 4,056
        dist("WS18/19",         [ 0,  3,  4,  6, 15, 25, 27, 40, 60, 59, 184], 423),
      ]),
    moduleId: "20-00-0900",
  },
  {
    ...pflicht("mathe-1", "Mathematik I für Informatik", 1, 9,
      "Fachbereich Mathematik",
      "Lineare Algebra, analytische Geometrie, Grundlagen der Analysis. Pflichtmodul für B.Sc. Informatik und Wirtschaftsinformatik.",
      [
        // Hauptklausur WS25/26 (19. Mär. 2026) — 637 Ergebnisse
        dist("WS25/26",            [11, 16, 31, 48, 46,  89, 80, 84, 82, 18, 132], 637),
        // Nachklausur SoSe 2025 (11. Sep. 2025) — 85 Ergebnisse, Modulangebot WS23/24
        dist("SS25 (Nachkl.)",     [ 0,  0,  0,  3,  1,   2,  8, 11, 15, 12,  33],  85),
        // Hauptklausur WS24/25 (27. Mär. 2025) — 745 Ergebnisse
        dist("WS24/25",            [21, 37, 39, 48, 49,  76, 56, 75, 79,  8, 257], 745),
        // Nachklausur (12. Sep. 2024) — 66 Ergebnisse
        dist("WS23/24 (Nachkl.)",  [ 2,  1,  1,  3,  5,   9,  5, 10,  9, 10,  11],  66),
        // Hauptklausur WS23/24 (21. Mär. 2024) — 719 Ergebnisse
        dist("WS23/24",            [15, 32, 43, 59, 95, 103, 88, 95, 60, 26, 103], 719),
        // Hauptklausur WS21/22 (17. Mär. 2022) — 404 Ergebnisse
        dist("WS21/22",            [21, 22, 29, 29, 33,  54, 45, 27, 36,  5, 103], 404),
      ]),
    moduleId: "04-10-0118/de",
  },
  {
    ...pflicht("automaten", "Automaten, formale Sprachen und Entscheidbarkeit", 1, 5,
      "Fachbereich Informatik",
      "Endliche Automaten, reguläre und kontextfreie Sprachen, Berechenbarkeit und Entscheidbarkeit.",
      [
        // Hauptklausur WS25/26 (26. Mär. 2026) — 490 Ergebnisse, Ø 2,762
        dist("WS25/26",           [68, 30, 49, 51, 47, 43, 34, 32, 26, 17,  93], 490),
        // Nachklausur SS25 (5. Sep. 2025) — 78, Ø 3,821
        dist("SS25 (Nachkl.)",    [ 0,  0,  0,  3,  2,  9,  7,  5, 18, 11,  23],  78),
        // Hauptklausur WS24/25 (3. Apr. 2025) — 524, Ø 3,156
        dist("WS24/25",           [29, 19, 29, 33, 40, 67, 54, 62, 62, 29, 100], 524),
        // Nachklausur SS24 (30. Aug. 2024) — 105, Ø 4,024
        dist("SS24 (Nachkl.)",    [ 1,  0,  1,  2,  3,  6,  6,  9, 20, 14,  43], 105),
        // Hauptklausur WS22/23 (23. Mär. 2023) — 405, Ø 3,830
        dist("WS22/23",           [ 4,  5,  8, 11, 17, 29, 32, 38, 86, 27, 148], 405),
        // Nachklausur SS23 (25. Aug. 2023) — 54, Ø 3,876
        dist("SS23 (Nachkl.)",    [ 0,  0,  1,  2,  2,  3,  3, 10,  7,  7,  19],  54),
      ]),
    moduleId: "04-10-0120/de",
  },

  // ── Semester 2 ─────────────────────────────────────────────
  {
    ...pflicht("algo-ds", "Algorithmen und Datenstrukturen", 2, 10,
      "Prof. Dr. rer. nat. Karsten Weihe",
      "Grundlegende Algorithmen, Komplexitätsanalyse, Sortier- und Suchverfahren, Graphenalgorithmen.",
      [
        // 9. Sep. 2025 — SS25 Hauptklausur — 708, Ø 3,223
        dist("SS25",              [23, 32, 56, 55, 60, 70, 67, 83, 59, 23, 180], 708),
        // 11. Apr. 2025 — WS24/25 Nachklausur — 88, Ø 4,240
        dist("WS24/25 (Nachkl.)", [ 2,  1,  1,  1,  3,  4,  2,  5,  7, 10,  52],  88),
        // 10. Sep. 2024 — SS24 Hauptklausur — 749, Ø 3,311
        dist("SS24",              [30, 25, 34, 48, 48, 84, 83,103, 74, 36, 184], 749),
        // 5. Apr. 2024 — WS23/24 Nachklausur — 83, Ø 3,323
        dist("WS23/24 (Nachkl.)", [ 1,  0,  6,  7,  8,  4, 13, 14,  6,  6,  18],  83),
        // 5. Sep. 2023 — SS23 Hauptklausur — 688, Ø 3,263
        dist("SS23",              [34, 30, 40, 64, 51, 55, 71, 52, 79, 27, 185], 688),
        // 31. Mär. 2023 — WS22/23 Nachklausur — 37, Ø 4,043
        dist("WS22/23 (Nachkl.)", [ 0,  0,  0,  2,  2,  1,  2,  4,  3,  7,  16],  37),
        // 6. Sep. 2022 — SS22 Hauptklausur — 377, Ø 2,515
        dist("SS22",              [46, 33, 30, 46, 50, 38, 41, 30, 21, 11,  31], 377),
        // 7. Sep. 2021 — SS21 Hauptklausur — 354, Ø 3,194
        dist("SS21",              [21, 18, 24, 30, 29, 30, 41, 28, 26,  9,  98], 354),
        // 9. Apr. 2021 — WS20/21 Nachklausur — 87, Ø 3,543
        dist("WS20/21 (Nachkl.)", [ 0,  0,  2,  1,  3, 10, 13, 14, 21,  9,  14],  87),
      ]),
    moduleId: "20-00-0005",
  },
  {
    ...pflicht("rechnerorganisation", "Rechnerorganisation", 2, 5,
      "Prof. Dr.-Ing. Andreas Koch",
      "Aufbau moderner Rechensysteme, Assembler, Speicherhierarchien, Pipelining.",
      [
        // 20. Mär. 2026 — WS25/26 Nachklausur — 47, Ø 3,794
        dist("WS25/26 (Nachkl.)", [ 0,  0,  0,  0,  1,  8,  7,  5,  7,  4,  15],  47),
        // 25. Sep. 2025 — SS25 Hauptklausur — 457, Ø 4,253
        dist("SS25",              [ 1,  1,  6,  6, 18, 15, 31, 34, 33, 50, 262], 457),
        // 28. Mär. 2025 — WS24/25 Nachklausur — 33, Ø 3,270
        dist("WS24/25 (Nachkl.)", [ 2,  2,  1,  3,  2,  0,  6,  3,  3,  3,   8],  33),
        // 26. Sep. 2024 — SS24 Hauptklausur — 477, Ø 3,100
        dist("SS24",              [55, 22, 17, 42, 33, 33, 47, 44, 33, 46, 105], 477),
        // 21. Sep. 2023 — SS23 Hauptklausur — 377, Ø 2,942
        dist("SS23",              [44, 17, 32, 28, 41, 32, 24, 30, 23, 34,  72], 377),
        // 17. Mär. 2023 — WS22/23 Nachklausur — 21, Ø 2,833
        dist("WS22/23 (Nachkl.)", [ 0,  1,  0,  3,  6,  2,  2,  2,  2,  2,   1],  21),
        // 22. Sep. 2022 — SS22 Hauptklausur — 320, Ø 2,883
        dist("SS22",              [ 4, 20, 38, 46, 39, 33, 31, 22, 18, 20,  49], 320),
        // 18. Mär. 2022 — WS21/22 Nachklausur — 16, Ø 3,225
        dist("WS21/22 (Nachkl.)", [ 0,  1,  0,  1,  4,  3,  0,  1,  1,  1,   4],  16),
        // 23. Jul. 2021 — SS21 Hauptklausur — 378, Ø 2,489
        dist("SS21",              [21, 51, 51, 52, 50, 35, 36, 20, 19,  6,  37], 378),
      ]),
    moduleId: "20-00-0902",
  },
  {
    ...pflicht("mathe-2", "Mathematik II für Informatik", 2, 9,
      "Fachbereich Mathematik",
      "Analysis in mehreren Variablen, Differential- und Integralrechnung, gewöhnliche Differentialgleichungen.",
      [
        // 19. Mär. 2026 — WS25/26 Nachklausur — 107, Ø 4,252
        dist("WS25/26 (Nachkl.)", [ 0,  0,  0,  0,  2,  0,  6, 13, 15, 21,  50], 107),
        // 11. Sep. 2025 — SS25 Hauptklausur — 687, Ø 3,220
        dist("SS25",              [20, 25, 47, 53, 73, 63, 75, 78, 70, 21, 162], 687),
        // 27. Mär. 2025 — WS24/25 Nachklausur — 102, Ø 3,777
        dist("WS24/25 (Nachkl.)", [ 1,  0,  2,  0,  1, 10, 12, 15, 13, 22,  26], 102),
        // 12. Sep. 2024 — SS24 Hauptklausur — 605, Ø 3,234
        dist("SS24",              [41, 28, 38, 36, 49, 50, 50, 58, 75, 24, 156], 605),
        // 21. Mär. 2024 — WS23/24 Nachklausur — 44, Ø 3,693
        dist("WS23/24 (Nachkl.)", [ 0,  0,  0,  2,  1,  3,  7,  5,  8,  9,   9],  44),
        // 16. Mär. 2023 — WS22/23 Nachklausur — 35, Ø 3,817
        dist("WS22/23 (Nachkl.)", [ 0,  1,  0,  2,  2,  1,  3,  4,  4,  6,  12],  35),
        // 8. Sep. 2022 — SS22 Nachklausur — 390, Ø 3,189
        dist("SS22 (Nachkl.)",    [21, 19, 27, 25, 34, 41, 38, 36, 42, 10,  97], 390),
      ]),
    moduleId: "04-10-0119/de",
  },
  {
    ...pflicht("logik", "Aussagen- und Prädikatenlogik", 2, 5,
      "Fachbereich Mathematik",
      "Syntax und Semantik der Aussagen- und Prädikatenlogik, Kalküle, Resolutionsverfahren.",
      [
        // 27. Mär. 2026 — WS25/26 Nachklausur — 46, Ø 2,807
        dist("WS25/26 (Nachkl.)", [ 0,  2,  3,  5,  6, 12,  5,  6,  2,  2,   3],  46),
        // 19. Sep. 2025 — SS25 Hauptklausur — 501, Ø 3,079
        dist("SS25",              [12,  9, 26, 36, 71, 74, 79, 43, 48, 32,  71], 501),
        // 20. Sep. 2024 — SS24 Hauptklausur — 449, Ø 3,285
        dist("SS24",              [20, 23, 11, 27, 40, 30, 50, 48, 77, 29,  94], 449),
        // 22. Mär. 2024 — WS23/24 Nachklausur — 39, Ø 3,672
        dist("WS23/24 (Nachkl.)", [ 0,  0,  1,  0,  1,  5,  4,  7,  8,  4,   9],  39),
        // 15. Sep. 2023 — SS23 Hauptklausur — 327, Ø 3,541
        dist("SS23",              [15, 17, 10, 15, 18, 26, 27, 40, 29,  8, 122], 327),
        // 24. Mär. 2023 — WS22/23 Nachklausur — 26, Ø 2,935
        dist("WS22/23 (Nachkl.)", [ 2,  0,  1,  4,  2,  5,  0,  5,  0,  5,   2],  26),
        // 16. Sep. 2022 — SS22 Hauptklausur — 363, Ø 2,924
        dist("SS22",              [40, 19, 16, 28, 34, 33, 30, 35, 41, 46,  41], 363),
        // 25. Mär. 2022 — WS21/22 Nachklausur — 34, Ø 3,906
        dist("WS21/22 (Nachkl.)", [ 0,  0,  0,  0,  1,  0,  4,  3,  8, 11,   7],  34),
        // 17. Sep. 2021 — SS21 Hauptklausur — 238, Ø 3,175
        dist("SS21",              [16,  9, 14, 19, 13, 32, 28, 18, 22, 10,  57], 238),
      ]),
    moduleId: "04-10-0121/de",
  },

  // ── Semester 3 ─────────────────────────────────────────────
  {
    ...pflicht("se", "Software Engineering", 3, 5,
      "Prof. Dr.-Ing. Ermira Mezini",
      "Vorgehensmodelle, Anforderungsanalyse, Architektur, Testen und Qualitätssicherung.",
      [
        // 5. Mär. 2026 — WS25/26 Hauptklausur — 573, Ø 2,760
        dist("WS25/26",           [ 28, 34, 61, 55, 83, 74, 57, 55, 43, 22, 61], 573),
        // 11. Aug. 2025 — SS25 Nachklausur — 60, Ø 3,295
        dist("SS25 (Nachkl.)",    [  0,  1,  3,  3,  7,  6, 11,  6,  6,  7, 10],  60),
        // 6. Mär. 2025 — WS24/25 Hauptklausur — 638, Ø 2,219
        dist("WS24/25",           [103, 95, 71, 85, 65, 60, 52, 33, 29, 10, 35], 638),
        // 5. Aug. 2024 — SS24 Nachklausur — 43, Ø 3,370
        dist("SS24 (Nachkl.)",    [  0,  0,  2,  3,  5,  4,  4,  7,  3,  8,  7],  43),
        // 29. Feb. 2024 — WS23/24 Hauptklausur — 479, Ø 2,859
        dist("WS23/24",           [ 29, 44, 56, 45, 41, 34, 52, 35, 32, 33, 78], 479),
        // 31. Jul. 2023 — SS23 Nachklausur — 48, Ø 3,306
        dist("SS23 (Nachkl.)",    [  4,  1,  3,  5,  4,  3,  4,  2,  2,  5, 15],  48),
        // 2. Mär. 2023 — WS22/23 Hauptklausur — 503, Ø 2,301
        dist("WS22/23",           [ 98, 58, 58, 50, 56, 47, 30, 29, 16, 20, 41], 503),
        // 1. Aug. 2022 — SS22 Nachklausur — 61, Ø 2,775
        dist("SS22 (Nachkl.)",    [  9,  5,  4,  4,  5,  4,  5,  6,  7,  4,  8],  61),
        // 3. Mär. 2022 — WS21/22 Hauptklausur — 442, Ø 2,447
        dist("WS21/22",           [ 59, 51, 48, 50, 49, 38, 41, 23, 28, 18, 37], 442),
        // 25. Feb. 2021 — WS20/21 Hauptklausur — 458, Ø 2,113
        dist("WS20/21",           [105, 59, 53, 48, 47, 50, 29, 21, 15, 10, 21], 458),
      ]),
    moduleId: "20-00-0017",
  },
  {
    ...pflicht("css", "Computersystemsicherheit", 3, 5,
      "Prof. Dr.-Ing. Ahmad-Reza Sadeghi",
      "Grundlagen der IT-Sicherheit, Authentifizierung, Zugriffskontrolle, Kryptografie.",
      [
        // 10. Mär. 2026 — WS25/26 Hauptklausur — 467, Ø 3,334
        dist("WS25/26",           [ 17, 15, 28, 30, 40, 47, 45, 46, 42, 33, 124], 467),
        // 18. Sep. 2025 — SS25 Nachklausur — 91, Ø 3,512
        dist("SS25 (Nachkl.)",    [  1,  4,  3,  1,  8,  8,  6, 18,  7, 12,  23],  91),
        // 11. Mär. 2025 — WS24/25 Hauptklausur — 557, Ø 3,460
        dist("WS24/25",           [ 22, 17, 22, 34, 50, 53, 43, 44, 55, 43, 174], 557),
        // 19. Sep. 2024 — SS24 Nachklausur — 72, Ø 3,063
        dist("SS24 (Nachkl.)",    [  1,  2,  1,  9,  7, 14,  8,  9,  8,  5,   8],  72),
        // 5. Mär. 2024 — WS23/24 Hauptklausur — 489, Ø 3,463
        dist("WS23/24",           [ 14,  9, 20, 37, 45, 41, 43, 44, 55, 37, 144], 489),
        // 14. Sep. 2023 — SS23 Nachklausur — 63, Ø 3,584
        dist("SS23 (Nachkl.)",    [  1,  2,  1,  1,  3,  8,  6,  8,  8,  9,  16],  63),
        // 7. Mär. 2023 — WS22/23 Hauptklausur — 430, Ø 3,039
        dist("WS22/23",           [ 26, 24, 29, 38, 43, 37, 44, 51, 29, 27,  82], 430),
        // 15. Sep. 2022 — SS22 Nachklausur — 44, Ø 3,259
        dist("SS22 (Nachkl.)",    [  0,  3,  3,  2,  3,  3, 11,  3,  5,  1,  10],  44),
        // 8. Mär. 2022 — WS21/22 Hauptklausur — 371, Ø 2,238
        dist("WS21/22",           [ 70, 41, 55, 42, 34, 37, 22, 23, 15,  6,  26], 371),
        // 16. Sep. 2021 — SS21 Nachklausur — 48, Ø 3,667
        dist("SS21 (Nachkl.)",    [  0,  0,  1,  3,  3,  3,  8,  6,  5,  4,  15],  48),
        // 2. Mär. 2021 — WS20/21 Hauptklausur — 378, Ø 2,027
        dist("WS20/21",           [106, 46, 50, 39, 32, 21, 32, 18,  8,  8,  18], 378),
      ]),
    moduleId: "20-00-0018",
  },
  {
    ...pflicht("ki", "Einführung in die Künstliche Intelligenz", 3, 5,
      "Prof. Dr. rer. nat. Kristian Kersting",
      "Suche, Planen, Wissensrepräsentation, Grundlagen des maschinellen Lernens.",
      [
        // 20. Feb. 2026 — WS25/26 Hauptklausur — 818, Ø 2,748
        dist("WS25/26",           [135, 51, 65, 51, 76, 69, 67, 69, 67, 44, 124], 818),
        // 27. Aug. 2025 — SS25 Nachklausur — 57, Ø 2,860
        dist("SS25 (Nachkl.)",    [  5,  3,  2,  6,  8,  7,  8,  2,  4,  4,   8],  57),
        // 21. Feb. 2025 — WS24/25 Hauptklausur — 863, Ø 2,732
        dist("WS24/25",           [ 46, 59, 64, 80,111,109,120, 98, 74, 51,  51], 863),
        // 28. Aug. 2024 — SS24 Nachklausur — 49, Ø 2,988
        dist("SS24 (Nachkl.)",    [  3,  3,  4,  2,  1,  2,  9, 14,  4,  2,   5],  49),
        // 23. Feb. 2024 — WS23/24 Hauptklausur — 612, Ø 3,122
        dist("WS23/24",           [ 34, 22, 36, 59, 51, 60, 66, 58, 62, 49, 115], 612),
        // 30. Aug. 2023 — SS23 Nachklausur — 32, Ø 2,897
        dist("SS23 (Nachkl.)",    [  4,  2,  3,  4,  2,  3,  1,  2,  1,  3,   7],  32),
        // WS22/23 Hauptklausur — 158, Ø 2,661
        dist("WS22/23",           [ 20, 16, 11, 12, 14, 19, 14, 12, 17,  6,  17], 158),
        // 25. Feb. 2022 — WS21/22 Hauptklausur — 365, Ø 2,782
        dist("WS21/22",           [ 11, 21, 32, 39, 59, 56, 35, 27, 27, 26,  32], 365),
        // 25. Feb. 2021 — WS20/21 Hauptklausur — 369, Ø 2,345
        dist("WS20/21",           [ 34, 53, 47, 55, 41, 35, 31, 26, 14, 12,  21], 369),
        // 27. Feb. 2020 — WS19/20 Hauptklausur — 216, Ø 2,944
        dist("WS19/20",           [  8, 13, 25, 26, 20, 16, 25, 20, 12, 13,  38], 216),
      ]),
    moduleId: "20-00-1058",
  },
  {
    ...pflicht("prob-methoden", "Probabilistische Methoden der Informatik", 3, 5,
      "Fachbereich Informatik",
      "Wahrscheinlichkeitstheorie, Zufallsvariablen, probabilistische Algorithmen und ihre Analyse.",
      [
        // 25. Feb. 2026 — WS25/26 Hauptklausur — 450, Ø 3,211
        dist("WS25/26",           [25, 17, 22, 31, 33, 38, 54, 46, 53, 45, 86], 450),
        // 16. Sep. 2025 — SS25 Nachklausur — 61, Ø 3,221
        dist("SS25 (Nachkl.)",    [ 2,  2,  1,  2,  7,  4, 12,  9,  8,  6,  8],  61),
        // 26. Feb. 2025 — WS24/25 Hauptklausur — 283, Ø 3,310
        dist("WS24/25",           [15,  9, 11, 13, 23, 27, 30, 27, 32, 38, 58], 283),
      ]),
    moduleId: "20-00-1150",
  },
  {
    ...pflicht("mss", "Modellierung, Spezifikation und Semantik", 3, 5,
      "Prof. Dr. rer. nat. Reiner Hähnle",
      "Formale Modellierung, Hoare-Logik, operationale Semantik.",
      [
        // 26. Sep. 2025 — SS25 Nachklausur — 65, Ø 3,668
        dist("SS25 (Nachkl.)",    [ 1,  2,  1,  2,  7,  1, 10,  3, 12,  4,  22],  65),
        // 26. Mär. 2025 — WS24/25 Hauptklausur — 386, Ø 3,712
        dist("WS24/25",           [26, 13, 18, 13, 16, 17, 24, 21, 32, 39, 167], 386),
        // 20. Sep. 2024 — SS24 Nachklausur — 47, Ø 3,549
        dist("SS24 (Nachkl.)",    [ 2,  0,  2,  1,  3,  2,  5,  7, 10,  3,  12],  47),
        // 20. Mär. 2024 — WS23/24 Hauptklausur — 308, Ø 3,879
        dist("WS23/24",           [19,  6,  7, 20, 12, 11, 15, 13, 27, 19, 159], 308),
        // 22. Sep. 2023 — SS23 Nachklausur — 50, Ø 2,908
        dist("SS23 (Nachkl.)",    [ 2,  3,  4,  4,  4, 12,  4,  2,  5,  4,   6],  50),
        // 15. Mär. 2023 — WS22/23 Hauptklausur — 349, Ø 2,587
        dist("WS22/23",           [26, 40, 39, 50, 36, 41, 25, 25, 12, 12,  43], 349),
        // 23. Sep. 2022 — SS22 Nachklausur — 67, Ø 3,419
        dist("SS22 (Nachkl.)",    [ 2,  2,  5,  4,  3,  3,  8,  8,  8,  7,  17],  67),
        // 16. Mär. 2022 — WS21/22 Hauptklausur — 280, Ø 3,591
        dist("WS21/22",           [22,  9, 12, 19, 14, 17, 16, 11, 20, 23, 117], 280),
        // 24. Sep. 2021 — SS21 Nachklausur — 63, Ø 3,997
        dist("SS21 (Nachkl.)",    [ 0,  4,  0,  2,  3,  1,  6,  5,  5,  5,  32],  63),
        // 10. Mär. 2021 — WS20/21 Hauptklausur — 275, Ø 3,232
        dist("WS20/21",           [21, 19, 15, 16, 18, 25, 18, 26, 20, 22,  75], 275),
      ]),
    moduleId: "20-00-0013",
  },

  // ── Semester 4 ─────────────────────────────────────────────
  {
    ...pflicht("informationsmanagement", "Informationsmanagement", 4, 5,
      "Prof. Dr. rer. nat. Carsten Binnig",
      "Datenmodellierung, relationale Datenbanken, SQL, Transaktionen.",
      [
        // 15. Sep. 2025 — SS25 Hauptklausur — 580, Ø 3,374
        dist("SS25",              [32, 24, 36, 36, 39, 49, 56, 52, 40, 29, 187], 580),
        // 24. Mär. 2025 — WS24/25 Nachklausur — 71, Ø 3,632
        dist("WS24/25 (Nachkl.)", [ 1,  0,  2,  4,  2,  7,  9, 11, 11,  2,  22],  71),
        // 16. Sep. 2024 — SS24 Hauptklausur — 510, Ø 3,217
        dist("SS24",              [10, 28, 33, 38, 48, 58, 49, 46, 62, 23, 115], 510),
        // 18. Mär. 2024 — WS23/24 Nachklausur — 61, Ø 3,198
        dist("WS23/24 (Nachkl.)", [ 4,  2,  3,  3,  5, 10,  4,  3, 10,  5,  12],  61),
        // 11. Sep. 2023 — SS23 Hauptklausur — 411, Ø 3,113
        dist("SS23",              [24, 29, 28, 40, 25, 32, 36, 42, 41, 22,  92], 411),
        // 13. Mär. 2023 — WS22/23 Nachklausur — 41, Ø 3,773
        dist("WS22/23 (Nachkl.)", [ 0,  1,  0,  1,  3,  2,  8,  2,  5,  5,  14],  41),
        // 12. Sep. 2022 — SS22 Hauptklausur — 429, Ø 3,170
        dist("SS22",              [23, 26, 26, 39, 44, 25, 43, 35, 38, 23, 107], 429),
        // 14. Mär. 2022 — WS21/22 Nachklausur — 64, Ø 3,567
        dist("WS21/22 (Nachkl.)", [ 2,  1,  2,  3,  7,  4,  5,  7,  8,  4,  21],  64),
        // 13. Sep. 2021 — SS21 Hauptklausur — 462, Ø 3,288
        dist("SS21",              [15, 20, 18, 41, 42, 39, 53, 54, 42, 19, 119], 462),
      ]),
    moduleId: "20-00-0015",
  },
  {
    ...pflicht("cnvs", "Computernetze und verteilte Systeme", 4, 5,
      "Prof. Dr. rer. nat. Björn Scheuermann",
      "Schichtenmodelle, TCP/IP, Routing, verteilte Systeme und ihre Konsistenzmodelle.",
      [
        // 11. Mär. 2026 — WS25/26 Nachklausur (Modulangebot SS25) — 25, Ø 3,028
        dist("WS25/26 (Nachkl.)", [ 1,  2,  2,  1,  3,  3,  3,  2,  3,  0,  5],  25),
        // 1. Aug. 2025 — SS25 Hauptklausur — 450, Ø 2,538
        dist("SS25",              [59, 46, 57, 42, 45, 33, 40, 46, 16, 11, 55], 450),
        // WS24/25 Nachklausur — 35, Ø 2,834
        dist("WS24/25 (Nachkl.)", [ 5,  1,  2,  3,  7,  2,  3,  2,  2,  1,  7],  35),
        // 26. Jul. 2024 — SS24 Hauptklausur — 429, Ø 2,551
        dist("SS24",              [72, 43, 48, 37, 32, 40, 30, 37, 16, 12, 62], 429),
        // 6. Mär. 2024 — WS23/24 Nachklausur — 29, Ø 2,903
        dist("WS23/24 (Nachkl.)", [ 4,  1,  3,  1,  5,  0,  2,  3,  2,  3,  5],  29),
        // 8. Mär. 2023 — WS22/23 Nachklausur — 28, Ø 3,118
        dist("WS22/23 (Nachkl.)", [ 3,  0,  2,  3,  2,  0,  8,  1,  0,  2,  7],  28),
        // 22. Jul. 2022 — SS22 Hauptklausur — 335, Ø 2,476
        dist("SS22",              [52, 36, 41, 39, 28, 20, 32, 18, 20, 10, 39], 335),
        // 9. Mär. 2022 — WS21/22 Nachklausur — 22, Ø 2,757
        dist("WS21/22 (Nachkl.)", [ 2,  1,  0,  5,  4,  1,  0,  3,  3,  0,  3],  22),
      ]),
    moduleId: "20-00-1151",
  },

  // ── Semester 5 ─────────────────────────────────────────────
  {
    ...pflicht("parallele-programmierung", "Parallele Programmierung", 5, 5,
      "Prof. Dr. rer. nat. Felix Wolf",
      "Nebenläufigkeit, Synchronisation, parallele Architekturen und Programmiermodelle.",
      [
        // 31. Mär. 2026 — WS25/26 (20-00-1152) — 477, Ø 2,290
        dist("WS25/26",          [ 21, 74,103, 91, 43, 32, 33, 20, 18,  9, 33], 477),
        // 31. Mär. 2025 — WS24/25 (20-00-1152) — 156, Ø 2,273
        dist("WS24/25",          [ 16, 28, 24, 21, 13, 15,  6, 15,  5,  2, 11], 156),
        // WS23/24 Systemnahe und parallele Programmierung (20-00-0905) — 305, Ø 1,812
        dist("WS23/24 (alt)",    [142, 36, 19, 21, 19, 13, 19,  9,  6,  3, 18], 305),
        // WS22/23 (20-00-0905) — 383, Ø 1,681
        dist("WS22/23 (alt)",    [135,108, 45, 25, 15, 13,  9,  8,  3,  2, 20], 383),
        // 25. Mär. 2022 — WS21/22 (20-00-0905) — 382, Ø 1,436
        dist("WS21/22 (alt)",    [157,121, 36, 26, 11,  7, 14,  5,  5,  0,  0], 382),
        // WS20/21 (20-00-0905) — 301, Ø 1,415
        dist("WS20/21 (alt)",    [108,103, 48, 23,  7,  4,  2,  1,  3,  1,  1], 301),
        // 31. Mär. 2020 — WS19/20 (20-00-0905) — 329, Ø 1,495
        dist("WS19/20 (alt)",    [162, 56, 57, 17, 17,  1,  0,  0,  6,  3, 10], 329),
      ]),
    moduleId: "20-00-1152",
  },
  {
    ...pflicht("info-gesellschaft", "Informatik und Gesellschaft", 5, 3,
      "Fachbereich Informatik",
      "Ethische, gesellschaftliche und rechtliche Aspekte der Informatik.",
      [
        // 28. Jul. 2025 — SS25 Nachklausur — 39, Ø 4,141
        dist("SS25 (Nachkl.)", [ 0,  0,  0,  0,  0,  2,  4,  4,  7,  5, 17],  39),
        // 28. Feb. 2025 — WS24/25 Hauptklausur — 171, Ø 3,370
        dist("WS24/25",        [14,  6,  8,  6, 10, 16, 15, 12, 20, 16, 48], 171),
      ]),
    moduleId: "20-00-1153",
  },
  {
    ...pflicht("wiss-arbeiten", "Einführung in wissenschaftliches Arbeiten", 5, 3,
      "Fachbereich Informatik",
      "Literaturrecherche, wissenschaftliches Schreiben, Zitieren, Präsentieren.",
      [
        // 31. Mär. 2026 — WS25/26 — 439, Ø 1,545
        dist("WS25/26", [176, 88, 61, 46, 28, 18,  5,  9,  2,  3,  3], 439),
        // 31. Mär. 2025 — WS24/25 — 159, Ø 1,923
        dist("WS24/25", [ 26, 40, 20, 16, 20, 15,  9,  6,  2,  4,  1], 159),
      ]),
    moduleId: "20-00-1154",
  },
  {
    ...pflicht("teamprojekt", "Bachelor-Praktikum (Teamprojekt Softwareentwicklung)", 5, 9,
      "Prof. Dr.-Ing. Ermira Mezini",
      "Größeres Entwicklungsprojekt im Team, Anforderungen bis Abnahme. Pflichtmodul im B.Sc. Informatik.",
      [
        // WS24/25 Bachelor-Praktikum — 125, Ø 1,130
        dist("WS24/25",                  [103, 10,  3,  4,  4,  0,  1,  0,  0,  0, 0], 125),
        // 31. Mär. 2024 — WS23/24 Bachelor-Praktikum — 238, Ø 1,203
        dist("WS23/24",                  [150, 54, 29,  1,  0,  0,  0,  0,  4,  0, 0], 238),
        // 31. Mär. 2023 — WS22/23 Bachelor-Praktikum — 220, Ø 1,319
        dist("WS22/23",                  [118, 47, 27, 16,  4,  4,  0,  4,  0,  0, 0], 220),
        // 31. Mär. 2022 — WS21/22 Bachelor-Praktikum — 254, Ø 1,446
        dist("WS21/22",                  [ 84, 87, 42, 14, 14,  8,  4,  0,  0,  0, 1], 254),
        // 31. Mär. 2021 — WS20/21 Bachelor-Praktikum — 236, Ø 1,360
        dist("WS20/21",                  [ 91, 83, 38, 15,  0,  5,  3,  0,  0,  0, 1], 236),
        // WS19/20 Bachelor-Praktikum — 220, Ø 1,473
        dist("WS19/20",                  [ 28,118, 50, 12,  2,  4,  5,  1,  0,  0, 0], 220),
        // 20-00-0359 SE-Projektseminar WS24/25 (altes Modul) — 22, Ø 1,095
        dist("WS24/25 (SE-Proj.-Sem.)",  [ 15,  7,  0,  0,  0,  0,  0,  0,  0,  0, 0],  22),
      ]),
    moduleId: "20-00-0906",
  },

  // ── Wahlpflichtbereich (offener Wahlkatalog) ──────────────
  {
    slug: "betriebssysteme", name: "Betriebssysteme", bereich: "wahlpflicht",
    professor: "Prof. Dr. Krüger", ects: 6,
    description: "Prozesse, Scheduling, Speicherverwaltung, Dateisysteme, Nebenläufigkeit.",
    distributions: [
      dist("SS25",    [1,  3,  4,  7,  3,  4,  6, 12,  5,  1,  7],  53),
      dist("WS24/25", [9, 21, 22, 26, 41, 20, 25, 27, 14,  6, 43], 254),
      dist("SS24",    [6,  4, 10,  8,  6,  7,  6,  2,  2,  0,  0],  51),
      dist("WS23/24", [3,  9, 37, 40, 44, 42, 41, 35, 24, 12, 32], 319),
      dist("SS23",    [1,  1,  4,  7,  9,  5,  1,  4,  1,  1,  5],  39),
      dist("WS22/23", [1, 12, 28, 36, 53, 41, 29, 30, 20,  4, 39], 293),
      dist("WS21/22", [7, 30, 39, 36, 31, 23, 19, 16, 12, 11, 33], 257),
    ],
    reviews: [{ author: "J.", rating: 3, semester: "SS24", text: "Klausur fair, Praktikum sehr zeitaufwendig." }],
  },
  {
    slug: "einfuehrung-compilerbau", name: "Einführung in den Compilerbau", bereich: "wahlpflicht",
    professor: "Prof. Dr. Lang", ects: 6,
    description: "Lexing, Parsing, Zwischencode, Optimierung und Codegenerierung.",
    distributions: [
      dist("WS25/26", [  5,   2,  3,  3,  3,  4,  1,  5,  4,  4, 11],  45),
      dist("WS24/25", [146, 122, 83, 52, 31, 13, 11, 14,  4,  2,  8], 486),
      dist("WS23/24", [161, 115, 50, 25, 10,  5,  5,  5,  0,  0, 16], 392),
      dist("WS22/23", [ 82, 111, 80, 29, 12,  3,  1,  0,  0,  0,  0], 318),
      dist("WS21/22", [ 70, 130, 55, 22, 16,  3,  2,  6,  2,  0,  0], 306),
      dist("WS20/21", [ 84, 111, 57, 29, 10,  6,  6,  1,  2,  0,  0], 306),
      dist("WS18/19", [ 46,  79, 68, 31, 20, 14,  5,  3,  0,  0,  0], 266),
    ],
    reviews: [],
  },
  {
    slug: "scientific-computing",
    moduleId: "20-00-1156",
    name: "Scientific Computing (vormals Computational Engineering und Robotik)",
    bereich: "wahlpflicht",
    professor: "Prof. Ph. D. Jan Peters",
    ects: 6,
    description: "Numerische Verfahren, Simulation, wissenschaftliches Rechnen. Modulnachfolger von 20-00-0011.",
    distributions: [
      // 6. Mär. 2026 — WS25/26 (20-00-1156) — 12, Ø 3,392
      dist("WS25/26",           [ 0,  0,  0,  1,  0,  1,  4,  2,  2,  0,  2],  12),
      // 8. Sep. 2025 — SS25 (20-00-1156) — 37, Ø 3,151
      dist("SS25",              [ 3,  0,  1,  4,  3,  3,  4,  6,  3,  4,  6],  37),
      // 7. Mär. 2025 — WS24/25 Nachklausur (20-00-0011 alt) — 23, Ø 3,100
      dist("WS24/25 (alt)",     [ 1,  2,  0,  1,  2,  1,  4,  3,  5,  2,  2],  23),
      // 9. Sep. 2024 — SS24 (20-00-1156) — 19, Ø 3,216
      dist("SS24",              [ 1,  0,  1,  2,  0,  5,  0,  4,  1,  1,  4],  19),
      // 1. Mär. 2024 — WS23/24 Nachklausur (20-00-0011 alt) — 17, Ø 3,376
      dist("WS23/24 (alt)",     [ 0,  1,  0,  0,  1,  1,  3,  2,  5,  3,  1],  17),
      // 4. Sep. 2023 — SS23 (20-00-0011 alt) — 267, Ø 2,976
      dist("SS23 (alt)",        [14,  6, 11, 29, 31, 37, 24, 34, 34, 20, 27], 267),
      // 3. Mär. 2023 — WS22/23 Nachklausur (20-00-0011 alt) — 41, Ø 3,500
      dist("WS22/23 (alt)",     [ 0,  1,  2,  7,  2,  4,  3,  2,  4,  1, 15],  41),
      // 5. Sep. 2022 — SS22 (20-00-0011 alt) — 335, Ø 2,390
      dist("SS22 (alt)",        [91, 24, 38, 13, 29, 32, 22, 21,  8, 15, 42], 335),
    ],
    reviews: [],
  },
  {
    slug: "formale-methoden",
    moduleId: "20-00-0901",
    name: "Formale Methoden im Softwareentwurf",
    bereich: "wahlpflicht",
    professor: "Prof. Dr. rer. nat. Reiner Hähnle",
    ects: 6,
    description: "Formale Verifikation, Modellprüfung und Beweistechniken für Software.",
    distributions: [
      // 26. Mär. 2026 — WS25/26 Nachklausur — 21, Ø 3,614
      dist("WS25/26 (Nachkl.)", [ 1,  0,  1,  0,  3,  0,  2,  3,  2,  2,  7],  21),
      // 23. Sep. 2025 — SS25 Hauptklausur — 100, Ø 3,051
      dist("SS25",              [ 7, 10,  5,  5,  8, 11,  8, 12,  7,  6, 21], 100),
      // 3. Apr. 2025 — WS24/25 Nachklausur — 43, Ø 2,851
      dist("WS24/25 (Nachkl.)", [ 1,  2,  3,  9,  2,  8,  3,  3,  4,  4,  4],  43),
      // 24. Sep. 2024 — SS24 Hauptklausur — 162, Ø 2,965
      dist("SS24",              [22, 10,  5, 15, 13, 14, 13, 12, 15, 10, 33], 162),
      // 28. Mär. 2024 — WS23/24 Nachklausur — 50, Ø 2,780
      dist("WS23/24 (Nachkl.)", [ 5,  4,  4,  5,  7,  4,  4,  2,  5,  2,  8],  50),
      // 19. Sep. 2023 — SS23 Hauptklausur — 223, Ø 3,018
      dist("SS23",              [24, 20, 13,  8, 11, 23, 22, 24, 19, 13, 46], 223),
      // 23. Mär. 2023 — WS22/23 Nachklausur — 43, Ø 3,270
      dist("WS22/23 (Nachkl.)", [ 1,  0,  1,  4,  3,  6,  6,  9,  3,  2,  8],  43),
      // SS22 Hauptklausur — 139, Ø 2,524 (bessere Auswertung von zwei Spiegeln)
      dist("SS22",              [20, 13, 23, 11, 11, 13,  8, 11,  6,  5, 18], 139),
    ],
    reviews: [],
  },
  {
    slug: "visual-computing", name: "Visual Computing", bereich: "wahlpflicht",
    professor: "Prof. Dr. Wagner", ects: 6,
    description: "Grundlagen von Computergrafik, Bildverarbeitung und Visualisierung.",
    distributions: [
      dist("SS25",    [ 23, 33, 31, 11, 11,  4,  1,  7,  3,  0, 14], 138),
      dist("WS24/25", [114, 79, 77, 49, 40, 28, 15, 12,  7,  2, 43], 466),
      dist("SS24",    [ 12, 15, 16, 13,  9, 10,  3,  1,  5,  1, 10],  95),
      dist("WS23/24", [ 89, 62, 59, 60, 43, 30, 23, 11,  3,  8, 49], 437),
      dist("SS23",    [  8,  4,  9,  6,  4,  3,  5,  5,  0,  2, 12],  58),
      dist("WS22/23", [ 70, 47, 55, 42, 40, 27, 18, 20,  3,  5, 42], 369),
      dist("SS22",    [  6,  4,  7, 11,  7, 10,  8,  8,  6,  1, 15],  83),
      dist("WS21/22", [ 57, 53, 53, 54, 40, 22, 13, 11,  4,  3, 21], 331),
    ],
    reviews: [],
  },

  // ── Wahlbereich ────────────────────────────────────────────
  // ── Wahlbereich-Vorlesungen mit echten Notendaten ─────────
  {
    slug: "vl-18sm2350", moduleId: "18-sm-2350",
    name: "Routing, Switching und Forwarding",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["kvs"],
    professor: "Prof. Dr. rer. nat. Björn Scheuermann", ects: 6,
    description: "Routing-, Switching- und Forwarding-Verfahren in Rechnernetzen.",
    distributions: [
      dist("SS25",    [24, 6, 5, 2, 1, 4, 1, 1, 1, 0, 4], 49),
      dist("WS23/24", [17, 3, 2, 1, 3, 2, 0, 0, 0, 2, 1], 31),
    ],
    reviews: [],
  },
  {
    slug: "vl-18sm1010", moduleId: "18-sm-1010",
    name: "Kommunikationsnetze I",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["kvs"],
    professor: "Prof. Dr. rer. nat. Björn Scheuermann", ects: 6,
    description: "Grundlagen der Rechnernetze und Internettechnologien.",
    distributions: [
      dist("SS25", [17, 13, 19, 19, 22, 18, 27, 14, 15, 15, 45], 224),
    ],
    reviews: [],
  },
  {
    slug: "vl-18sm2330", moduleId: "18-sm-2330",
    name: "Anwendungsprotokolle im Internet",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["kvs"],
    professor: "Prof. Dr. rer. nat. Björn Scheuermann", ects: 6,
    description: "Anwendungsschichtprotokolle, HTTP, DNS, E-Mail, Streaming-Technologien.",
    distributions: [
      dist("WS24/25", [22, 9, 6, 3, 1, 5, 3, 3, 0, 0, 1], 53),
    ],
    reviews: [],
  },
  {
    slug: "vl-18sm2340", moduleId: "18-sm-2340",
    name: "Resiliente Kommunikationsnetzwerke",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["kvs"],
    professor: "Dr.-Ing. Tobias Meuser; Prof. Dr. rer. nat. Björn Scheuermann", ects: 6,
    description: "Ausfallsichere Netze, Fehlertoleranz, Redundanz, Overlays.",
    distributions: [
      dist("SS24", [13, 5, 4, 8, 5, 6, 7, 2, 6, 2, 9], 67),
      dist("SS23", [11, 8, 3, 6, 1, 1, 1, 1, 0, 1, 0], 33),
    ],
    reviews: [],
  },
  {
    slug: "vl-18sm2010", moduleId: "18-sm-2010",
    name: "Kommunikationsnetze II",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["kvs"],
    professor: "Prof. Dr. rer. nat. Björn Scheuermann", ects: 6,
    description: "Vertiefende Themen der Rechnernetze: Routing, Verkehrsmanagement, QoS, Sicherheit.",
    distributions: [
      dist("SS24 (Nachkl.)", [11,  5,  3,  4,  4,  5,  5,  4,  2, 11,  7],  61),
      dist("WS23/24",        [74, 17, 23, 20, 16, 13,  4,  6, 11,  5, 28], 217),
      dist("SS23 (Nachkl.)", [ 7,  1,  2,  3,  2,  5,  2,  0,  6,  1,  8],  37),
      dist("WS22/23",        [32, 20, 15, 10, 16, 14, 10, 11,  5,  8, 21], 162),
    ],
    reviews: [],
  },
  {
    slug: "vl-18sm2280", moduleId: "18-sm-2280",
    name: "Software Defined Networking",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["kvs"],
    professor: "Prof. Dr. rer. nat. Björn Scheuermann", ects: 6,
    description: "SDN-Architekturen, OpenFlow, Netzprogrammierbarkeit, Kontroll- und Datenebene.",
    distributions: [
      dist("WS24/25", [15, 8, 8, 8, 5, 3, 2, 4, 5, 5, 6], 69),
      dist("WS23/24", [11, 6, 1, 0, 3, 5, 3, 1, 2, 4, 5], 41),
      dist("WS22/23", [ 7, 5, 8, 4, 4, 6, 6, 3, 5, 4, 7], 59),
    ],
    reviews: [],
  },
  {
    slug: "vl-20000748", moduleId: "20-00-0748",
    name: "Mobile Netze",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["kvs"],
    professor: "Prof. Dr.-Ing. Matthias Hollick", ects: 6,
    description: "Drahtlose und mobile Kommunikation, Mobilitätsmanagement, Mobilfunknetze.",
    distributions: [
      dist("WS25/26",        [ 7, 6,  7,  6,  8,  7,  2,  7,  5, 1, 23],  79),
      dist("WS24/25",        [10, 2,  6,  5,  4,  9,  1,  1,  3, 3, 31],  75),
      dist("WS23/24",        [10, 5,  9, 15,  9, 15,  7,  6,  6, 8, 21], 111),
      dist("SS23 (Nachkl.)", [ 1, 0,  0,  1,  2,  2,  0,  1,  1, 3,  8],  19),
    ],
    reviews: [],
  },
  {
    slug: "vl-20000780", moduleId: "20-00-0780",
    name: "Drahtlose Netze zur Krisenbewältigung: Grundlagen, Entwurf und Aufbau von Null",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["kvs"],
    professor: "Prof. Dr. Dr. Christian Reuter", ects: 6,
    description: "Aufbau drahtloser Netze für Krisen- und Katastrophensituationen von Grund auf.",
    distributions: [
      dist("WS25/26",        [21, 15, 20, 19, 11, 11, 10, 4, 3, 5,  7], 126),
      dist("WS24/25",        [31,  7,  8,  7,  7,  4,  7, 5, 0, 1,  9],  86),
      dist("SS23 (Nachkl.)", [ 0,  3,  1,  1,  2,  3,  0, 0, 0, 0,  0],  10),
      dist("WS22/23",        [14,  7,  5,  4,  4,  8,  4, 9, 5, 2, 14],  76),
      dist("WS21/22",        [26, 10,  6,  7,  8, 11,  4, 2, 1, 2,  1],  78),
    ],
    reviews: [],
  },
  {
    slug: "vl-20001188", moduleId: "20-00-1188",
    name: "Networked and Low-Power Embedded Systems",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["kvs"],
    professor: "Prof. Dr. Marco Zimmerling", ects: 6,
    description: "Eingebettete Systeme mit Netzanbindung, energiearme Protokolle und Hardware.",
    distributions: [
      dist("WS24/25", [7, 3, 3, 1, 6, 3, 1, 3, 0, 0, 2], 29),
    ],
    reviews: [],
  },
  {
    slug: "vl-20001202", moduleId: "20-00-1202",
    name: "Foundations of Modern Data Systems",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["kvs"],
    professor: "Prof. Dr. rer. nat. Carsten Binnig; Prof. Ph.D. Zsolt Istvan", ects: 6,
    description: "Grundlagen moderner Datenverarbeitungssysteme, Datenbanken, verteilte Storage-Systeme.",
    distributions: [
      dist("WS25/26", [ 6, 5, 5, 9, 6, 2, 3, 6, 1, 0, 11], 54),
      dist("WS24/25", [18, 1, 1, 3, 1, 2, 1, 0, 0, 0, 18], 45),
    ],
    reviews: [],
  },
  {
    slug: "vl-20000065", moduleId: "20-00-0065",
    name: "TK1: Verteilte Systeme und Algorithmen",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["kvs"],
    professor: "Prof. Dr. rer. nat. Eberhard Max Mühlhäuser", ects: 6,
    description: "Grundlagen verteilter Systeme, Konsens, Replikation, verteilte Algorithmen.",
    distributions: [
      // WS22/23: zwei Notenspiegel vorhanden, bessere Auswertung übernommen (Ø 3,309 statt 3,601)
      dist("WS22/23", [3, 2, 3, 6, 6, 9, 6, 8, 4, 0, 21], 68),
    ],
    reviews: [],
  },
  {
    slug: "vl-20000056", moduleId: "20-00-0056",
    name: "Netz-, Verkehrs- und Qualitäts-Management für Internet Services",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["kvs"],
    professor: "Prof. Dr. rer. nat. Eberhard Max Mühlhäuser", ects: 6,
    description: "Management von Netz- und Dienstgüte, QoS-Verfahren, Verkehrsanalyse.",
    distributions: [
      dist("SS23",     [4, 3, 2, 2, 3, 3, 2, 2, 4,  2,  4], 31),
      dist("SoSe 19", [6, 6, 3, 2, 3, 2, 7, 0, 3, 12, 18], 62),
    ],
    reviews: [],
  },
  {
    slug: "vl-20000449", moduleId: "20-00-0449",
    name: "Probabilistische Graphische Modelle",
    bereich: "wahl", subtype: "vorlesung", fachgebiete: ["ki"],
    professor: "Prof. Dr. rer. nat. Kristian Kersting", ects: 6,
    description: "Bayessche Netze, Markov-Netze, Inferenz und Lernen in graphischen Modellen.",
    distributions: [
      dist("WS22/23", [10, 6, 8, 6, 9, 8, 8, 4, 2, 2, 6], 69),
    ],
    reviews: [],
  },
  ...vorlesungen(),
  ...seminars(),
  ...praktika(),
  ...lehrepraktika(),
];

export function getCourse(slug: string): Course | undefined {
  return courses.find(c => c.slug === slug);
}

export function coursesByBereich(bereich: Course["bereich"]): Course[] {
  return courses.filter(c => c.bereich === bereich);
}

export function coursesByWahlSubtype(subtype: NonNullable<Course["subtype"]>): Course[] {
  return courses.filter(c => c.bereich === "wahl" && c.subtype === subtype);
}

export function pflichtBySemester(): Record<number, Course[]> {
  const out: Record<number, Course[]> = {};
  for (const c of courses) {
    if (c.bereich !== "pflicht" || !c.semester) continue;
    (out[c.semester] ||= []).push(c);
  }
  return out;
}
