"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../../lib/firebase"; // Sesuaikan path
import ProtectedRoute from "@/app/Components/protectedRoute";
import { Queue } from "../../../../lib/queueService"; // Sesuaikan path

// Tambahkan atribut finishedAt
interface HistoryQueue extends Queue {
  finishedAt: number;
  session: string;
}

export default function UserHistoryPage() {
  const [history, setHistory] = useState<HistoryQueue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Ambil data langsung dari cabang milik user ini saja (Sangat Cepat & Efisien)
      const historyRef = ref(db, `historyByUser/${user.uid}`);
      
      const unsubscribeDb = onValue(historyRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.values(data) as HistoryQueue[];
          
          // Urutkan dari yang terbaru (Descending)
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
    <ProtectedRoute>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Riwayat Kunjungan Saya</h1>
        <p style={{ color: "gray" }}>Daftar antrean Anda yang telah selesai dilayani.</p>

        {isLoading ? (
          <p>Memuat riwayat...</p>
        ) : history.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", border: "1px dashed #ccc" }}>
            Anda belum memiliki riwayat kunjungan.
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {history.map((h) => (
              <li key={h.finishedAt} style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "15px", 
                marginBottom: "15px",
                borderLeft: `5px solid ${h.type === "emergency" ? "red" : "#0070f3"}` 
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <strong>{new Date(h.finishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  <span style={{ color: "green", fontWeight: "bold" }}>Selesai ✓</span>
                </div>
                <h3 style={{ margin: "5px 0" }}>#{h.queueNumber} - {h.name}</h3>
                <p style={{ margin: "5px 0", color: "#555" }}><strong>Keluhan:</strong> {h.complaint}</p>
                <p style={{ margin: 0, fontSize: "14px", color: "gray" }}>
                  Pukul {new Date(h.finishedAt).toLocaleTimeString('id-ID')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}