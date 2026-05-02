import { NextResponse } from "next/server";
import { checkInQueue } from "../../../../lib/adminController";
import { ref, get } from "firebase/database";
import { db } from "../../../../lib/firebase";

export async function POST(request: Request) {
  try {
   
    const body = await request.json();
    const { key , uid} = body;

    if (!key || !uid)  {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();
    if (!snapshot.exists() || userData.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak: Anda bukan Admin" }, { status: 403 });
    }

  
    await checkInQueue(key); 
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}