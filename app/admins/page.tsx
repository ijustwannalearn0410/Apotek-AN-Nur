"use client";

import { useRouter } from "next/navigation";
import AdminRoute from "../Components/adminRoute"; // Sesuaikan path
import LogoutButton from "../Components/logoutButton"; // Sesuaikan path

export default function AdminPortalPage() {
  const router = useRouter();

  return (
    <AdminRoute>
      <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>Portal Manajemen Antrean</h1>
        <p style={{ color: "gray", marginBottom: "40px" }}>
          Selamat datang, Admin! Silakan pilih panel akses Anda hari ini:
        </p>

        {/* Container untuk pilihan peran */}
        <div style={{ 
          display: "flex", 
          flexDirection: "row", // Menjadi menyamping
          gap: "20px", 
          justifyContent: "center",
          flexWrap: "wrap" // Agar aman di layar HP
        }}>
          
          {/* Kartu Pilihan 1: Resepsionis */}
          <div 
            onClick={() => router.push("/admins/Receptionist")} // Sesuaikan dengan nama folder Anda
            style={{ 
              flex: "1 1 300px",
              cursor: "pointer", 
              border: "2px solid #28a745", // Warna Hijau
              padding: "40px 20px", 
              borderRadius: "12px", 
              transition: "transform 0.2s",
              backgroundColor: "#f2fdf5"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <h2 style={{ color: "#28a745", fontSize: "28px", margin: "0 0 10px 0" }}>👩‍💻 Meja Resepsionis</h2>
            <p style={{ color: "#555", margin: 0 }}>
              Pantau pendaftaran, cari pasien, dan lakukan proses <strong>Check-In</strong> kehadiran.
            </p>
          </div>

          {/* Kartu Pilihan 2: Dokter */}
          <div 
            onClick={() => router.push("/admins/doctor")} // Sesuaikan dengan nama folder Anda
            style={{ 
              flex: "1 1 300px",
              cursor: "pointer", 
              border: "2px solid #0070f3", // Warna Biru
              padding: "40px 20px", 
              borderRadius: "12px", 
              transition: "transform 0.2s",
              backgroundColor: "#f0f7ff"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <h2 style={{ color: "#0070f3", fontSize: "28px", margin: "0 0 10px 0" }}>🩺 Ruang Dokter</h2>
            <p style={{ color: "#555", margin: 0 }}>
              Lihat riwayat keluhan medis pasien dan panggil nomor antrean selanjutnya (<strong>Call Next</strong>).
            </p>
          </div>

        </div>

        {/* Tombol Logout di bawah */}
        <div style={{ marginTop: "50px" }}>
          <LogoutButton />
        </div>
        
      </div>
    </AdminRoute>
  );
}