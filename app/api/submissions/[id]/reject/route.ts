import { adminDb } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-admin-token") === process.env.ADMIN_SECRET;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const subRef = adminDb.collection("submissions").doc(id);
  const sub = await subRef.get();

  if (!sub.exists) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  await subRef.update({ status: "rejected" });
  return NextResponse.json({ ok: true });
}
