"use client";

import { useState } from "react";
import ProtectedRoute from "@/app/Components/protectedRoute";
import LogoutButton from "../../Components/logoutButton";

// Import semua komponen Tab
import NormalQueueTab from "../../Components/ui/NormalQueueTab";
import PriorityQueueTab from "../../Components/ui/PriorityQueueTab";
import RiwayatTab from "../../Components/ui/RiwayatTab";
//import DataAkunTab from "@/app/Components/DataAkunTab";//

export default function UnifiedDashboard() {
  // State murni hanya untuk mengatur Tab mana yang terbuka
  const [activeTab, setActiveTab] = useState<"biasa" | "prioritas" | "riwayat" | "akun">("biasa");

  // Fungsi untuk me-render komponen secara utuh
  const renderContent = () => {
    switch (activeTab) {
      case "biasa":
        return <NormalQueueTab />;
      case "prioritas":
        return <PriorityQueueTab />;
      case "riwayat":
        return <RiwayatTab />;
      case "akun":
      // return <DataAkunTab />;
      default:
        return <NormalQueueTab />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col text-gray-800">

        {/* TOP NAVBAR */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between h-20">

              {/* Navigation Tabs */}
              <div className="flex space-x-2 sm:space-x-8">
                <button
                  className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm md:text-base font-semibold transition-colors duration-200 ${activeTab === "biasa"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  onClick={() => setActiveTab("biasa")}
                >
                  Antrian Biasa
                </button>
                <button
                  className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm md:text-base font-semibold transition-colors duration-200 ${activeTab === "prioritas"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  onClick={() => setActiveTab("prioritas")}
                >
                  Antrian Prioritas
                </button>
                <button
                  className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm md:text-base font-semibold transition-colors duration-200 ${activeTab === "riwayat"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  onClick={() => setActiveTab("riwayat")}
                >
                  Riwayat
                </button>

              </div>

              {/* Logout Button */}
              <div className="flex items-center">
                <div className="text-gray-600 hover:text-red-600 transition-colors bg-gray-100 hover:bg-red-50 rounded-xl px-4 py-2 font-medium cursor-pointer">
                  <LogoutButton />
                </div>
              </div>

            </div>
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="flex-grow flex justify-center items-start w-full max-w-7xl mx-auto p-6 lg:p-10 transition-all duration-300">
          <div className="w-full">
            {renderContent()}
          </div>
        </main>

      </div>
    </ProtectedRoute>
  );
}