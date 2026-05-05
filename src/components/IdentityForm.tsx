import React from 'react';
import { ModuleData } from '../types';
import { School, User, Upload, ArrowRight, Save, CheckCircle2, Printer, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IdentityFormProps {
  data: ModuleData;
  onChange: (data: ModuleData) => void;
  onNext: () => void;
  onPrint: () => void;
  onReset?: () => void;
}

export const IdentityForm: React.FC<IdentityFormProps> = ({ data, onChange, onNext, onPrint, onReset }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, logo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-teal-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-teal-800 mb-6 flex items-center gap-2 border-b pb-4">
        <School className="text-teal-600" /> Identitas Madrasah & Guru
      </h2>

      <div className="space-y-6">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 p-4 bg-teal-50 rounded-xl border-2 border-dashed border-teal-200">
          <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center border border-teal-100 overflow-hidden relative group">
            {data.logo_url ? (
              <img src={data.logo_url} alt="Logo Madrasah" className="w-full h-full object-contain p-2" />
            ) : (
              <School className="w-12 h-12 text-teal-200" />
            )}
            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Upload className="text-white" />
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
          <p className="text-sm font-medium text-teal-700">Klik untuk unggah logo Madrasah</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
              <School size={14} /> Nama Madrasah
            </label>
            <input 
              name="nama_madrasah" value={data.nama_madrasah || ''} onChange={handleChange}
              placeholder="Contoh: MIN 1 Ciamis"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
              <User size={14} /> Nama Kepala Madrasah
            </label>
            <input 
              name="nama_kepala" value={data.nama_kepala || ''} onChange={handleChange}
              placeholder="Nama Lengkap & Gelar"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase">NIP Kepala</label>
            <input 
              name="nip_kepala" value={data.nip_kepala || ''} onChange={handleChange}
              placeholder="NIP / NUPTK"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
              <User size={14} /> Nama Guru Kelas
            </label>
            <input 
              name="nama_guru" value={data.nama_guru || ''} onChange={handleChange}
              placeholder="Nama Lengkap & Gelar"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase">NIP Guru</label>
            <input 
              name="nip_guru" value={data.nip_guru || ''} onChange={handleChange}
              placeholder="NIP / NUPTK"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 mt-8 pt-6 border-t items-center text-sm">
          {saved && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 text-teal-600 font-bold bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200"
            >
              <CheckCircle2 size={16} className="animate-bounce" />
              <span>Berhasil Disimpan!</span>
            </motion.div>
          )}
          
          <button 
            type="button"
            onClick={onPrint}
            className="px-3 py-1.5 border border-gray-400 text-gray-700 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <Printer size={14} /> Cetak
          </button>

          {onReset && (
            <button 
              type="button"
              onClick={onReset}
              className="px-3 py-1.5 border border-red-200 text-red-600 rounded-full text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-1.5"
              title="Reset Semua Data"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}

          <motion.button 
            whileHover={!saved ? { scale: 1.02 } : {}}
            whileTap={!saved ? { scale: 0.98 } : {}}
            type="button"
            onClick={handleSave}
            disabled={saved}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 relative overflow-hidden ${
              saved 
                ? 'bg-teal-100 text-teal-400 border border-teal-200 cursor-not-allowed' 
                : 'border border-teal-600 text-teal-600 hover:bg-teal-50'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 size={16} /> Tersimpan
              </>
            ) : (
              <>
                <Save size={16} /> Simpan Identitas
              </>
            )}
          </motion.button>

          <button 
            type="button"
            onClick={onNext}
            className="px-5 py-1.5 bg-teal-600 text-white rounded-full text-xs font-bold hover:bg-teal-700 transition-all flex items-center gap-1.5 shadow-md shadow-teal-100 active:scale-95"
          >
            Lanjut <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
