import { useState } from "react";
import { useRouter } from "next/navigation";
export interface PatientData {
  patientName: string;
  patientAge: string;
  complaint: string;
  priorityReason?: string;
}
export const useQueue = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Type and User Checker
  const handleJoin = async (
    type: "normal" | "emergency", 
    userId: string | null,
    patientData: PatientData) => {
    // 1. Validasi awal
    if (!userId) {
      alert("User ID tidak ditemukan. Pastikan Anda sudah login.");
      return;
    }
    if (!patientData.patientName || !patientData.patientAge || !patientData.complaint) {
      alert("Mohon lengkapi formulir Nama Pasien, Usia, dan Keluhan.");
      return;
    }

    setLoading(true);

    try {
    //Api fetch
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: type, 
          uid: userId,
          patientName: patientData.patientName,
          patientAge: patientData.patientAge,
          complaint: patientData.complaint,
          priorityReason: patientData.priorityReason ?? "",
        }),
      });
      //Server Response Checker
      const data = await res.json();
      
      if (res.ok) {
        alert("Nomor antrian kamu: " + data.nextNumber);
      
        router.push("/Dashboards/queue/status");
      } else {
       //non200 erors
        throw new Error(data.error || "Gagal mengambil nomor antrian");
      }
    } catch (error: any) {
      //eror handler
      console.error("Join Queue Error:", error);
      alert(error.message);
    } finally {
      
      setLoading(false);
    }
  };

  
  return { handleJoin, loading };
};