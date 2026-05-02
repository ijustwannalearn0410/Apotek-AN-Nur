"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase"; // Sesuaikan path
import { useQueue } from "@/hooks/useQueue"; // Sesuaikan path

export default function PriorityQueueTab() {
  const [userId, setUserId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [complaint, setComplaint] = useState("");
  const [priorityReason, setPriorityReason] = useState(""); // Tambahan
  
  const { handleJoin, loading } = useQueue();

  const [currentServing, setCurrentServing] = useState(5);
  const [lastCheckIn, setLastCheckIn] = useState(6);
  const [lastNotCheckIn, setLastNotCheckIn] = useState(8);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataPasien = { patientName, patientAge, complaint, priorityReason };
    handleJoin("emergency", userId, dataPasien);
  };

  return (
    <>
      <div className="bg-[#0B3B82] rounded-[2rem] w-[600px] py-12 px-10 shadow-xl flex flex-col items-center min-h-[500px]">
        <h2 className="text-white text-3xl font-bold mb-10 tracking-widest uppercase">
          DATA PASIEN PRIORITAS
        </h2>
        
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-8 items-center">
          <input
            type="text" placeholder="Nama" required disabled={loading}
            value={patientName} onChange={(e) => setPatientName(e.target.value)}
            className="w-full bg-[#E5E7EB] text-center text-gray-800 text-lg rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number" placeholder="Umur" required disabled={loading}
            value={patientAge} onChange={(e) => setPatientAge(e.target.value)}
            className="w-full bg-[#E5E7EB] text-center text-gray-800 text-lg rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text" placeholder="Gejala/keluhan" required disabled={loading}
            value={complaint} onChange={(e) => setComplaint(e.target.value)}
            className="w-full bg-[#E5E7EB] text-center text-gray-800 text-lg rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text" placeholder="Alasan Prioritas" required disabled={loading}
            value={priorityReason} onChange={(e) => setPriorityReason(e.target.value)}
            className="w-full bg-[#E5E7EB] text-center text-gray-800 text-lg rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit" disabled={loading}
            className="mt-6 bg-[#E5E7EB] text-black text-2xl font-bold rounded-full py-4 px-12 hover:bg-gray-300 transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Ambil Nomor Antrian"}
          </button>
        </form>
      </div>

      <div className="w-[300px] flex flex-col shadow-xl rounded-[2rem] overflow-hidden bg-[#0B3B82]">
        <div className="bg-[#0B3B82] text-white text-center py-8 px-4 border-b border-white/20">
          <p className="text-xl mb-1">sedang dilayani (Prioritas):</p>
          <p className="text-2xl font-bold">No: E-{currentServing}</p>
        </div>
        <div className="bg-[#0B3B82] text-white text-center py-8 px-4 border-b border-white/20">
          <p className="text-xl mb-1">Terakhir Check in:</p>
          <p className="text-2xl font-bold">No: E-{lastCheckIn}</p>
        </div>
        <div className="bg-[#0B3B82] text-white text-center py-8 px-4">
          <p className="text-xl mb-1">Terakhir Belum<br/>Check in:</p>
          <p className="text-2xl font-bold">No: E-{lastNotCheckIn}</p>
        </div>
      </div>
    </>
  );
}