"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminQueues } from "@/hooks/useAdminQueues";
import LogoutButton from "@/app/Components/logoutButton";
import { auth } from "@/lib/firebase"; 

interface DisplayQueue {
  id?: string;
  key?: string; 
  name: string;
  age?: string;        
  complaint?: string;  
  queueNumber: number | string; 
  type: string; 
  status: string; 
}

export default function ReceptionistDashboard() {
  const { queues, loadingData } = useAdminQueues();
  const [receptionistUid, setReceptionistUid] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setReceptionistUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const allQueues = (queues || []) as unknown as DisplayQueue[];

  const filteredQueues = allQueues.filter((p) => {
    const matchName = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchNumber = String(p.queueNumber).includes(searchTerm);
    return matchName || matchNumber;
  });

  const handleCheckIn = async (patientKey: string) => {
    if (!receptionistUid) return;
    try {
      await fetch("/api/admin/check", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: receptionistUid, key: patientKey })
      });
    } catch (error) {
      console.error("Gagal melakukan check-in:", error);
    }
  };

  const handleRewritePriority = async (patientKey: string, currentType: string) => {
  if (!receptionistUid) return;
  const targetType = currentType === "emergency" ? "normal" : "emergency";
  
  if (!confirm(`Ubah status prioritas pasien menjadi "${targetType}"?`)) {
    return;
  }

  try {
    // FIX: Menampung hasil fetch ke dalam variabel response
    const response = await fetch("/api/admin/priority_rewrite", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        uid: receptionistUid, 
        key: patientKey,
        type: targetType 
      })
    });

    // FIX: Membaca isi JSON pesan dari backend
    const data = await response.json();

    if (response.ok && data.success) {
      // Jika berhasil, data Firebase otomatis tersinkronisasi lewat hook useAdminQueues
      console.log("Prioritas berhasil diubah di database!");
    } else {
      // Jika server menolak (misal: role bukan admin / data salah), alert akan muncul
      alert(`Gagal merubah data: ${data.error || "Terjadi kesalahan pada server"}`);
    }

  } catch (error) {
    console.error("Gagal merubah data prioritas akibat jaringan:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="font-semibold text-gray-800 tracking-tight">Apotek AN-Nur <span className="text-gray-400 font-normal">| Validasi Loket</span></span>
          </div>
          <div className="flex items-center space-x-3">
            <Link 
              href="/admins" 
              className="text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-xl transition-all duration-200"
            >
              ← Kembali ke Portal
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-gray-100 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Daftar Kedatangan Pasien</h2>
            <p className="text-xs text-gray-400 mt-0.5">Konfirmasi kehadiran fisik dan kontrol penyalahgunaan prioritas.</p>
          </div>
          <div className="w-full sm:w-72">
            <input 
              type="text"
              placeholder="Cari nama atau nomor antrean..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white text-gray-800 rounded-xl px-4 py-2 text-xs transition-all duration-200 outline-none"
            />
          </div>
        </div>

        {/* Grid List */}
        <div className="space-y-3">
          {loadingData ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 text-sm animate-pulse">
              Sinkronisasi data antrean...
            </div>
          ) : filteredQueues.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 text-sm">
              {searchTerm ? "Tidak ditemukan antrean yang cocok." : "Belum ada pasien yang mengambil nomor antrean."}
            </div>
          ) : (
            filteredQueues.map((patient: DisplayQueue) => {
              const itemKey = patient.key || patient.id || "";
              const isCheckedIn = patient.status === "checked-in" || patient.status === "in-progress";

              return (
                <div 
                  key={itemKey}
                  className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight leading-none">NO</span>
                      <span className="text-lg font-black text-gray-800 leading-tight">{patient.queueNumber}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-gray-800 text-base">{patient.name || "Anonim"}</h4>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          patient.type === "emergency" ? "bg-red-50 text-red-600 border border-red-100" : "bg-gray-100 text-gray-600"
                        }`}>
                          {patient.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Umur: {patient.age || "-"} Tahun | Keluhan: <span className="text-gray-600 italic">"{patient.complaint || "Tidak ada"}"</span>
                      </p>
                    </div>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    {/* FIX LOGIK: Tombol Naik/Turun HANYA muncul jika belum checked-in (!isCheckedIn) */}
                    {!isCheckedIn && (
                      <button
                        onClick={() => handleRewritePriority(itemKey, patient.type)}
                        className={`text-xs font-medium px-3 py-2 rounded-xl border transition-all duration-200 ${
                          patient.type === "emergency"
                            ? "border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-100"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {patient.type === "emergency" ? "⚠️ Turunkan ke Normal" : "Naikkan ke Prioritas"}
                      </button>
                    )}

                    <button
                      onClick={() => handleCheckIn(itemKey)}
                      disabled={isCheckedIn}
                      className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 border shadow-sm ${
                        isCheckedIn
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600 cursor-not-allowed opacity-90"
                          : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isCheckedIn ? "✓ Terverifikasi" : "Konfirmasi Check-In"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}