"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"; // Ditambahkan untuk navigasi antar halaman
import { useAdminQueues } from "@/hooks/useAdminQueues";
import LogoutButton from "@/app/Components/logoutButton";
import { auth } from "@/lib/firebase"; 

interface DisplayQueue {
  id?: string;
  key?: string; 
  name: string;
  age?: string;        
  complaint?: string;  
  queueNumber?: number | string; 
  type: string; 
  status: string; 
}

export default function DoctorDashboard() {
  const { queues, loadingData } = useAdminQueues();
  const [doctorUid, setDoctorUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setDoctorUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const currentPatient = (queues?.find(
    (p: any) => p.status === "in-progress" || p.status === "serving"
  ) as unknown as DisplayQueue) || null;

  const queueList = (queues?.filter(
    (p: any) => p.status === "checked-in" || p.status === "waiting"
  ) || []) as unknown as DisplayQueue[];

  const loading = loadingData;

  const callNextPatient = async () => {
    if (!doctorUid) {
      alert("Sesi login Anda tidak valid. Silakan login kembali.");
      return;
    }
    try {
      await fetch("/api/admin/next", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: doctorUid })
      });
    } catch (error) {
      console.error("Gagal memanggil pasien berikutnya:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased selection:bg-blue-100">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
            <span className="font-semibold text-gray-800 tracking-tight">Apotek AN-Nur <span className="text-gray-400 font-normal">| Portal Dokter</span></span>
          </div>
          {/* Menu Aksi Sisi Kanan */}
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Pelayanan Aktif
              </span>
              {currentPatient && (
                <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${
                  currentPatient.type === "emergency" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
                }`}>
                  {currentPatient.type}
                </span>
              )}
            </div>

            {currentPatient ? (
              <div className="space-y-6">
                <div>
                  <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
                    Nomor Antrean: {currentPatient.queueNumber}
                  </h1>
                  <p className="text-xl font-medium text-gray-700">{currentPatient.name} ({currentPatient.age} Tahun)</p>
                  <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100 inline-block">
                    <span className="font-semibold text-gray-700">Keluhan:</span> {currentPatient.complaint || "Tidak ada keluhan tertulis"}
                  </p>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={callNextPatient}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-200 text-sm shadow-sm tracking-wide"
                  >
                    Panggil Antrean Berikutnya
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="text-gray-300 text-4xl">✦</div>
                <p className="text-gray-500 font-medium">Tidak ada pasien yang sedang dilayani saat ini.</p>
                <button 
                  onClick={callNextPatient}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 text-sm shadow-sm"
                >
                  Panggil Pasien Pertama
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Daftar Tunggu */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-[calc(100vh-12rem)]">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 text-lg">Daftar Tunggu Ruang Utama</h3>
            <p className="text-xs text-gray-400 mt-0.5">Urutan antrean pasien realtime</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {loading ? (
              <div className="text-center py-6 text-gray-400 text-sm animate-pulse">Sinkronisasi data...</div>
            ) : queueList.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">Ruang tunggu kosong.</div>
            ) : (
              queueList.map((patient: DisplayQueue) => (
                <div 
                  key={patient.key || patient.id} 
                  className={`p-4 border rounded-xl flex items-center justify-between transition-all duration-200 ${
                    patient.type === "emergency" 
                      ? "border-red-100 bg-red-50/30" 
                      : "border-gray-50 bg-gray-50/50 hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <span className={`font-bold text-sm tracking-tight ${patient.type === "emergency" ? "text-red-700" : "text-gray-800"}`}>
                      No. {patient.queueNumber}
                    </span>
                    <h4 className="text-sm font-medium text-gray-700 mt-0.5 truncate max-w-[140px]">{patient.name}</h4>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    patient.type === "emergency" ? "bg-red-100 text-red-700" : "bg-gray-200/60 text-gray-600"
                  }`}>
                    {patient.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}