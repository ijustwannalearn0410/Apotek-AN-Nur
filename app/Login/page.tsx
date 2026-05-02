"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "../Authentication/authControllers";
import { ref, get } from "firebase/database";
import { db } from "../../lib/firebase";
import { getSessionForJoin } from "../../lib/session"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const result = await loginUser(email, password);
      const sessionKey = await getSessionForJoin();
      const snapshot = await get(ref(db, `queues/${sessionKey}/active`));
      
      let hasQueue = false;

      if (snapshot.exists()) {
        const queues = Object.values(snapshot.val());
        hasQueue = queues.some(
          (q: any) =>
            q.uid === result.user.uid &&
            (
              q.status === "registered" ||
              q.status === "checked-in" ||
              q.status === "in-progress"
            )
        );
      }

      if (result.role === "admin") {
        router.push("/admins");
      } else if (hasQueue) {
        router.push("/Dashboards/queue/status");
      } else if (result.role === "user") {
        router.push("/Dashboards/Mainpage");
      } else {
        router.push("/Register"); 
      } 
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    // Wrapper utama: flexbox kolom seukuran layar penuh, font serif menyesuaikan desain
    <div className="min-h-screen flex flex-col font-serif">
      
      {/* Top Navbar */}
      <nav className="bg-[#153465] text-white px-8 py-4 flex justify-between items-center shadow-md z-10">
        <h1 className="text-2xl font-semibold">Apotek AN-NUR</h1>
        <div className="text-lg">
          <a href="/Register" className="hover:underline">Register</a> | <a href="/" className="hover:underline">Dashboard</a>
        </div>
      </nav>

      {/* Main Content Area (Latar Belakang Gambar) */}
      <main className="flex-grow relative flex justify-center items-center">
        
        {/* Background Image - Pastikan gambar ada di folder /public */}
        {/* Ganti '/bg-medical.jpg' dengan nama file gambarmu */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/images/public.jpg')" }}
        >
          {}
          <div className="absolute inset-0 bg-white/20"></div>
        </div>

        {/* Login Card Box */}
        <div className="relative z-10 bg-[#0A1138] rounded-[2rem] p-10 w-full max-w-[500px] shadow-2xl flex flex-col items-center">
          <h2 className="text-white text-2xl mb-12">Harap Login Terlebih Dulu</h2>
          
          <form onSubmit={handleLogin} className="w-full flex flex-col items-center space-y-6">
            
            {/* Input Email */}
            <input 
              type="email" 
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="w-3/4 bg-[#D9D9D9] text-black text-center placeholder-gray-500 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Input Password */}
            <input 
              type="password" 
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-3/4 bg-[#D9D9D9] text-black text-center placeholder-gray-500 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Tombol Login */}
            <button 
              type="submit" 
              className="mt-8 bg-[#D9D9D9] text-black text-xl font-bold rounded-full py-2 px-12 hover:bg-gray-400 transition-colors duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#153465] text-white px-8 py-5 z-10">
        <p className="text-lg">Informasi lebih lanjut hubungi: 081244615566</p>
      </footer>

    </div>
  );
}