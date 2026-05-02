"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "../Authentication/authControllers";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      alert("Berhasil logout");
      router.push("/Login");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        marginTop: 20,
        backgroundColor: "red",
        color: "white",
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}