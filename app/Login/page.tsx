"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "../Authentication/authControllers";
import { ref, get } from "firebase/database";
import { db } from "../../lib/firebase";
import { getSessionForJoin } from "../../lib/session"; 
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans selection:bg-blue-200">
      
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-100">
        <h1 className="text-2xl font-extrabold tracking-tight text-blue-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600">
          Apotek AN-NUR
        </h1>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <div className="h-4 w-px bg-gray-300"></div>
          <Link href="/Register" className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            Register
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow relative flex justify-center items-center mt-[72px] min-h-[calc(100vh-72px)]">
        
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-[url('/images/public.jpg')] bg-cover bg-center"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 via-blue-900/80 to-gray-50/90 backdrop-blur-sm"></div>

        {/* Login Card */}
        <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl p-10 md:p-12 w-full max-w-md shadow-2xl border border-white/50 m-4 transform transition-all">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat Datang</h2>
            <p className="text-gray-500">Silakan login ke akun Anda</p>
          </div>
          
          <form onSubmit={handleLogin} className="w-full flex flex-col space-y-6">
            
            {/* Input Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                placeholder="Masukkan email Anda"
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="Masukkan password Anda"
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Tombol Login */}
            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 w-full bg-blue-600 text-white font-bold rounded-xl py-3.5 hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:hover:shadow-none"
            >
              {loading ? "Memproses..." : "Login"}
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-6">
              Belum punya akun? <Link href="/Register" className="text-blue-600 font-semibold hover:underline">Daftar sekarang</Link>
            </p>
          </form>
        </div>
      </main>

    </div>
  );
}