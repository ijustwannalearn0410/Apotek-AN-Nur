import { NextResponse } from "next/server";
import { ref, set } from "firebase/database";
import { db } from "../../../../lib/firebase";

export async function POST(request: Request) {
  try {
    const { uid, email, phone, fullname } = await request.json();

   
    await set(ref(db, "users/" + uid), {
      email,
      phone,
      fullname,
      role: "user", 
      createdAt: Date.now()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}