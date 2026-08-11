import Link from 'next/link';
import { PlusCircle, CheckSquare, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans selection:bg-blue-200">
      
      {/* 1. Navbar */}
      <nav className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-100">
        <h1 className="text-2xl font-extrabold tracking-tight text-blue-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600">
          Apotek AN-NUR
        </h1>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/Login" className="text-gray-600 hover:text-blue-600 transition-colors">
            Login
          </Link>
          <div className="h-4 w-px bg-gray-300"></div>
          <Link href="/Register" className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            Register
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative mt-[72px] h-[450px] md:h-[550px] flex items-center justify-center text-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-[url('/images/waiting-room.jpg')] bg-cover bg-center transform scale-105"
        ></div>
        
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/60 to-gray-50"></div>
        
        {/* Hero Text */}
        <div className="relative z-10 max-w-4xl px-6 transform transition-all duration-700 translate-y-0 opacity-100">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100/20 backdrop-blur-md border border-white/20 text-blue-100 text-sm font-semibold tracking-wide mb-6 shadow-sm">
            Layanan Antrian Prioritas
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg mb-6">
            Penerapan Algoritma <span className="text-blue-300">Scheduled<br/>Priority Queue</span> Pada Antrian<br/>
            Konsultasi Apotek AN-NUR
          </h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Dapatkan pengalaman layanan konsultasi yang lebih teratur, adil, dan efisien untuk kesehatan Anda.
          </p>
        </div>
      </section>

      {/* 3. Features / Langkah-langkah */}
      <section className="flex-grow max-w-6xl mx-auto w-full px-6 py-20 -mt-10 relative z-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Cara Kerja Antrian</h3>
          <p className="text-gray-500 max-w-lg mx-auto">Ikuti tiga langkah mudah berikut untuk mendapatkan layanan konsultasi yang lebih optimal di Apotek AN-NUR.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          
          {/* Feature 1 */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col items-center text-center cursor-default">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-100">
              <PlusCircle size={40} className="text-blue-600" strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Ambil Nomor Antrian</h4>
            <p className="text-gray-500 leading-relaxed text-sm">
              Mulai dengan mengambil nomor antrian Anda baik secara online maupun langsung di tempat.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col items-center text-center cursor-default">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-100">
              <CheckSquare size={40} className="text-blue-600" strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Check in di Tempat</h4>
            <p className="text-gray-500 leading-relaxed text-sm">
              Konfirmasi kehadiran Anda saat tiba di lokasi untuk memastikan giliran prioritas Anda.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col items-center text-center cursor-default">
            <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-100">
              <User size={40} className="text-blue-600" strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Siap Dilayani</h4>
            <p className="text-gray-500 leading-relaxed text-sm">
              Tunggu dengan santai, Anda siap dilayani begitu giliran prioritas Anda tiba.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-extrabold text-blue-900 tracking-tight mb-2">Apotek AN-NUR</h2>
            <p className="text-gray-500 text-sm max-w-xs">Pelayanan konsultasi kesehatan dengan prioritas yang adil dan efisien.</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-800 font-semibold mb-2">Jl. Sultan Amai, Marisa Utara, Kec. Marisa</p>
            <p className="text-gray-500 text-sm flex items-center justify-center md:justify-end gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Buka: Senin - Sabtu (08:00 - 22:00)
            </p>
          </div>
        </div>
        <div className="border-t border-gray-100 py-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Apotek AN-NUR. All rights reserved.
        </div>
      </footer>

    </div>
  );
}