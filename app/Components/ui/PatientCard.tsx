
import { Queue } from "../../../lib/queueService"; // Sesuaikan path

interface CurrentPatientCardProps {
  patient: Queue | undefined | null;
}

export default function CurrentPatientCard({ patient }: CurrentPatientCardProps) {
 //patient null
  if (!patient) {
    return (
      <div style={{ border: "2px dashed #ccc", padding: "20px", borderRadius: "8px", margin: "20px 0", textAlign: "center" }}>
        <h2>Pasien Saat Ini:</h2>
        <p style={{ color: "gray" }}>Belum ada pasien yang dipanggil.</p>
      </div>
    );
  }

//patient data
  const isEmergency = patient.type === "emergency";
  const mainColor = isEmergency ? "white" : "#f4f6f8";

  return (
    <div style={{ border: `6px solid ${mainColor}`, padding: "20px", borderRadius: "8px", margin: "20px 0", backgroundColor: isEmergency ? "#01523a" : "#0578fc" }}>
      <h2>Pasien Saat Ini:</h2>
      <h1 style={{ fontSize: "40px", color: mainColor, margin: "10px 0" }}>
        #{patient.queueNumber} - {patient.name}
      </h1>
      <p><strong>Usia:</strong> {patient.age} Tahun</p>
      <p><strong>Keluhan:</strong> {patient.complaint}</p>
      <p><strong>Tipe:</strong> <span style={{ fontWeight: "bold", color: mainColor }}>{isEmergency ? "Prioritas" : "Biasa"}</span></p>
    </div>
  );
}