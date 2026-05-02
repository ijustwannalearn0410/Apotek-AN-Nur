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
    <div className="w-full max-w-5xl animate-fade-in font-serif">
      
      {/* Wrapper Tabel Utama */}
      <div className="w-full border border-white/30 shadow-2xl flex flex-col">
        
        {/* 1. HEADER TABEL (SELALU TAMPIL) */}
        <div className="grid grid-cols-4 bg-[#4B4B4B] text-white text-center text-xl font-bold">
          <div className="py-4 border-r border-white/30">Nama Pasien</div>
          <div className="py-4 border-r border-white/30">Tipe Antrian</div>
          <div className="py-4 border-r border-white/30">Waktu Selesai</div>
          <div className="py-4">Keluhan/Gejala</div>
        </div>

        {/* 2. BODY TABEL (Tampilan Dinamis) */}
        <div className="bg-[#8C8C8C] text-white text-center text-lg min-h-[250px] flex flex-col">
          
          {isLoading ? (
            // Status Loading
            <div className="flex-grow flex items-center justify-center text-xl">
              Memuat riwayat...
            </div>
          ) : history.length === 0 ? (
            // Status Kosong (Data tidak ada)
            <div className="flex-grow flex flex-col items-center justify-center text-xl opacity-80">
              <p>Belum ada riwayat kunjungan.</p>
            </div>
          ) : (
            // Status Ada Data (Render baris tabel)
            history.map((h, index) => {
              const dateObj = new Date(h.finishedAt);
              const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
              const formattedTime = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

              return (
                <div 
                  key={h.finishedAt} 
                  className={`grid grid-cols-4 items-center ${index !== 0 ? 'border-t border-white/30' : ''}`}
                >
                  <div className="py-6 px-2 border-r border-white/30 truncate">
                    {h.name || "N/A"}
                  </div>
                  <div className="py-6 px-2 border-r border-white/30">
                    {h.type === "emergency" ? "Prioritas" : "Biasa"}
                  </div>
                  <div className="py-4 px-2 border-r border-white/30 flex flex-col justify-center">
                    <span>{formattedDate}</span>
                    <span>{formattedTime}</span>
                  </div>
                  <div className="py-6 px-4 truncate">
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