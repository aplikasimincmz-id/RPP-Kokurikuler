/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ModuleForm } from './components/ModuleForm';
import { ModulePreview } from './components/ModulePreview';
import { IdentityForm } from './components/IdentityForm';
import { LoginPage } from './components/LoginPage';
import { ThemeSettingsComponent } from './components/ThemeSettings';
import { ModuleData, ThemeSettings } from './types';
import { Printer, Heart, Save, ArrowLeft, Layout, FileText, Download, Loader2, CheckCircle, LogOut, Palette, X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'motion/react';

const getDefaultData = (): ModuleData => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const academicYear = currentMonth >= 6 
    ? `${currentYear}/${currentYear + 1}` 
    : `${currentYear - 1}/${currentYear}`;

  return {
    nama_madrasah: '',
    nama_kepala: '',
    nip_kepala: '',
    nama_guru: '',
    nip_guru: '',
    tahun_pelajaran: academicYear,
    logo_url: '',
    titimangsa: `Ciamis, ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    fase_kelas: 'Fase A Kelas 1',
    semester: 'I (Ganjil)',
    alokasi_jp: '54',
    nama_kegiatan: 'Aku Sayang Bumi',
    jenis_kokurikuler: 'Kolaboratif Berbasis Cinta (KKBC)',
    karakteristik: 'Murid memiliki rasa ingin tahu yang tinggi terhadap benda di sekitarnya, senang bergerak, dan baru memulai pembiasaan adab madrasah.',
    dimensi: 'Beriman, Bertakwa Kepada Tuhan YME, dan Berakhlak Mulia',
    topik: 'Cinta Alam dan Lingkungan',
    tujuan: 'Menumbuhkan rasa syukur kepada Allah SWT melalui kegiatan merawat tanaman dan menjaga kebersihan lingkungan madrasah.',
    harian: 'Penyiraman tanaman pot and dzikir lingkungan',
    mingguan: 'Operasi Semut (Kebersihan Bersama)',
    bulanan: 'Festival Panen atau Gelar Karya Mini',
    tahunan: 'Aksi Nyata Penghijauan Lingkungan Sekitar MI',
    praktik_pedagogis: 'PjBL',
    deskripsi_kegiatan_ai: '',
    langkah_tahap_1: '',
    langkah_tahap_2: '',
    langkah_tahap_3: '',
  };
};

export default function App() {
  // 1. ALL HOOKS MUST COEXIST AT THE TOP
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('kbc_logged_in') === 'true';
  });
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('kbc_theme_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { mode: 'system', primaryColor: 'teal' };
  });
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  const [data, setData] = useState<ModuleData>(() => {
    const saved = localStorage.getItem('kbc_module_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved data", e);
      }
    }
    return getDefaultData();
  });

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    const root = document.documentElement;
    if (themeSettings.mode === 'dark') {
      root.classList.add('dark');
    } else if (themeSettings.mode === 'light') {
      root.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }
    localStorage.setItem('kbc_theme_settings', JSON.stringify(themeSettings));
  }, [themeSettings]);

  // 2. Early return AFTER hooks
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('kbc_logged_in', 'true');
  };

  const handleLogout = () => {
    localStorage.removeItem('kbc_logged_in');
    setIsLoggedIn(false);
    window.location.reload();
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const showToast = (message: string) => {
    setNotification({ message, show: true });
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua data dan kembali ke awal? Tindakan ini tidak bisa dibatalkan.')) {
      const resetData = getDefaultData();
      setData(resetData);
      localStorage.removeItem('kbc_module_data');
    }
  };

  const handleDataChange = (newData: ModuleData) => {
    setData(newData);
    localStorage.setItem('kbc_module_data', JSON.stringify(newData));
  };

  const handlePrint = () => {
    window.focus();
    window.print();
  };

  const handleSave = () => {
    localStorage.setItem('kbc_module_data', JSON.stringify(data));
    showToast("Modul berhasil disimpan ke perangkat Anda!");
  };

  const handleEditSection = (sectionIndex: number) => {
    if (sectionIndex === 0) {
      setStep(1);
    } else {
      setStep(2);
    }
  };

  const exportToPdf = async () => {
    const element = document.getElementById('printable-module');
    if (!element || isExporting) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Remove or replace oklch/oklab color functions which html2canvas fails to parse
          const styles = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styles.length; i++) {
            const style = styles[i];
            if (style.textContent) {
              style.textContent = style.textContent.replace(/oklch\([^)]+\)/g, '#000');
              style.textContent = style.textContent.replace(/oklab\([^)]+\)/g, '#000');
            }
          }

          // Forcefully remove elements marked as print-hidden to ensure they don't affect layout
          const hiddenElements = clonedDoc.querySelectorAll('.print-hidden, .print\\:hidden');
          hiddenElements.forEach(el => {
            (el as HTMLElement).style.display = 'none';
            // Optional: physically remove if style isn't enough, but display: none usually suffices for layout
            el.remove();
          });

          // Also hide any remaining interactive elements that shouldn't be in PDF
          const el = clonedDoc.getElementById('printable-module');
          if (el) {
            el.style.boxShadow = 'none';
            el.style.border = 'none';
            el.style.margin = '0';
            el.style.width = '100%';
          }
        },
        ignoreElements: (el) => {
          return el.classList.contains('print-hidden') || el.classList.contains('print:hidden');
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Modul-KBC-${data.nama_kegiatan.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error("PDF export failed", error);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const exportAppendixToWord = () => {
    const appendixContent = document.getElementById('appendix-section')?.innerHTML;
    const moduleTitle = data.nama_kegiatan;
    
    if (!appendixContent) {
      showToast("Gagal mengambil data lampiran.");
      return;
    }
    
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <style>
          @page Section1 {
            size: 595.3pt 841.9pt; /* A4 */
            margin: 56.7pt 56.7pt 56.7pt 56.7pt;
          }
          div.Section1 { page: Section1; }
          body { font-family: 'Times New Roman', serif; line-height: 1.2; color: #000000; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 12pt; border: 1px solid #000000; }
          th, td { border: 1px solid #000000; padding: 5pt; vertical-align: top; font-size: 10pt; }
          .bg-teal-900, .bg-teal-800 { background-color: #134e4a !important; color: #ffffff !important; }
          .text-teal-900 { color: #134e4a !important; }
          .font-bold { font-weight: bold; }
          .uppercase { text-transform: uppercase; }
          .text-center { text-align: center; }
          h2 { font-size: 12pt; background-color: #134e4a !important; color: #ffffff !important; font-weight: bold; padding: 5pt; margin-top: 15pt; text-align: center; }
          h3 { font-size: 11pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; color: #134e4a; }
          .lampiran-table th { background-color: #134e4a !important; color: #ffffff !important; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class='Section1'>
          <h1 style="text-align: center; font-size: 14pt; margin-bottom: 20pt;">LAMPIRAN INSTRUMEN PENILAIAN<br>PROYEK: ${moduleTitle}</h1>
    `;
    const footer = "</div></body></html>";
    
    let cleanContent = appendixContent
      .replace(/<svg[^>]*>([\s\S]*?)<\/svg>/g, '')
      .replace(/<button[^>]*>([\s\S]*?)<\/button>/g, '');
    
    const sourceHTML = header + cleanContent + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lampiran-Modul-${moduleTitle.replace(/\s+/g, '-')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast("Lampiran berhasil diunduh!");
  };

  const exportToWord = () => {
    const content = document.getElementById('printable-module')?.innerHTML;
    if (!content) return;
    
    // Improved HTML to Word with more robust styling
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <style>
          @page Section1 {
            size: 595.3pt 841.9pt; /* A4 */
            margin: 56.7pt 56.7pt 56.7pt 56.7pt; /* 2cm */
            mso-header-margin: 35.4pt;
            mso-footer-margin: 35.4pt;
            mso-paper-source: 0;
          }
          div.Section1 { page: Section1; }
          body { font-family: 'Times New Roman', serif; line-height: 1.2; color: #000000; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 12pt; border: 1px solid #000000; }
          th, td { border: 1px solid #000000; padding: 5pt; vertical-align: top; font-size: 10pt; }
          
          /* Colors */
          .bg-teal-700, .bg-teal-800, .bg-teal-900 { background-color: #134e4a !important; color: #ffffff !important; }
          .bg-teal-50 { background-color: #f0fdfa !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          
          /* Border styles for Tailwind-like classes */
          .border { border: 1px solid #000000 !important; }
          .border-gray-800 { border-color: #1f2937 !important; }
          .border-gray-100 { border-color: #f3f4f6 !important; }
          .border-none { border: none !important; }
          .border-none td, .border-none th { border: none !important; }
          
          /* Typography */
          .font-bold { font-weight: bold; }
          .font-semibold { font-weight: 600; }
          .italic { font-style: italic; }
          .uppercase { text-transform: uppercase; }
          .text-center { text-align: center; }
          .text-justify { text-align: justify; }
          .text-right { text-align: right; }
          .text-teal-900 { color: #134e4a !important; }
          .text-teal-800 { color: #115e59 !important; }
          .text-teal-700 { color: #0f766e !important; }
          
          /* Headers */
          h1 { font-size: 14pt; text-align: center; font-weight: bold; margin-bottom: 6pt; }
          h2 { font-size: 11pt; background-color: #134e4a !important; color: #ffffff !important; font-weight: bold; padding: 4pt; margin-top: 12pt; margin-bottom: 6pt; border: 1px solid #134e4a; }
          h3 { font-size: 10pt; font-weight: bold; color: #134e4a; margin-top: 10pt; margin-bottom: 4pt; }
          
          /* Spacing */
          .mb-6 { margin-bottom: 12pt; }
          .mt-10 { margin-top: 20pt; }
          .pb-3 { padding-bottom: 8pt; }
          .py-1 { padding-top: 2pt; padding-bottom: 2pt; }
          .pl-4 { padding-left: 15pt; }
          .pl-5 { padding-left: 20pt; }
          
          /* Tables in Lampiran */
          .lampiran-table th { background-color: #134e4a !important; color: #ffffff !important; font-weight: bold; border: 1px solid #000000; }
          .lampiran-table td { border: 1px solid #000000; }
        </style>
      </head>
      <body><div class='Section1'>`;
    const footer = "</div></body></html>";
    
    // Convert some div/span structures to more Word-friendly ones if they were grids
    let cleanContent = content
      .replace(/<svg[^>]*>([\s\S]*?)<\/svg>/g, '') // Remove svgs
      .replace(/<button[^>]*>([\s\S]*?)<\/button>/g, '') // Remove buttons
      .replace(/<img([^>]*)>/g, '<img$1 width="64" height="64">'); // Ensure images have size
    
    const sourceHTML = header + cleanContent + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Modul-KBC-${data.nama_kegiatan.replace(/\s+/g, '-')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Sidebar - Left Menu */}
      <aside className="w-full md:w-72 bg-primary-800 dark:bg-primary-950 text-white p-6 flex flex-col sticky top-0 h-auto md:h-screen z-40 print:hidden transition-colors duration-300 shadow-xl overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-xl font-extrabold flex items-center gap-2 text-white">
            <Heart className="fill-red-400 text-red-400 animate-pulse" size={24} /> 
            <span>RPP Kokurikuler</span>
          </h1>
          <p className="text-primary-100 mt-2 text-[10px] opacity-80 italic leading-tight">
            "Ilmu Tanpa Adab Bak Pohon Tak Berbuah"
          </p>
        </div>

        <nav className="flex flex-col gap-2 mb-8">
          <p className="text-[10px] font-bold text-primary-300 uppercase tracking-widest mb-2 opacity-60">Menu Utama</p>
          {[
            { id: 1, label: 'Identitas Proyek', icon: <FileText size={18} /> },
            { id: 2, label: 'Isi Modul KBC', icon: <Layout size={18} /> },
            { id: 3, label: 'Pratinjau & Cetak', icon: <Printer size={18} /> },
          ].map((navStep) => (
            <button
              key={navStep.id}
              onClick={() => setStep(navStep.id as 1 | 2 | 3)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                step === navStep.id 
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-900 border border-primary-400/30' 
                  : 'text-primary-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={step === navStep.id ? 'text-white' : 'text-primary-400'}>
                {navStep.icon}
              </div>
              {navStep.label}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-2 mb-8">
          <p className="text-[10px] font-bold text-primary-300 uppercase tracking-widest mb-2 opacity-60">Aksi Cepat</p>
          
          <button 
            onClick={handleSave}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-primary-200 hover:text-white hover:bg-teal-500/20 border border-transparent hover:border-teal-500/30"
            title="Simpan Modul (Local Storage)"
          >
            <div className="text-teal-400">
              <Save size={18} />
            </div>
            Simpan Modul
          </button>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-primary-200 hover:text-white hover:bg-blue-500/20 border border-transparent hover:border-blue-500/30"
            title="Cetak Halaman (Print)"
          >
            <div className="text-blue-400">
              <Printer size={18} />
            </div>
            Cetak Langsung
          </button>

          {step === 3 && (
            <>
              <button 
                onClick={exportToPdf}
                disabled={isExporting}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-primary-200 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 disabled:opacity-50"
                title="Cetak Modul ke PDF"
              >
                <div className="text-white">
                  {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Printer size={18} />}
                </div>
                {isExporting ? 'Memproses PDF...' : 'Simpan PDF'}
              </button>

              <button 
                onClick={exportToWord}
                disabled={isExporting}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-primary-200 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 disabled:opacity-50"
                title="Ekspor Modul ke Word"
              >
                <div className="text-blue-200">
                  <FileText size={18} />
                </div>
                Ekspor Word
              </button>
            </>
          )}

          <div className="h-[1px] bg-primary-700/50 my-2"></div>

          <button 
            onClick={() => setShowThemeSettings(!showThemeSettings)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              showThemeSettings ? 'bg-white/10 text-white' : 'text-primary-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="text-amber-400">
              <Palette size={18} />
            </div>
            Sesuaikan Tema
          </button>
        </div>

        <div className="mt-auto pt-6 flex flex-col gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-red-300 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/30"
          >
            <div className="text-red-400">
              <LogOut size={18} />
            </div>
            Keluar Aplikasi
          </button>

          <div className="px-4">
            <p className="text-[9px] font-bold text-primary-400 uppercase tracking-widest opacity-60">
              © 2026 Agus Arifien
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-6 py-4 flex justify-between items-center bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 print:hidden transition-colors">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button 
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
                title="Kembali"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
              {step === 1 ? 'Identitas Proyek' : step === 2 ? 'Pengisian Modul' : 'Hasil Akhir Modul'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 mr-2 uppercase tracking-tight">Step {step} of 3</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`w-6 h-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-800'}`} />
              ))}
            </div>
          </div>
        </header>

        <AnimatePresence>
          {showThemeSettings && (
            <div className="fixed top-20 left-72 z-50 animate-in fade-in slide-in-from-left-2 duration-200 ml-4 print:hidden">
              <ThemeSettingsComponent 
                settings={themeSettings} 
                onChange={setThemeSettings} 
              />
              <button 
                onClick={() => setShowThemeSettings(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </AnimatePresence>

        <main className="p-4 md:p-8 max-w-5xl mx-auto w-full">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <IdentityForm 
              data={data} 
              onChange={handleDataChange} 
              onNext={() => setStep(2)} 
              onPrint={handlePrint}
              onReset={handleReset}
              onLogout={handleLogout}
            />
          </div>
        )}

        {/* Hidden Preview for Step 1 & 2 printing */}
        <div className="hidden print:block">
          <ModulePreview data={data} onEdit={handleEditSection} />
        </div>

        {step === 2 && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <ModuleForm data={data} onChange={handleDataChange} />
            <div className="flex justify-end gap-4 bg-white p-4 rounded-xl shadow-md border border-teal-100">
              <button 
                onClick={() => {
                  setStep(3);
                  showToast("Modul berhasil digenerate! Silakan periksa pratinjau.");
                }}
                className="px-6 py-2 bg-teal-600 text-white rounded-full text-sm font-bold hover:bg-teal-700 transition-all flex items-center gap-2 shadow-md hover:shadow-teal-100 active:scale-95"
              >
                Generate Preview <Layout size={18} />
              </button>
            </div>
            
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm rounded-xl shadow-sm">
              <p className="font-bold flex items-center gap-2 mb-1">
                <Layout size={16} /> Tips Guru KBC:
              </p>
              Kurikulum Berbasis Cinta (KBC) menekankan bahwa ilmu tidak ada gunanya tanpa adab dan kasih sayang kepada Pencipta serta lingkungan.
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="mb-6 flex justify-between items-center print:hidden border-b pb-4 border-gray-200">
              <h2 className="text-xl font-bold text-teal-800">Pratinjau Hasil Akhir</h2>
              <p className="text-sm text-gray-500 italic">Silakan periksa kembali sebelum dicetak.</p>
            </div>
            <ModulePreview data={data} onEdit={handleEditSection} />
            
            <div className="mt-8 flex justify-center pb-8 print:hidden">
              <button 
                onClick={exportAppendixToWord}
                className="flex items-center gap-2 px-8 py-3 bg-white text-teal-700 border-2 border-teal-600 rounded-full font-bold hover:bg-teal-600 hover:text-white transition-all shadow-lg active:scale-95 group"
              >
                <Download size={20} className="group-hover:bounce" />
                Unduh Lampiran (Word)
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto px-6 py-4 text-center text-gray-400 text-[10px] print:hidden bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 transition-colors">
        &copy; 2026 Ahli Kurikulum Madrasah & KBC. Dirancang eksklusif untuk Guru MI.
      </footer>
    </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-teal-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-teal-500/30 whitespace-nowrap">
              <CheckCircle size={20} className="text-teal-400" />
              <span className="font-bold text-sm">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tailwind Print Overrides */}
      <style>{`
        @media print {
          body { background: white; margin: 0; padding: 0; }
          header, footer, .print-hidden { display: none !important; }
          .max-w-7xl { max-width: 100% !important; margin: 0 !important; }
          #root > div { padding: 0 !important; }
          #printable-module { 
            box-shadow: none !important; 
            border: none !important; 
            margin: 0 !important; 
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
