"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminQueues } from "@/hooks/useAdminQueues";
import LogoutButton from "@/app/Components/logoutButton"; // Integrasi komponen logout bawaan Anda
import { auth } from "@/lib/firebase"; 

interface QueueItem {
  id?: string;
  key?: string;
  uid: string; 
  name: string;
  queueNumber: number | string;
  type: string;
  status: string;
}

export default function UserQueueStatusPage() {
  const { queues, loadingData } = useAdminQueues();
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  // Mengambil UID pengguna aktif sesaat setelah halaman dimuat
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const allQueues = (queues || []) as unknown as QueueItem[];

  // Mencari tiket aktif milik pengguna ini saja
  const myQueue = allQueues.find((p) => p.uid === currentUserUid);

  // Menghitung jumlah antrean di depan pengguna secara riil
  const peopleAhead = myQueue && (myQueue.status === "checked-in" || myQueue.status === "waiting")
    ? allQueues.filter((p) => 
        (p.status === "checked-in" || p.status === "waiting") && 
        Number(p.queueNumber) < Number(myQueue.queueNumber)
      ).length
    : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
      case "serving":
        return { text: "Sedang Dilayani Dokter", color: "bg-amber-50 text-amber-700 border-amber-100 animate-pulse" };
      case "checked-in":
      case "waiting":
        return { text: "Dalam Antrean / Menunggu Giliran", color: "bg-blue-50 text-blue-700 border-blue-100" };
      case "done":
        return { text: "Selesai Diperiksa", color: "bg-emerald-50 text-emerald-700 border-emerald-100" };
      default:
        return { text: "Menunggu Verifikasi Loket", color: "bg-gray-50 text-gray-600 border-gray-100" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex flex-col justify-between">
      
      {/* Top Navbar - Ditambahkan LogoutButton di sebelah kanan */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">A</div>
            <span className="font-semibold text-gray-800 text-sm tracking-tight">Apotek AN-Nur</span>
          </div>
          {/* Aksi Keluar Akun Pasien */}
          <LogoutButton />
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-6 flex flex-col justify-center">
        
        {loadingData ? (
          <div className="text-center space-y-3 py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-gray-400 font-medium">Memuat data tiket Anda...</p>
          </div>
        ) : myQueue ? (
          // KONDISI 1: JIKA USER SEDANG MENGANTRE (Terblokir & Hanya Bisa Memantau)
          <div className="space-y-6">
            
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600"></div>
              
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Nomor Antrean Anda
              </span>
              
              <h1 className="text-7xl font-black text-gray-900 tracking-tight my-4">
                {myQueue.queueNumber}
              </h1>

              <div className="inline-block border rounded-full px-4 py-1 text-xs font-semibold max-w-full truncate shadow-sm mt-1 bg-white">
                {myQueue.name}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 flex flex-col items-center justify-center space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status Saat Ini:</span>
                <span className={`text-xs font-bold border px-3 py-1 rounded-full ${getStatusBadge(myQueue.status).color}`}>
                  {getStatusBadge(myQueue.status).text}
                </span>
              </div>
            </div>

            {/* Informasi Estimasi Jumlah Antrean Tersisa di Depan */}
            {(myQueue.status === "checked-in" || myQueue.status === "waiting") && (
              <div className="bg-gray-900 text-white rounded-2xl p-5 text-center shadow-sm space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Estimasi Tunggu</span>
                <p className="text-sm font-medium text-gray-200">
                  {peopleAhead === 0 ? (
                    <span className="text-emerald-400 font-bold">Anda adalah antrean berikutnya! Silakan bersiap.</span>
                  ) : (
                    <span>Ada <strong className="text-blue-400 text-base mx-1">{peopleAhead} orang</strong> lagi di depan Anda.</span>
                  )}
                </p>
              </div>
            )}

            <div className="text-center">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md uppercase">
                Jalur: {myQueue.type === "emergency" ? "⚡ priioritas / Cepat" : "👥 Reguler / Normal"}
              </span>
            </div>

          </div>
        ) : (
          // KONDISI 2: JIKA TIKET TIDAK ADA / DOKTER TELAH MENYELESAIKAN LAYANAN
          <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center space-y-4 shadow-sm">
            <div className="text-gray-300 text-4xl">🎟️</div>
            <div>
              <h3 className="font-bold text-gray-800 text-base">Tidak Ada Antrean Aktif</h3>
              <p className="text-xs text-gray-400 mt-1 px-4">Anda belum terdaftar dalam sistem antrean hari ini, atau sesi tiket Anda sudah selesai dilayani dokter.</p>
            </div>
            <Link 
              href="/Dashboards/Mainpage" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-5 py-2.5 rounded-xl transition-colors duration-200"
            >
              Ambil Nomor Antrean Baru
            </Link>
          </div>
        )}

      </main>

      <footer className="max-w-md w-full mx-auto px-6 py-6 text-center text-[10px] text-gray-400">
        © 2026 Apotek AN-Nur. Semua data antrean disinkronkan secara privat.
      </footer>
    </div>
  );
}