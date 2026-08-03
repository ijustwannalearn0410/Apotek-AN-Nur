import { NextResponse } from "next/server";
import { ref, get, update } from "firebase/database";
import { db } from "../../../../lib/firebase";

// Fungsi pembantu untuk melacak path ID pasien secara mendalam (Recursive Search)
function findPatientPath(obj: any, targetKey: string, currentPath: string): string | null {
  if (typeof obj !== "object" || obj === null) return null;
  
  for (const key in obj) {
    if (key === targetKey) {
      return `${currentPath}/${key}`;
    }
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const found = findPatientPath(obj[key], targetKey, `${currentPath}/${key}`);
      if (found) return found;
    }
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, uid, type } = body;

    if (!key || !uid || !type) {
      return NextResponse.json({ error: "Data kiriman tidak lengkap" }, { status: 400 });
    }

    // 1. Validasi Hak Akses Admin/Staff
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();
    if (!snapshot.exists() || userData.role !== "admin") {
      return NextResponse.json({ error: "Akses ditolak: Anda bukan Admin" }, { status: 403 });
    }

    // 2. AMBIL SEMUA DATA ANTRIAN
    const queuesRef = ref(db, "queues");
    const queuesSnapshot = await get(queuesRef);
    
    let realPatientPath = null;

    if (queuesSnapshot.exists()) {
      const queuesData = queuesSnapshot.val();
      
      // Lakukan looping hanya pada folder yang berformat tanggal (dimulai dengan angka '202')
      for (const dateKey in queuesData) {
        if (!dateKey.startsWith("202")) continue; // Abaikan ghost nodes di tingkat root
        
        const dateNode = queuesData[dateKey];
        // Cari path riil pasien di dalam folder tanggal aktif ini
        const foundPath = findPatientPath(dateNode, key, `queues/${dateKey}`);
        
        if (foundPath) {
          realPatientPath = foundPath;
          break; // Hentikan pencarian jika posisi asli pasien sudah ketemu
        }
      }
    }

    // Jika ID pasien tetap tidak ditemukan setelah pemindaian total
    if (!realPatientPath) {
      return NextResponse.json({ 
        error: "ID Pasien tidak ditemukan pada antrean tanggal mana pun." 
      }, { status: 404 });
    }

    // 3. EKSEKUSI UPDATE: Mengubah tipe prioritas tepat pada koordinat asli pasien
    const patientQueueRef = ref(db, realPatientPath);
    await update(patientQueueRef, { type: type });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}