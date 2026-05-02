import Link from 'next/link';
import { PlusCircle, CheckSquare, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#e6ecef]">
      
      {/* 1. Navbar */}
      <nav className="bg-[#103b7b] text-white px-8 py-4 flex justify-between items-center z-20 shadow-md relative">
        <h1 className="text-xl font-serif font-bold">Apotek AN-NUR</h1>
        <div className="space-x-2 text-lg">
          <Link href="/Login" className="hover:text-gray-300">Login</Link>
          <span>|</span>
          <Link href="/Register" className="hover:text-gray-300">Register</Link>
        </div>
      </nav>

      {/* 2. Hero Section dengan Overlay */}
      <section className="relative h-[350px] md:h-[400px] flex items-center justify-center text-center">
        {}
        <div 
          className="absolute inset-0 bg-[url('/images/waiting-room.jpg')] bg-cover bg-center"
        ></div>
        {/* Blue Overlay */}
        <div className="absolute inset-0 bg-[#4a72bc]/80 mix-blend-multiply"></div>
        
        {/* Hero Text */}
        <div className="relative z-10 text-white max-w-4xl px-4">
          <h2 className="text-2xl md:text-4xl font-serif font-semibold leading-tight">
            Penerapan Algoritma Scheduled<br />
            Priority Queue Pada Antrian<br />
            Konsultasi Apotek AN-NUR
          </h2>
        </div>
      </section>

      {/* 3. Features / Langkah-langkah */}
      <section className="flex-grow max-w-5xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-gray-700 font-medium">Ambil nomor antrian</p>
            <div className="bg-[#103b7b] p-6 rounded-2xl shadow-lg">
              <PlusCircle size={80} className="text-[#1b1b1b]" strokeWidth={1.5} />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-gray-700 font-medium">Check in di tempat</p>
            <div className="bg-[#103b7b] p-6 rounded-2xl shadow-lg">
              <CheckSquare size={80} className="text-[#1b1b1b]" strokeWidth={1.5} />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-gray-700 font-medium">Anda siap dilayani saat giliran adan tiba</p>
            <div className="bg-[#103b7b] p-6 rounded-2xl shadow-lg">
              <User size={80} className="text-[#1b1b1b]" strokeWidth={1.5} />
            </div>
          </div>

        </div>
      </section>

      {/* 4. Footer */}
      <footer className="px-8 py-6 text-gray-800 border-t border-gray-300">
        <p className="text-lg">Alamat: Jl. Sultan Amai, Marisa Utara, Kec. Marisa</p>
        <p className="text-lg">Buka: senin-sabtu 08:00-22:00</p>
      </footer>

    </div>
  );
}