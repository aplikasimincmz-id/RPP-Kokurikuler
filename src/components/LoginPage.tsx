import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wand2, User, LogIn, Heart, ShieldAlert, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [identitas, setIdentitas] = useState('');
  const [kodeAkses, setKodeAkses] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate brief network delay for feel
    setTimeout(() => {
      if (identitas === 'admin' && kodeAkses === 'Admin24') {
        onLogin();
      } else {
        setError('Akses ditolak. Silakan periksa kembali data Anda.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-300/20 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-primary-100 overflow-hidden relative z-10"
      >
        <div className="bg-primary-800 p-8 text-center relative overflow-hidden">
          {/* Wave background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-150 transform rotate-12">
              <path fill="#ffffff" d="M0,64L80,74.7C160,85,320,107,480,112C640,117,800,107,960,101.3C1120,96,1280,96,1360,96L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
          </div>

          <div className="flex justify-center mb-6 relative z-10">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-md border border-white/30">
              <Wand2 className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white leading-tight relative z-10 mb-2">
            Penyusun Alat RPP Kokurikuler
          </h1>
          <div className="bg-emerald-400 text-emerald-950 text-[10px] font-bold py-1 px-3 rounded-full inline-block mb-3 relative z-10 uppercase tracking-wider">
            Alat Bantu Personal (Privat)
          </div>
          <p className="text-primary-100 text-[11px] opacity-90 relative z-10 max-w-[200px] mx-auto leading-tight">
            Gunakan alat ini untuk membantu persiapan teknis pembelajaran.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-start gap-2 mb-2">
            <p className="text-[10px] text-amber-800 leading-tight">
              <strong>Pemberitahuan Konten:</strong> Situs ini adalah proyek pribadi non-komersial. Kami tidak berafiliasi dengan institusi pemerintah manapun. Data hanya disimpan di browser Anda.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3"
            >
              <ShieldAlert className="text-red-500 shrink-0" size={18} />
              <p className="text-xs text-red-700 font-medium">{error}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-1.5">
                <User size={14} /> Nama Identitas
              </label>
              <input 
                type="text" 
                value={identitas}
                onChange={(e) => setIdentitas(e.target.value)}
                required
                placeholder="Masukkan identitas alat"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-1.5">
                <Sparkles size={14} /> Kode Akses
              </label>
              <input 
                type="password" 
                value={kodeAkses}
                onChange={(e) => setKodeAkses(e.target.value)}
                required
                placeholder="Masukkan kode unik"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-200 transition-all active:scale-[0.98] disabled:opacity-70 group"
          >
            {isLoading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <LogIn size={20} />
              </motion.div>
            ) : (
              <>
                Mulai Gunakan Alat <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <footer className="pt-4 text-center border-t border-gray-100 mt-6 pt-6">
            <div className="flex items-center justify-center gap-2 text-primary-800 font-bold mb-1">
              <Heart className="fill-red-400 text-red-400" size={14} />
              <span className="text-sm">MI Berbasis Cinta</span>
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-2">
              © 2026 Agus Arifien
            </p>
          </footer>
        </form>
      </motion.div>
    </div>
  );
};

const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);
