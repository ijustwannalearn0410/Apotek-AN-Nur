"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          phone: phone,
          fullname: fullName
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan profil data");

      alert("Registrasi berhasil!");
      router.push("/Dashboards/Mainpage");
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
          <Link href="/Login" className="px-5 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 hover:-translate-y-0.5 transition-all duration-200">
            Login
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow relative flex justify-center items-center mt-[72px] min-h-[calc(100vh-72px)] py-10">
        
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-[url('/images/public.jpg')] bg-cover bg-center fixed"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 via-blue-900/80 to-gray-50/90 backdrop-blur-sm fixed"></div>

        {/* Register Card */}
        <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl p-10 md:p-12 w-full max-w-lg shadow-2xl border border-white/50 m-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Buat Akun</h2>
            <p className="text-gray-500">Lengkapi data diri Anda untuk mendaftar</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col space-y-5">
            
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  placeholder="Masukkan nama lengkap" 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input 
                  type="email" 
                  placeholder="Masukkan email aktif" 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nomor Telepon</label>
                <input 
                  type="tel" 
                  placeholder="Contoh: 08123456789" 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input 
                  type="password" 
                  placeholder="Buat password (minimal 6 karakter)" 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="mt-6 w-full bg-blue-600 text-white font-bold rounded-xl py-3.5 hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:hover:shadow-none"
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Sudah punya akun? <Link href="/Login" className="text-blue-600 font-semibold hover:underline">Login di sini</Link>
            </p>
          </form>
        </div>
      </main>

    </div>
  );
}