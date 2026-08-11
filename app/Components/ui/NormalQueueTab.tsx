"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase"; // Sesuaikan path
import { useQueue } from "@/hooks/useQueue"; // Sesuaikan path

export default function NormalQueueTab() {
  const [userId, setUserId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [complaint, setComplaint] = useState("");

  const { handleJoin, loading } = useQueue();

  // State Status Antrian (Hanya relevan di halaman antrian)
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
    const dataPasien = { patientName, patientAge, complaint };
    handleJoin("normal", userId, dataPasien);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 justify-center items-start w-full font-sans">
      {/* KOLOM KIRI: Form Antrian Biasa */}
      <div className="bg-white rounded-3xl w-full max-w-xl p-8 lg:p-10 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col">
        <div className="mb-8 text-center">
          <h2 className="text-gray-900 text-2xl font-extrabold tracking-tight uppercase">
            Data Pasien Umum
          </h2>
          <p className="text-gray-500 text-sm mt-2">Lengkapi data untuk mengambil nomor antrian biasa</p>
        </div>

        <form onSubmit={onSubmit} className="w-full flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
            <input
              type="text" placeholder="Masukkan nama pasien" required disabled={loading}
              value={patientName} onChange={(e) => setPatientName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Umur (Tahun)</label>
            <input
              type="number" placeholder="Masukkan umur" required disabled={loading}
              value={patientAge} onChange={(e) => setPatientAge(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gejala/Keluhan</label>
            <input
              type="text" placeholder="Jelaskan keluhan singkat" required disabled={loading}
              value={complaint} onChange={(e) => setComplaint(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="mt-6 w-full bg-blue-600 text-white text-lg font-bold rounded-xl py-4 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:shadow-none"
          >
            {loading ? "Memproses..." : "Ambil Nomor Antrian"}
          </button>
        </form>
      </div>


      {/* <div className="w-full max-w-sm flex flex-col shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white border border-gray-100 sticky top-28">
        <div className="bg-blue-600 text-white text-center py-6 px-6 shadow-sm">
          <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wider">Sedang Dilayani</p>
          <p className="text-5xl font-extrabold drop-shadow-md">{currentServing}</p>
        </div>
        <div className="text-center py-6 px-6 border-b border-gray-100 bg-gray-50/50">
          <p className="text-gray-500 text-sm font-medium mb-1">Terakhir Check-in</p>
          <p className="text-2xl font-bold text-gray-800">No. {lastCheckIn}</p>
        </div>
        <div className="text-center py-6 px-6 bg-gray-50/50">
          <p className="text-gray-500 text-sm font-medium mb-1">Terakhir Belum Check-in</p>
          <p className="text-2xl font-bold text-gray-800">No. {lastNotCheckIn}</p>
        </div>
      </div> */}
    </div>
  );
}