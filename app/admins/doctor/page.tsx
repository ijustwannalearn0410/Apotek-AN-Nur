"use client"
import { useState } from "react";
import { auth } from "../../../lib/firebase";
import AdminRoute from "../../Components/adminRoute"; 
import LogoutButton from "../../Components/logoutButton";
import { useAdminQueues } from "../../../hooks/useAdminQueues"
import CurrentPatientCard from "../../Components/ui/PatientCard"; 
import Button from "../../Components/ui/Button"; 
import AdminPortalButton from "@/app/Components/ui/AdminPortal";
export default function DoctorPage() {

  const { queues, loadingData } = useAdminQueues();

  const [isProcessing, setIsProcessing] = useState(false);

  const current = queues.find((q) => q.status === "in-progress");

  const handleNext = async () => {
    if (isProcessing) return; 
    setIsProcessing(true); 
    try {
      const res = await fetch('/api/admin/next', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: auth.currentUser?.uid })
      });
      if (!res.ok) alert("Gagal memanggil antrean");
    } catch (error) {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AdminRoute>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <AdminPortalButton />

        <h1>Ruangan Dokter</h1>

        {loadingData ? (
          <p style={{ textAlign: "center" }}>Memuat data pasien...</p>
        ) : (
          <CurrentPatientCard patient={current} />
        )}

       <Button 
          onClick={handleNext} 
          isLoading={isProcessing || loadingData}
          loadingText="Memanggil..."
        >
          Panggil Pasien Selanjutnya
        </Button>
        <br/><br/>
        <LogoutButton />
      </div>
    </AdminRoute>
  );
}