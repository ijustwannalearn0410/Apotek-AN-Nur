"use client";

import { useEffect, useState, useMemo } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../../../lib/firebase";
import AdminRoute from "../../../Components/adminRoute";
import Link from "next/link";
import LogoutButton from "@/app/Components/logoutButton";
import { Queue } from "../../../../lib/queueService";

interface HistoryQueue extends Queue {
  finishedAt: number;
}

// Format tanggal dari "2026-08-14" ke "14 Agustus 2026"
function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

// Format timestamp ke waktu (HH:MM:SS)
function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AdminHistoryPage() {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryQueue[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // State untuk date picker custom
  const [pickerValue, setPickerValue] = useState<string>("");
  // State untuk filter waktu (jam) dalam satu hari
  const [timeFrom, setTimeFrom] = useState<string>("00:00");
  const [timeTo, setTimeTo] = useState<string>("23:59");
  // State untuk search nama pasien
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Ambil semua node tanggal yang tersedia dari Firebase
  useEffect(() => {
    const historyRootRef = ref(db, "history");
    const unsubscribe = onValue(historyRootRef, (snapshot) => {
      if (snapshot.exists()) {
        const dates = Object.keys(snapshot.val()).sort((a, b) => b.localeCompare(a)); // descending
        setAvailableDates(dates);
        if (!selectedDate && dates.length > 0) {
          const latest = dates[0];
          setSelectedDate(latest);
          setPickerValue(latest);
        }
      } else {
        setAvailableDates([]);
      }
      setIsLoadingDates(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ambil data riwayat berdasarkan tanggal yang dipilih
  useEffect(() => {
    if (!selectedDate) return;
    setIsLoadingHistory(true);

    const historyRef = ref(db, `history/${selectedDate}/finished`);
    const unsubscribe = onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const list = Object.values(snapshot.val()) as HistoryQueue[];
        list.sort((a, b) => b.finishedAt - a.finishedAt);
        setHistory(list);
      } else {
        setHistory([]);
      }
      setIsLoadingHistory(false);
    });
    return () => unsubscribe();
  }, [selectedDate]);

  // Handler saat chip tanggal ditekan
  function handleChipSelect(date: string) {
    setSelectedDate(date);
    setPickerValue(date);
    setTimeFrom("00:00");
    setTimeTo("23:59");
    setSearchQuery("");
  }

  // Handler saat date picker berubah
  function handlePickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value; // format "YYYY-MM-DD"
    setPickerValue(val);
    if (val) {
      setSelectedDate(val);
      setTimeFrom("00:00");
      setTimeTo("23:59");
      setSearchQuery("");
    }
  }

  // Apakah tanggal yang dipilih tersedia di Firebase
  const isDateAvailable = selectedDate ? availableDates.includes(selectedDate) : false;

  // Navigasi tanggal: Sebelumnya / Berikutnya
  function navigateDate(direction: "prev" | "next") {
    if (!selectedDate) return;
    const currentIndex = availableDates.indexOf(selectedDate);
    if (direction === "prev" && currentIndex < availableDates.length - 1) {
      handleChipSelect(availableDates[currentIndex + 1]);
    } else if (direction === "next" && currentIndex > 0) {
      handleChipSelect(availableDates[currentIndex - 1]);
    } else if (currentIndex === -1) {
      if (direction === "prev") {
        const older = availableDates.find((d) => d < selectedDate);
        if (older) handleChipSelect(older);
      } else {
        const newer = [...availableDates].reverse().find((d) => d > selectedDate);
        if (newer) handleChipSelect(newer);
      }
    }
  }

  const canGoPrev = selectedDate ? availableDates.some((d) => d < selectedDate) : false;
  const canGoNext = selectedDate ? availableDates.some((d) => d > selectedDate) : false;

  // Filter history berdasarkan range waktu & pencarian nama
  const filteredHistory = useMemo(() => {
    if (!history.length) return [];
    return history.filter((h) => {
      const itemDate = new Date(h.finishedAt);
      const itemHHMM = `${String(itemDate.getHours()).padStart(2, "0")}:${String(itemDate.getMinutes()).padStart(2, "0")}`;
      const inTimeRange = itemHHMM >= timeFrom && itemHHMM <= timeTo;
      const matchesSearch = searchQuery.trim() === "" ||
        (h.name && h.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return inTimeRange && matchesSearch;
    });
  }, [history, timeFrom, timeTo, searchQuery]);

  const totalNormal = filteredHistory.filter((h) => h.type === "normal").length;
  const totalEmergency = filteredHistory.filter((h) => h.type === "emergency").length;
  const isFiltered = timeFrom !== "00:00" || timeTo !== "23:59" || searchQuery.trim() !== "";

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">

        {/* Top Navbar */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                📋
              </div>
              <span className="font-semibold text-gray-800 tracking-tight">
                Apotek AN-Nur <span className="text-gray-400 font-normal">| Riwayat Perawatan</span>
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/admins"
                className="text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-xl transition-all duration-200"
              >
                ← Kembali ke Portal
              </Link>
              <LogoutButton />
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">

          {/* Header */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Laporan Riwayat Perawatan</h2>
            <p className="text-sm text-gray-400 mt-1">Pilih tanggal untuk melihat rekap pasien yang telah selesai dilayani.</p>
          </div>

          {/* Panel Pemilih Tanggal */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pilih Tanggal</p>

            {/* Date Picker Input + Navigasi */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Navigasi Prev */}
              <button
                onClick={() => navigateDate("prev")}
                disabled={!canGoPrev}
                title="Tanggal sebelumnya"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 text-base font-bold"
              >
                ‹
              </button>

              {/* Date Picker */}
              <div className="relative">
                <input
                  type="date"
                  value={pickerValue}
                  onChange={handlePickerChange}
                  className="pl-4 pr-10 py-2 rounded-xl border border-violet-300 text-sm font-semibold text-gray-700 bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer transition-all duration-150"
                  style={{ colorScheme: "light" }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none text-sm">📅</span>
              </div>

              {/* Navigasi Next */}
              <button
                onClick={() => navigateDate("next")}
                disabled={!canGoNext}
                title="Tanggal berikutnya"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 text-base font-bold"
              >
                ›
              </button>

              {/* Badge status ketersediaan data */}
              {selectedDate && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    isDateAvailable
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${isDateAvailable ? "bg-emerald-500" : "bg-amber-400"}`} />
                  {isDateAvailable ? "Data tersedia" : "Tidak ada data"}
                </span>
              )}

              {/* Tombol kembali ke terbaru */}
              {availableDates.length > 0 && selectedDate !== availableDates[0] && (
                <button
                  onClick={() => handleChipSelect(availableDates[0])}
                  className="ml-auto text-xs text-violet-600 font-semibold hover:underline"
                >
                  Kembali ke terbaru →
                </button>
              )}
            </div>

            {/* Chip Tanggal Tersedia */}
            {isLoadingDates ? (
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-9 w-32 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : availableDates.length === 0 ? (
              <p className="text-sm text-gray-400">Belum ada data riwayat tersedia.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => handleChipSelect(date)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      selectedDate === date
                        ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50"
                    }`}
                  >
                    {formatDateLabel(date)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Konten Data (hanya tampil jika tanggal sudah dipilih) */}
          {selectedDate && (
            <>
              {/* Panel Filter Waktu & Pencarian */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Filter berdasarkan Timestamp</p>
                <div className="flex flex-wrap gap-4 items-end">
                  {/* Filter range jam */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium">Dari Jam</label>
                    <input
                      type="time"
                      value={timeFrom}
                      onChange={(e) => setTimeFrom(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium">Sampai Jam</label>
                    <input
                      type="time"
                      value={timeTo}
                      onChange={(e) => setTimeTo(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all"
                    />
                  </div>
                  {/* Divider */}
                  <div className="h-8 w-px bg-gray-100 hidden sm:block" />
                  {/* Search nama */}
                  <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
                    <label className="text-xs text-gray-500 font-medium">Cari Nama Pasien</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ketik nama pasien..."
                        className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all"
                      />
                    </div>
                  </div>
                  {/* Reset filter */}
                  {isFiltered && (
                    <button
                      onClick={() => { setTimeFrom("00:00"); setTimeTo("23:59"); setSearchQuery(""); }}
                      className="text-xs text-red-500 font-semibold hover:underline self-end pb-2"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Kartu Rekap Statistik */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-violet-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                  <p className="text-4xl font-black text-violet-600 mb-1">
                    {isLoadingHistory ? "—" : filteredHistory.length}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">Total Dilayani</p>
                  {isFiltered && !isLoadingHistory && (
                    <p className="text-xs text-gray-400 mt-1">dari {history.length} total</p>
                  )}
                </div>
                <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                  <p className="text-4xl font-black text-red-500 mb-1">
                    {isLoadingHistory ? "—" : totalEmergency}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">Pasien Prioritas</p>
                </div>
                <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                  <p className="text-4xl font-black text-emerald-500 mb-1">
                    {isLoadingHistory ? "—" : totalNormal}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">Pasien Normal</p>
                </div>
              </div>

              {/* Tabel Data */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {/* Header Tabel */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">
                      Detail Pasien — {formatDateLabel(selectedDate)}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {isLoadingHistory
                        ? "Memuat..."
                        : isFiltered
                          ? `${filteredHistory.length} dari ${history.length} pasien (terfilter)`
                          : `${history.length} pasien tercatat`}
                    </p>
                  </div>
                </div>

                {isLoadingHistory ? (
                  <div className="p-12 text-center text-gray-400 text-sm animate-pulse">
                    Memuat data riwayat...
                  </div>
                ) : !isDateAvailable ? (
                  <div className="p-12 text-center">
                    <p className="text-amber-500 font-semibold text-sm mb-1">Tanggal Tidak Tersedia</p>
                    <p className="text-gray-400 text-xs">Tidak ada data yang tersimpan untuk tanggal ini di database.</p>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-400 text-sm">
                      {history.length > 0
                        ? "Tidak ada pasien yang cocok dengan filter yang diterapkan."
                        : "Tidak ada pasien yang tercatat pada tanggal ini."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-left text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-3 border-b border-gray-100">Waktu Selesai</th>
                          <th className="px-6 py-3 border-b border-gray-100">No</th>
                          <th className="px-6 py-3 border-b border-gray-100">Nama Pasien</th>
                          <th className="px-6 py-3 border-b border-gray-100">Umur</th>
                          <th className="px-6 py-3 border-b border-gray-100">Keluhan</th>
                          <th className="px-6 py-3 border-b border-gray-100">Tipe</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredHistory.map((h, index) => (
                          <tr
                            key={h.finishedAt + index}
                            className="hover:bg-gray-50/70 transition-colors duration-100"
                          >
                            <td className="px-6 py-4 text-gray-500 font-mono text-xs">{formatTime(h.finishedAt)}</td>
                            <td className="px-6 py-4">
                              <span className="font-black text-gray-800">#{h.queueNumber}</span>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-800">{h.name || "—"}</td>
                            <td className="px-6 py-4 text-gray-500">{h.age ? `${h.age} th` : "—"}</td>
                            <td className="px-6 py-4 text-gray-600 italic max-w-[200px] truncate">
                              {h.complaint || "—"}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  h.type === "emergency"
                                    ? "bg-red-50 text-red-600 border border-red-100"
                                    : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                }`}
                              >
                                {h.type === "emergency" ? "⚡ Prioritas" : "✓ Normal"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </AdminRoute>
  );
}