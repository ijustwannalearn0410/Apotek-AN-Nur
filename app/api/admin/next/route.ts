import { NextResponse } from "next/server";
import { callNextQueue } from "../../../../lib/adminController";
import { ref, get } from "firebase/database";
import { db } from "../../../../lib/firebase";
export async function POST(request: Request) {
  try {
    const { uid } = await request.json();
    if (!uid) return NextResponse.json({ error: "UID diperlukan" }, { status: 400 });
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists() || snapshot.val().role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }
    await callNextQueue();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}