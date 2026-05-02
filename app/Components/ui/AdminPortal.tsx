"use client";

import { useRouter } from "next/navigation";

export default function AdminPortalButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/admins")} // Sesuaikan ini dengan path URL halaman portal Anda
      style={{
        padding: "8px 15px",
        backgroundColor: "#f1f1f1",
        color: "#333",
        border: "1px solid #ccc",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "20px",
        transition: "background-color 0.2s"
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e2e2e2"}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f1f1f1"}
    >
      <span>🔙</span> Kembali ke Portal Admin
    </button>
  );
}