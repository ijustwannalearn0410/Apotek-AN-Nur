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
    setLoading(true); // Tambahkan setLoading true di sini agar tombol disable saat proses
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
    <div className="min-h-screen flex flex-col font-serif">
      
      {/* 1. Navbar */}
      <nav className="bg-[#103b7b] text-white px-8 py-4 flex justify-between items-center z-20 shadow-md relative">
        <h1 className="text-xl font-bold">Apotek AN-NUR</h1>
        <div className="space-x-2 text-lg">
          <Link href="/Login" className="hover:text-gray-300">Login</Link>
          <span>|</span>
          <Link href="/" className="hover:text-gray-300">Dashboard</Link>
        </div>
      </nav>

      {/* 2. Main Content dengan Background */}
      <main className="relative flex-grow flex items-center justify-center p-4">
        {}
        <div 
          className="absolute inset-0 bg-[url('/images/public.jpg')] bg-cover bg-center"
        ></div>
        {/* Overlay Putih/Transparan agar gambar tidak terlalu gelap */}
        <div className="absolute inset-0 bg-white/40"></div>

        {/* 3. Form Container */}
        <div className="relative z-10 bg-[#12165c] w-full max-w-lg rounded-[2rem] p-10 md:p-14 shadow-2xl">
          <h2 className="text-white text-center text-xl md:text-2xl mb-8 tracking-wide">
            Harap masukan data diri anda
          </h2>

          <form onSubmit={handleRegister} className="flex flex-col space-y-6">
            
            <input 
              type="email" 
              placeholder="Email" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full bg-[#d9d9d9] text-gray-800 placeholder-gray-600 text-center py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
            />
            
            <input 
              type="password" 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full bg-[#d9d9d9] text-gray-800 placeholder-gray-600 text-center py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
            />
            
            <input 
              type="text" 
              placeholder="Nama Lengkap" 
              onChange={(e) => setFullName(e.target.value)} 
              required 
              className="w-full bg-[#d9d9d9] text-gray-800 placeholder-gray-600 text-center py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
            />
            
            <input 
              type="text" 
              placeholder="Nomor Telepon" 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              className="w-full bg-[#d9d9d9] text-gray-800 placeholder-gray-600 text-center py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
            />
            
            <div className="pt-8 flex justify-center">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#d9d9d9] text-black font-bold text-lg py-2 px-10 rounded-full hover:bg-gray-300 transition-colors disabled:opacity-70"
              >
                {loading ? "Memproses..." : "Register"}
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="bg-[#103b7b] text-white px-8 py-6 z-20 relative">
        <p className="text-lg">Informasi lebih lanjut hubungi: 081244615566</p>
      </footer>

    </div>
  );
}