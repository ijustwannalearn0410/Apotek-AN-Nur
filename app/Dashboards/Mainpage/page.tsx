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
      <div className="min-h-screen bg-[#E5EAEF] font-serif flex flex-col">
        
        {/* TOP NAVBAR */}
        <nav className="bg-[#0B3B82] text-white flex justify-between items-stretch shadow-md">
          <div className="flex">
            <button 
              className={`px-8 py-4 text-xl font-semibold border-r border-white/30 transition-colors ${activeTab === "biasa" ? "bg-[#082b5e]" : "hover:bg-[#082b5e]"}`}
              onClick={() => setActiveTab("biasa")}
            >
              Antrian<br/>Biasa
            </button>
            <button 
              className={`px-8 py-4 text-xl font-semibold border-r border-white/30 transition-colors ${activeTab === "prioritas" ? "bg-[#082b5e]" : "hover:bg-[#082b5e]"}`}
              onClick={() => setActiveTab("prioritas")}
            >
              Antrian<br/>Prioritas
            </button>
            <button 
              className={`px-8 py-4 text-xl font-semibold border-r border-white/30 transition-colors flex items-center ${activeTab === "riwayat" ? "bg-[#082b5e]" : "hover:bg-[#082b5e]"}`}
              onClick={() => setActiveTab("riwayat")}
            >
              Riwayat
            </button>
            <button 
              className={`px-8 py-4 text-xl font-semibold border-r border-white/30 transition-colors flex items-center ${activeTab === "akun" ? "bg-[#082b5e]" : "hover:bg-[#082b5e]"}`}
              onClick={() => setActiveTab("akun")}
            >
              Data Akun
            </button>
          </div>
          
          <div className="flex items-center px-8 text-xl font-semibold uppercase hover:text-gray-300">
            <LogoutButton />
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        {/* Dashboard tidak peduli apa isi form/status, dia hanya merender Tab yang terpilih */}
        <main className="flex-grow flex justify-center items-start gap-10 p-12 mt-4 transition-all duration-300">
          {renderContent()}
        </main>

      </div>
    </ProtectedRoute>
  );
}