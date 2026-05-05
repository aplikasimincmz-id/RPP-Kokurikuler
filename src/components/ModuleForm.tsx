import React, { useState } from 'react';
import { ModuleData } from '../types';
import { generateModuleContent, generateKarakteristik } from '../services/geminiService';
import { Sparkles, Loader2 } from 'lucide-react';

interface FormProps {
  data: ModuleData;
  onChange: (data: ModuleData) => void;
}

export const ModuleForm: React.FC<FormProps> = ({ data, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [loadingKarakteristik, setLoadingKarakteristik] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const generated = await generateModuleContent(data);
      onChange({
        ...data,
        ...generated
      });
    } catch (error) {
      console.error("AI Generation failed", error);
      alert("Gagal membuat konten AI. Pastikan API Key sudah benar.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKarakteristik = async () => {
    if (!data.fase_kelas || !data.nama_kegiatan) {
      alert("Harap pilih Fase/Kelas dan Tema Kegiatan terlebih dahulu.");
      return;
    }
    setLoadingKarakteristik(true);
    try {
      const narasi = await generateKarakteristik(data);
      onChange({ ...data, karakteristik: narasi });
    } catch (error) {
      console.error("AI Generation failed", error);
      alert("Gagal membuat narasi AI.");
    } finally {
      setLoadingKarakteristik(false);
    }
  };

  const handleCheckboxChange = (name: 'dimensi' | 'topik', value: string) => {
    const currentValues = data[name] ? data[name]!.split(', ').filter(v => v !== '') : [];
    let newValues: string[];
    
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    onChange({ ...data, [name]: newValues.join(', ') });
  };

  const dimensiOptions = [
    "Keimanan dan ketakwaan terhadap Tuhan Yang Maha Esa",
    "Kewargaan",
    "Penalaran kritis",
    "Kreativitas",
    "Kolaborasi",
    "Kemandirian",
    "Kesehatan",
    "Komunikasi"
  ];

  const topikOptions = [
    "1. Cinta Allah Swt. dan Rasul-Nya",
    "2. Cinta Ilmu",
    "3. Cinta Lingkungan",
    "4. Cinta Diri dan Sesama Manusia",
    "5. Cinta Tanah Air"
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-md space-y-4 border border-primary-100 dark:border-neutral-800 transition-colors">
      <div className="flex justify-between items-center border-b dark:border-neutral-800 pb-2 mb-4">
        <h2 className="text-xl font-bold text-primary-800 dark:text-primary-400 flex items-center gap-2">
          <span className="bg-primary-600 text-white p-1 rounded">📝</span> Input Data Modul
        </h2>
        <button
          onClick={handleGenerateAI}
          disabled={loading}
          className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-purple-700 transition-all disabled:opacity-50 shadow-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
          Generate Konten AI
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">Fase / Kelas</label>
          <select 
            name="fase_kelas" value={data.fase_kelas || ''} onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">Pilih Fase/Kelas</option>
            <option value="Fase A Kelas 1">Fase A Kelas 1</option>
            <option value="Fase A Kelas 2">Fase A Kelas 2</option>
            <option value="Fase B Kelas 3">Fase B Kelas 3</option>
            <option value="Fase B Kelas 4">Fase B Kelas 4</option>
            <option value="Fase C Kelas 5">Fase C Kelas 5</option>
            <option value="Fase C Kelas 6">Fase C Kelas 6</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">Semester</label>
          <select 
            name="semester" value={data.semester || ''} onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">Pilih Semester</option>
            <option value="I (Ganjil)">I (Ganjil)</option>
            <option value="II (Genap)">II (Genap)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">Jenis Kokurikuler</label>
          <select 
            name="jenis_kokurikuler" value={data.jenis_kokurikuler || ''} onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">Pilih Jenis Kokurikuler</option>
            <option value="Pembelajaran kolaboratif lintas disiplin ilmu">Pembelajaran kolaboratif lintas disiplin ilmu</option>
            <option value="Gerakan 7KAIH">Gerakan 7KAIH</option>
            <option value="Kolaboratif Berbasis Cinta (KKBC)">Kolaboratif Berbasis Cinta (KKBC)</option>
            <option value="Ciri khas madrasah berbasis konteks lokal">Ciri khas madrasah berbasis konteks lokal</option>
            <option value="Berbasis nilai-nilai madrasah">Berbasis nilai-nilai madrasah</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">Alokasi Waktu (JP)</label>
          <div className="flex items-center gap-2">
            <input 
              type="number"
              name="alokasi_jp" value={data.alokasi_jp || ''} onChange={handleChange}
              placeholder="54"
              className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <span className="font-bold text-gray-500">JP</span>
          </div>
          <p className="text-[10px] text-primary-600 dark:text-primary-400 italic">Asumsi MI: 108 JP/Tahun, 54 JP/Semester</p>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">Nama Kegiatan / Tema</label>
          <select 
            name="nama_kegiatan" value={data.nama_kegiatan || ''} onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">Pilih Tema Kegiatan</option>
            <option value="Generasi sehat dan bugar">Generasi sehat dan bugar</option>
            <option value="Peduli dan berbagi">Peduli dan berbagi</option>
            <option value="Hidup hemat dan produktif">Hidup hemat dan produktif</option>
            <option value="Berkarya untuk sesama dan bangsa">Berkarya untuk sesama dan bangsa</option>
            <option value="Gaya Hidup Berkelanjutan">Gaya Hidup Berkelanjutan</option>
            <option value="Aku Sayang Bumi">Aku Sayang Bumi</option>
            <option value="Aku Cinta Indonesia">Aku Cinta Indonesia</option>
            <option value="Kita Semua Bersaudara">Kita Semua Bersaudara</option>
            <option value="Teknologi memudahkan dunia">Teknologi memudahkan dunia</option>
            <option value="Keberagamaan dalam Keragaman">Keberagamaan dalam Keragaman</option>
            <option value="Damai dalam Persaudaraan">Damai dalam Persaudaraan</option>
            <option value="Cinta Tanah Air Bagian dari iman">Cinta Tanah Air Bagian dari iman</option>
            <option value="Lestari Adat Istiadat Negeri">Lestari Adat Istiadat Negeri</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">Tahun Pelajaran</label>
          <input 
            name="tahun_pelajaran" value={data.tahun_pelajaran || ''} onChange={handleChange}
            placeholder="Contoh: 2025/2026"
            className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">Input Titimangsa</label>
          <input 
            name="titimangsa" value={data.titimangsa || ''} onChange={handleChange}
            placeholder="Contoh: Ciamis, 4 Mei 2026"
            className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">Karakteristik Peserta Didik</label>
          <button 
            onClick={handleGenerateKarakteristik}
            disabled={loadingKarakteristik}
            className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded hover:bg-purple-200 transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            {loadingKarakteristik ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
            Generate Narasi AI
          </button>
        </div>
        <textarea 
          name="karakteristik" value={data.karakteristik || ''} onChange={handleChange}
          rows={2}
          placeholder="Jelaskan kondisi murid secara umum..."
          className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase block">Dimensi Profil Lulusan (Boleh Pilih Lebih dari Satu)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border border-gray-200 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800">
            {dimensiOptions.map(option => (
              <label key={option} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary-700 dark:hover:text-primary-400 group">
                <input 
                  type="checkbox"
                  checked={(data.dimensi || '').split(', ').includes(option)}
                  onChange={() => handleCheckboxChange('dimensi', option)}
                  className="rounded border-gray-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <span className="group-hover:translate-x-1 transition-transform dark:text-neutral-300">{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase block">Topik Panca Cinta (Boleh Pilih Lebih dari Satu)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border border-gray-200 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800">
            {topikOptions.map(option => (
              <label key={option} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary-700 dark:hover:text-primary-400 group">
                <input 
                  type="checkbox"
                  checked={(data.topik || '').split(', ').includes(option)}
                  onChange={() => handleCheckboxChange('topik', option)}
                  className="rounded border-gray-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <span className="group-hover:translate-x-1 transition-transform dark:text-neutral-300">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">Tujuan Pembelajaran</label>
        <textarea 
          name="tujuan" value={data.tujuan || ''} onChange={handleChange}
          rows={2}
          placeholder="Gunakan kata kerja operasional..."
          className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">Praktik Pedagogis</label>
        <select 
          name="praktik_pedagogis" value={data.praktik_pedagogis || 'PjBL'} onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
        >
          <option value="PjBL">PjBL (Project Based Learning)</option>
          <option value="PBL">PBL (Problem Based Learning)</option>
          <option value="Discovery">Discovery Learning</option>
          <option value="Experiential">Experiential Learning</option>
        </select>
      </div>

      {data.deskripsi_kegiatan_ai !== undefined && (
        <div className="border-t border-gray-200 dark:border-neutral-800 pt-4 space-y-4">
          <h3 className="text-sm font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2">
            <Sparkles size={14} /> Konten AI Tergenerasi (Silakan Edit Jika Perlu)
          </h3>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 dark:text-neutral-500 uppercase">Deskripsi Kegiatan</label>
            <textarea 
              name="deskripsi_kegiatan_ai" value={data.deskripsi_kegiatan_ai || ''} onChange={handleChange}
              rows={4} className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white text-sm"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-500 uppercase">Tahap 1: Memahami</label>
              <textarea name="langkah_tahap_1" value={data.langkah_tahap_1 || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-500 uppercase">Tahap 2: Mengaplikasi</label>
              <textarea name="langkah_tahap_2" value={data.langkah_tahap_2 || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-500 uppercase">Tahap 3: Merefleksi</label>
              <textarea name="langkah_tahap_3" value={data.langkah_tahap_3 || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-neutral-700 rounded dark:bg-neutral-800 dark:text-white text-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
