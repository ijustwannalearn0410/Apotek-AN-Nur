"use client";

import { useRouter } from "next/navigation";
import AdminRoute from "../Components/adminRoute"; // Sesuaikan path
import LogoutButton from "../Components/logoutButton"; // Sesuaikan path

export default function AdminPortalPage() {
  const router = useRouter();

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        
        {/* Top Navbar */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <h1 className="text-2xl font-extrabold tracking-tight text-blue-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600">
                Apotek AN-NUR Admin
              </h1>
              <div className="text-gray-600 hover:text-red-600 transition-colors bg-gray-100 hover:bg-red-50 rounded-xl px-4 py-2 font-medium cursor-pointer">
                <LogoutButton />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow flex justify-center items-center p-6 lg:p-10">
          <div className="w-full max-w-5xl">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Portal Manajemen Antrean</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Selamat datang, Admin! Silakan pilih panel akses Anda untuk mengelola layanan hari ini.
              </p>
            </div>

            {/* Container untuk pilihan peran */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
              
              {/* Kartu Pilihan 1: Resepsionis */}
              <div 
                onClick={() => router.push("/admins/Receptionist")}
                className="group cursor-pointer bg-white rounded-3xl p-10 shadow-xl shadow-green-100/50 border border-green-100 hover:border-green-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-200 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 to-emerald-400"></div>
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-5xl">
                  👩‍💻
                </div>
                <h3 className="text-green-600 font-bold text-2xl mb-4">Meja Resepsionis</h3>
                <p className="text-gray-500 leading-relaxed">
                  Pantau pendaftaran, cari pasien, dan lakukan proses <strong className="text-gray-700">Check-In</strong> kehadiran.
                </p>
              </div>

              {/* Kartu Pilihan 2: Dokter */}
              <div 
                onClick={() => router.push("/admins/doctor")}
                className="group cursor-pointer bg-white rounded-3xl p-10 shadow-xl shadow-blue-100/50 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-200 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-5xl">
                  🩺
                </div>
                <h3 className="text-blue-600 font-bold text-2xl mb-4">Ruang Dokter</h3>
                <p className="text-gray-500 leading-relaxed">
                  Lihat riwayat keluhan medis pasien dan panggil nomor antrean selanjutnya (<strong className="text-gray-700">Call Next</strong>).
                </p>
              </div>

            </div>

          </div>
        </main>
        
      </div>
    </AdminRoute>
  );
}