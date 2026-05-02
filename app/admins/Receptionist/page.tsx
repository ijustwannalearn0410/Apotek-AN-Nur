"use client"
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db, auth } from "../../../lib/firebase";
import AdminRoute from "../../Components/adminRoute";
import { getCurrentSession } from "../../../lib/session";
import LogoutButton from "../../Components/logoutButton";
import { Queue } from "../../../lib/queueService";
import QueueListItem from "../../Components/ui/QueueListItem";
import AdminPortalButton from "@/app/Components/ui/AdminPortal";

export default function FrontDeskPage() {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State baru untuk fitur pencarian
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let unsubscribe: any;
    getCurrentSession().then((sessionKey) => {
      if (!sessionKey) return;
      const queueRef = ref(db, `queues/${sessionKey}/active`);
      unsubscribe = onValue(queueRef, (snapshot) => {
        if (snapshot.exists()) {
          const list = Object.entries(snapshot.val()).map(([key, value]: any) => ({
            key, ...value,
          }));
          setQueues(list);
        } else {
          setQueues([]);
        }
      });
    });
    return () => { if (unsubscribe) unsubscribe() };
  }, []);

  const handleCheckIn = async (key: string) => {
    if (isProcessing) return; 
    setIsProcessing(true); 
    try {
      const res = await fetch('/api/admin/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key, uid: auth.currentUser?.uid }),
      });
      if (!res.ok) alert("Gagal check-in");
    } catch (error) {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setIsProcessing(false);
    }
  };

  // Logika Filter Pencarian (Mencari berdasarkan Nama atau Nomor)
  const filteredQueues = queues.filter((q) => {
    const matchName = q.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchNumber = q.queueNumber.toString().includes(searchQuery);
    return matchName || matchNumber;
  });

  return (
    <AdminRoute>
      <div style={{ padding: "20px" }}>
        <AdminPortalButton />
        <h1>Front Desk Dashboard</h1>

        <div style={{ marginBottom: "20px" }}>
          <input 
            type="text" 
            placeholder="Cari Nama atau Nomor Antrean..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "10px", width: "300px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>

        <h2>Daftar Antrean (Filter Aktif)</h2>
        <ul style={{ listStyle: "none", padding: 0, border: "1px solid #eee", borderRadius: "8px" }}>
          {filteredQueues
            .sort((a, b) => a.queueNumber - b.queueNumber)
            .map((q) => (
              <QueueListItem 
                key={q.key} 
                queue={q} 
                onCheckIn={handleCheckIn} 
                isProcessing={isProcessing} 
              />
          ))}
          {filteredQueues.length === 0 && (
            <p style={{ padding: "20px", textAlign: "center", color: "gray" }}>
              Tidak ada antrean yang cocok.
            </p>
          )}
          
        </ul>

        <LogoutButton />
      </div>
    </AdminRoute>
  );
}