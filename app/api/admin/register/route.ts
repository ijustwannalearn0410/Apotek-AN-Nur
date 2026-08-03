import { NextResponse } from "next/server";
// FIX: Menambahkan 'set' ke dalam daftar import dari firebase/database
import { ref, push, get, set, serverTimestamp } from "firebase/database";
import { db } from "../../../../lib/firebase"; // Sesuaikan path ini jika menggunakan alias @

export async function POST(request: Request) {
  try {
    const { uid, name, type, age, complaint } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: "UID diperlukan" }, { status: 400 });
    }

    // Verifikasi admin/staff
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists() || snapshot.val().role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    // Ambil antrean terakhir untuk menentukan nomor urut otomatis
    const queueRef = ref(db, "queues");
    const queueSnapshot = await get(queueRef);
    let nextNumber = 1;
    if (queueSnapshot.exists()) {
      const data = Object.values(queueSnapshot.val()) as any[];
      nextNumber = data.length + 1;
    }

    // Generate reference document push baru
    const newQueueRef = push(queueRef);
    
    // FIX ERROR 2339: Mengubah format penulisan dari method-style menjadi function-style
    await set(newQueueRef, {
      name,
      type,
      age: age || "Tidak diisi",
      complaint: complaint || "Tidak ada keluhan",
      queueNumber: nextNumber,
      status: "checked-in", // Sesuai dengan pembacaan filter di page Dokter kemarin
      createdAt: serverTimestamp()
    });

    return NextResponse.json({ success: true, queueNumber: nextNumber });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}