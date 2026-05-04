import { adminDb } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-admin-token") === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await adminDb
    .collection("submissions")
    .where("status", "==", "pending")
    .orderBy("submittedAt", "desc")
    .get();

  const submissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(submissions);
}
