import { NextResponse } from "next/server";
import { joinQueue } from "../../../lib/queueService";

export async function POST(request: Request) {
  try {
   const { type, uid, patientName, patientAge, complaint } = await request.json();
    if (!uid) return NextResponse.json({ error: "UID tidak ditemukan" }, { status: 401 });
    if (!patientName || !patientAge || !complaint) {
      return NextResponse.json({ error: "Nama pasien, usia, dan keluhan wajib diisi" }, { status: 400 });
    }
    const nextNumber = await joinQueue(type, uid, { 
      patientName, 
      patientAge, 
      complaint 
    });
    return NextResponse.json({ nextNumber });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}