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
    <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full font-sans">
      <div className="bg-white rounded-3xl w-full max-w-xl p-8 lg:p-10 shadow-xl shadow-gray-200/50 border border-red-100 flex flex-col relative overflow-hidden">
        {/* Subtle priority accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-400"></div>

        <div className="mb-8 text-center">
          <h2 className="text-gray-900 text-2xl font-extrabold tracking-tight uppercase">
            Data Pasien Prioritas
          </h2>
          <p className="text-gray-500 text-sm mt-2">Lengkapi data untuk mengambil nomor antrian darurat/prioritas</p>
        </div>

        <form onSubmit={onSubmit} className="w-full flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
            <input
              type="text" placeholder="Masukkan nama pasien" required disabled={loading}
              value={patientName} onChange={(e) => setPatientName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Umur</label>
              <input
                type="number" placeholder="Tahun" required disabled={loading}
                value={patientAge} onChange={(e) => setPatientAge(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              />
            </div>
            <div className="w-2/3">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Alasan Prioritas</label>
              <input
                type="text" placeholder="Misal: Lansia, dll" required disabled={loading}
                value={priorityReason} onChange={(e) => setPriorityReason(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gejala/Keluhan</label>
            <input
              type="text" placeholder="Jelaskan keluhan singkat" required disabled={loading}
              value={complaint} onChange={(e) => setComplaint(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-red-600 to-red-500 text-white text-lg font-bold rounded-xl py-4 hover:from-red-700 hover:to-red-600 transition-all shadow-lg shadow-red-200 disabled:opacity-70 disabled:shadow-none"
          >
            {loading ? "Memproses..." : "Ambil Nomor Antrian Prioritas"}
          </button>
        </form>
      </div>


    </div>
  );
}