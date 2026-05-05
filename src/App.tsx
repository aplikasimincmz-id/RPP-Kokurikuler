/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ModuleForm } from './components/ModuleForm';
import { ModulePreview } from './components/ModulePreview';
import { IdentityForm } from './components/IdentityForm';
import { ModuleData } from './types';
import { Printer, Heart, Save, ArrowLeft, Layout, FileText, Download, Loader2, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showToast = (message: string) => {
    setNotification({ message, show: true });
  };
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
      harian: 'Penyiraman tanaman pot dan dzikir lingkungan',
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
          // Also hide any remaining interactive elements that shouldn't be in PDF
          const el = clonedDoc.getElementById('printable-module');
          if (el) {
            el.style.boxShadow = 'none';
            el.style.border = 'none';
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
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-6 bg-teal-800 text-white px-6 py-4 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
            <Heart className="fill-red-400 text-red-400 animate-pulse" size={24} /> 
            Aplikasi RPP Kokurikuler
          </h1>
          <p className="text-teal-100 mt-0.5 text-xs opacity-90 italic">"Ilmu Tanpa Adab Bak Pohon Tak Berbuah"</p>
        </div>
        <div className="flex-1 flex justify-center py-2 md:py-0">
          <nav className="flex items-center bg-teal-900/40 p-1 rounded-full border border-teal-700/50">
            {[
              { id: 1, label: 'Identitas', icon: <FileText size={14} /> },
              { id: 2, label: 'Isi Modul', icon: <Layout size={14} /> },
              { id: 3, label: 'Pratinjau', icon: <Printer size={14} /> },
            ].map((navStep) => (
              <button
                key={navStep.id}
                onClick={() => setStep(navStep.id as 1 | 2 | 3)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
                  step === navStep.id 
                    ? 'bg-teal-500 text-white shadow-sm shadow-teal-900' 
                    : 'text-teal-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {navStep.icon}
                <span className="hidden sm:inline">{navStep.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button 
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
              className="bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-white/20 transition-all active:scale-95 border border-white/20"
            >
              <ArrowLeft size={14} /> Kembali
            </button>
          )}
          {step === 3 && (
            <div className="flex gap-2 bg-teal-900/40 p-1 rounded-full border border-teal-700/50">
              <button 
                onClick={exportToPdf}
                disabled={isExporting}
                className={`bg-white text-teal-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${isExporting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-50 hover:shadow-md'}`}
                title="Simpan Modul sebagai PDF"
              >
                {isExporting ? <Loader2 className="animate-spin" size={14} /> : <Printer size={14} />} 
                {isExporting ? 'Memproses...' : 'Simpan PDF'}
              </button>
              <button 
                onClick={exportToWord}
                disabled={isExporting}
                className={`bg-teal-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${isExporting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-500 shadow-sm'}`}
                title="Ekspor Ke MS Word"
              >
                <FileText size={14} /> Word
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <IdentityForm 
              data={data} 
              onChange={handleDataChange} 
              onNext={() => setStep(2)} 
              onPrint={handlePrint}
              onReset={handleReset}
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

      <footer className="mt-20 text-center text-gray-400 text-xs pb-10 print:hidden">
        &copy; 2026 Ahli Kurikulum Madrasah & KBC. Dirancang eksklusif untuk Guru MI.
      </footer>

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
