import { getCourse } from "@/lib/dummyCourses";
import { adminDb } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  const taken = new Set<string>(course?.distributions.map(d => d.semester) ?? []);

  try {
    const snapshot = await adminDb
      .collection("courses")
      .doc(slug)
      .collection("distributions")
      .get();
    snapshot.docs.forEach(doc => taken.add(doc.data().semester as string));
  } catch {
    // Firebase unavailable — fall back to hardcoded only
  }

  return NextResponse.json(Array.from(taken));
}
