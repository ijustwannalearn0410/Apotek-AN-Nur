"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db, auth } from "../../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import LogoutButton from "../../../Components/logoutButton";
import { getSessionForJoin } from "../../../../lib/session";
import ProtectedRoute from "@/app/Components/protectedRoute";
import { Queue } from "../../../../lib/queueService";


export default function QueueStatusPage() {
  const [myQueue, setMyQueue] = useState<Queue | null>(null);
  const [currentQueue, setCurrentQueue] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    
    let unsubscribeDB: any;
    

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const sessionKey = await getSessionForJoin();
      if (!sessionKey) {
        setIsLoading(false);
        return;
      }
      const queueRef = ref(db, `queues/${sessionKey}/active`);
      unsubscribeDB = onValue(queueRef, (snapshot) => {
        if (!snapshot.exists()) {
          setMyQueue(null);
          setCurrentQueue(null);
          setIsLoading(false);
          return;
        }

        const data = snapshot.val();
        const queueList = Object.values(data) as Queue[];

       
       const mine = queueList.find((q) => q.uid === user.uid);
        setMyQueue(mine || null); //?

        const current = queueList.find((q) => q.status === "in-progress");
        setCurrentQueue(current ? current.queueNumber : null); //?

        setIsLoading(false);
      });
    });

  
    return () => {
      
      unsubscribeAuth();
      if (unsubscribeDB) unsubscribeDB();
    };
  }, []);
  //loading page
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div style={{ padding: 20, textAlign: "center" }}>
          <p>Memuat status antrean...</p>
        </div>
      </ProtectedRoute>
    );
  }
//noqueue page
  if (!myQueue) {
    return (
      <ProtectedRoute>
        <div style={{ padding: 20, textAlign: "center" }}>
          <h2>Kamu belum mengambil antrean, atau antreanmu sudah selesai.</h2>
          <button 
            onClick={() => router.push("/Dashboards/Mainpage")}
            style={{ padding: "10px 20px", marginTop: "10px", cursor: "pointer" }}
          >
            Kembali ke Halaman Utama
          </button>
        </div>
      </ProtectedRoute>
    );
  }
//SUCCESS STATUS PAGE
  return (
    <ProtectedRoute>
      <div style={{ padding: 20, maxWidth: "500px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center" }}>Status Antrean</h1>

        <div style={{ 
          border: "1px solid #ccc", 
          padding: "20px", 
          borderRadius: "8px", 
          backgroundColor: "#160c0c",
          marginBottom: "20px"
        }}>
          <h2 style={{ fontSize: "32px", textAlign: "center", margin: "10px 0" }}>
            Nomor: {myQueue.queueNumber}
          </h2>
          <p style={{ textAlign: "center", fontWeight: "bold", color: myQueue.type === "emergency" ? "red" : "white" }}>
            {myQueue.type === "emergency" ? " Antrean Prioritas" : "Antrean Biasa"}
          </p>

          <hr style={{ margin: "15px 0" }}/>

          {/* MENAMPILKAN DATA PASIEN BARU */}
          <p><strong>Nama Pasien:</strong> {myQueue.name}</p>
          <p><strong>Usia:</strong> {myQueue.age} Tahun</p>
          <p><strong>Keluhan:</strong> {myQueue.complaint}</p>
          <p><strong>Status:</strong> <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>{myQueue.status}</span></p>
        </div>

        <div style={{ 
          border: "2px dashed #0070f3", 
          padding: "15px", 
          borderRadius: "8px", 
          textAlign: "center",
          marginBottom: "20px"
        }}>
          <h3>Sedang Dipanggil:</h3>
          <h1 style={{ color: "#0070f3", fontSize: "40px", margin: "0" }}>
            {currentQueue ?? "-"}
          </h1>
        </div>

        <LogoutButton />
      </div>
    </ProtectedRoute>
  );
}