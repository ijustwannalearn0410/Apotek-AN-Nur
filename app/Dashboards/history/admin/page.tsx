"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../../../lib/firebase"; // Sesuaikan path
import AdminRoute from "../../../Components/adminRoute"; // Sesuaikan path
import AdminPortalButton from "@/app/Components/ui/AdminPortal";
import { getCurrentSession } from "../../../../lib/session"; // Sesuaikan path
import { Queue } from "../../../../lib/queueService";

interface HistoryQueue extends Queue {
  finishedAt: number;
}

export default function AdminHistoryPage() {
  const [history, setHistory] = useState<HistoryQueue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDb: any;

    getCurrentSession().then((sessionKey) => {
      if (!sessionKey) return;

      // Mengambil data spesifik dari sesi (hari) ini
      const historyRef = ref(db, `history/${sessionKey}/finished`);
      
      unsubscribeDb = onValue(historyRef, (snapshot) => {
        if (snapshot.exists()) {
          const list = Object.values(snapshot.val()) as HistoryQueue[];
          
          // Urutkan dari yang terbaru (Descending)
          list.sort((a, b) => b.finishedAt - a.finishedAt);
          setHistory(list);
        } else {
          setHistory([]);
        }
        setIsLoading(false);
      });
    });

    return () => { if (unsubscribeDb) unsubscribeDb() };
  }, []);

  // Fitur Tambahan untuk Skripsi: Rekap Harian Otomatis
  const totalNormal = history.filter(h => h.type === "normal").length;
  const totalEmergency = history.filter(h => h.type === "emergency").length;

  return (
    <AdminRoute>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <AdminPortalButton />
        <h1>Laporan Antrean Selesai</h1>
        <p style={{ color: "gray" }}>Sesi Hari Ini</p>

        {/* Kotak Rekap (Nilai Jual untuk Skripsi) */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          <div style={{ flex: 1, padding: "20px", backgroundColor: "#f0f7ff", borderRadius: "8px", textAlign: "center" }}>
            <h2>{history.length}</h2>
            <p>Total Dilayani</p>
          </div>
          <div style={{ flex: 1, padding: "20px", backgroundColor: "#fff5f5", borderRadius: "8px", textAlign: "center" }}>
            <h2 style={{ color: "red" }}>{totalEmergency}</h2>
            <p>Pasien Darurat</p>
          </div>
          <div style={{ flex: 1, padding: "20px", backgroundColor: "#f2fdf5", borderRadius: "8px", textAlign: "center" }}>
            <h2 style={{ color: "green" }}>{totalNormal}</h2>
            <p>Pasien Normal</p>
          </div>
        </div>

        {isLoading ? (
          <p>Memuat data...</p>
        ) : history.length === 0 ? (
          <p>Belum ada pasien yang selesai dilayani hari ini.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f1f1", textAlign: "left" }}>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Waktu</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>No</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Nama Pasien</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Keluhan</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Tipe</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.finishedAt} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>{new Date(h.finishedAt).toLocaleTimeString('id-ID')}</td>
                  <td style={{ padding: "10px" }}><strong>#{h.queueNumber}</strong></td>
                  <td style={{ padding: "10px" }}>{h.name}</td>
                  <td style={{ padding: "10px" }}>{h.complaint}</td>
                  <td style={{ padding: "10px", color: h.type === "emergency" ? "red" : "black", fontWeight: "bold" }}>
                    {h.type === "emergency" ? "Darurat" : "Normal"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminRoute>
  );
}