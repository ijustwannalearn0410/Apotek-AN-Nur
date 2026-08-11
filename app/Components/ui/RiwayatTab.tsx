"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../lib/firebase"; 
import { Queue } from "../../../lib/queueService"; 

interface HistoryQueue extends Queue {
  finishedAt: number;
  session: string;
}

export default function RiwayatTab() {
  const [history, setHistory] = useState<HistoryQueue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const historyRef = ref(db, `historyByUser/${user.uid}`);
      
      const unsubscribeDb = onValue(historyRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.values(data) as HistoryQueue[];
          
          list.sort((a, b) => b.finishedAt - a.finishedAt);
          setHistory(list);
        } else {
          setHistory([]);
        }
        setIsLoading(false);
      });

      return () => unsubscribeDb();
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Riwayat Kunjungan</h2>
        <p className="text-gray-500 mt-1 text-sm">Daftar semua konsultasi yang telah Anda selesaikan.</p>
      </div>

      {/* Wrapper Tabel Utama */}
      <div className="w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col">
        
        {/* 1. HEADER TABEL (SELALU TAMPIL) */}
        <div className="grid grid-cols-4 bg-gray-50 text-gray-500 text-left text-sm font-semibold border-b border-gray-200 uppercase tracking-wider">
          <div className="py-4 px-6">Nama Pasien</div>
          <div className="py-4 px-6">Tipe Antrian</div>
          <div className="py-4 px-6">Waktu Selesai</div>
          <div className="py-4 px-6">Keluhan/Gejala</div>
        </div>

        {/* 2. BODY TABEL (Tampilan Dinamis) */}
        <div className="text-gray-800 text-base min-h-[300px] flex flex-col bg-white">
          
          {isLoading ? (
            // Status Loading
            <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p>Memuat riwayat...</p>
            </div>
          ) : history.length === 0 ? (
            // Status Kosong (Data tidak ada)
            <div className="flex-grow flex flex-col items-center justify-center text-gray-400 p-10 text-center">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="text-lg font-medium text-gray-500">Belum ada riwayat kunjungan.</p>
              <p className="text-sm mt-1">Riwayat antrian Anda yang telah selesai akan muncul di sini.</p>
            </div>
          ) : (
            // Status Ada Data (Render baris tabel)
            history.map((h, index) => {
              const dateObj = new Date(h.finishedAt);
              const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
              const formattedTime = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

              return (
                <div 
                  key={h.finishedAt} 
                  className={`grid grid-cols-4 items-center hover:bg-gray-50 transition-colors duration-150 ${index !== history.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="py-5 px-6 font-medium text-gray-900 truncate">
                    {h.name || "N/A"}
                  </div>
                  <div className="py-5 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      h.type === "emergency" 
                      ? "bg-red-100 text-red-700" 
                      : "bg-blue-100 text-blue-700"
                    }`}>
                      {h.type === "emergency" ? "Prioritas" : "Biasa"}
                    </span>
                  </div>
                  <div className="py-5 px-6 flex flex-col justify-center">
                    <span className="font-medium text-gray-900">{formattedDate}</span>
                    <span className="text-sm text-gray-500">{formattedTime}</span>
                  </div>
                  <div className="py-5 px-6 text-gray-600 truncate">
                    {h.complaint || "-"}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}