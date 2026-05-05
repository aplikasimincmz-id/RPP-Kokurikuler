import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ModuleData } from '../types';

interface PreviewProps {
  data: ModuleData;
  onEdit: (sectionIndex: number) => void;
}

export const ModulePreview: React.FC<PreviewProps> = ({ data, onEdit }) => {
  const pedagogisDesc = {
    PjBL: "Project Based Learning: Murid terlibat dalam proyek nyata yang menghasilkan produk cinta lingkungan.",
    PBL: "Problem Based Learning: Murid memecahkan masalah lingkungan di madrasah dengan solusi berbasis kasih sayang.",
    Discovery: "Discovery Learning: Murid menemukan sendiri keajaiban ciptaan Allah melalui eksplorasi terbimbing.",
    Experiential: "Experiential Learning: Murid belajar langsung dari pengalaman emosional dan fisik di lapangan."
  };

  const totalJP = parseInt(data.alokasi_jp || '0', 10);
  const jp1 = Math.floor(totalJP * 0.3);
  const jp2 = Math.floor(totalJP * 0.5);
  const jp3 = totalJP - jp1 - jp2;

  const rubricContent: Record<string, { aspect: string; prompt: string }> = {
    // Dimensi
    "Keimanan dan ketakwaan terhadap Tuhan Yang Maha Esa": { aspect: "Iman, Takwa, & Adab", prompt: "penerapan adab kasih sayang dan kesadaran spiritual dalam aktivitas." },
    "Kewargaan": { aspect: "Kewargaan", prompt: "sikap tanggung jawab sosial dan kepedulian terhadap lingkungan sekitar." },
    "Penalaran kritis": { aspect: "Penalaran Kritis", prompt: "kemampuan menganalisis hubungan antar komponen dalam proyek." },
    "Kreativitas": { aspect: "Kreativitas & Produk", prompt: "orisinalitas ide dan keunikan hasil karya yang dihasilkan." },
    "Kolaborasi": { aspect: "Kolaborasi & Kerjasama", prompt: "kontribusi aktif dan kemampuan berbagi peran dalam tim." },
    "Kemandirian": { aspect: "Kemandirian", prompt: "tingkat inisiatif dan tanggung jawab terhadap tugas pribadi." },
    "Kesehatan": { aspect: "Kesehatan & Higienitas", prompt: "kesadaran menjaga kesehatan fisik dan kebersihan lingkungan." },
    "Komunikasi": { aspect: "Komunikasi", prompt: "kemampuan menyampaikan gagasan dengan santun dan efektif." },
    // Topik KBC
    "1. Cinta Allah Swt. dan Rasul-Nya": { aspect: "Cinta Allah & Rasul", prompt: "pengenalan kebesaran Allah melalui obyek pembelajaran." },
    "2. Cinta Ilmu": { aspect: "Cinta Ilmu", prompt: "antusiasme dalam menemukan hal baru dan ketekunan belajar." },
    "3. Cinta Lingkungan": { aspect: "Cinta Lingkungan", prompt: "kepedulian nyata terhadap kelestarian alam dan makhluk hidup." },
    "4. Cinta Diri dan Sesama Manusia": { aspect: "Cinta Diri & Sesama", prompt: "apresiasi terhadap bakat diri dan sikap menolong sesama teman." },
    "5. Cinta Tanah Air": { aspect: "Cinta Tanah Air", prompt: "rasa memiliki dan bangga terhadap identitas bangsa dan madrasah." }
  };

  const kbcTopicDescriptions: Record<string, string> = {
    "1. Cinta Allah Swt. and Rasul-Nya": "Menanamkan rasa syukur dan ketaatan kepada Sang Pencipta melalui kekaguman akan keteraturan alam semesta. Murid diajak mengenal sifat-sifat Allah melalui ciptaan-Nya, serta meneladani kemuliaan akhlak Rasulullah SAW dalam berinteraksi dengan sesama dan alam, menjadikan setiap aktivitas belajar sebagai bentuk ibadah.",
    "2. Cinta Ilmu": "Mendorong keingintahuan yang tinggi (curiosity) sebagai bekal pembelajar sepanjang hayat. Topik ini menekankan kegemaran membaca, semangat bereksperimen, dan ketekunan dalam menggali pengetahuan baru, meyakini bahwa menuntut ilmu adalah kewajiban yang meninggikan derajat manusia di hadapan Allah.",
    "3. Cinta Lingkungan": "Mengajak murid untuk memiliki kesadaran ekologis sebagai khalifah di bumi. Murid didorong untuk menyayangi alam sekitarnya, menjaga kebersihan, memelihara tanaman, menghemat energi, dan melestarikan makhluk hidup sebagai wujud cinta kepada Sang Pencipta yang telah memberikan alam sebagai amanah.",
    "4. Cinta Diri dan Sesama Manusia": "Membangun harga diri yang positif dan kesehatan jiwa raga. Murid diajarkan untuk menghargai potensi diri, menjaga kesehatan fisik, serta memupuk empati, kasih sayang, dan sikap toleran terhadap perbedaan. Fokusnya adalah menciptakan harmoni sosial melalui tutur kata yang santun dan tindakan saling menolong.",
    "5. Cinta Tanah Air": "Menumbuhkan rasa bangga dan cinta terhadap identitas bangsa serta kekayaan budaya Indonesia. Murid diajak untuk menjaga keutuhan sosial, menghormati simbol-simbol negara, dan berkontribusi aktif dalam memajukan lingkungan terdekatnya (madrasah dan masyarakat) sebagai wujud patriotisme yang beradab."
  };

  const selectedDimensions = (data.dimensi ? data.dimensi.split(', ').map(s => s.trim()) : []).filter(item => rubricContent[item]);
  const selectedKBC = (data.topik ? data.topik.split(', ').map(s => s.trim()) : []).filter(item => rubricContent[item]);
  const selectedItems = [...selectedDimensions, ...selectedKBC];
  
  const getIntegrationNarrative = () => {
    if (data.materi_integrasi) return data.materi_integrasi;
    if (selectedItems.length === 0) return `Kegiatan ini mengintegrasikan penguatan iman melalui rasa syukur atas ciptaan Allah, kepedulian terhadap lingkungan sekitar, dan pencapaian TP: ${data.tujuan}.`;
    
    const kbcPart = selectedKBC.length > 0 
      ? `penginternalisasian nilai ${selectedKBC.map(t => t.includes('. ') ? t.split('. ')[1] : t).join(", ")} (${selectedKBC.map(t => rubricContent[t]?.aspect).join(", ")})`
      : "";
    
    const dplPart = selectedDimensions.length > 0
      ? `penguatan dimensi ${selectedDimensions.join(", ")} yang menitikberatkan pada aspek ${selectedDimensions.map(d => rubricContent[d]?.aspect).join(" serta ")}`
      : "";
      
    return `Materi ini disusun dengan mengintegrasikan ${kbcPart}${kbcPart && dplPart ? " serta " : ""}${dplPart}. Pendekatan Kurikulum Berbasis Cinta (KBC) ini memastikan bahwa setiap aktivitas dalam proyek "${data.nama_kegiatan}" tidak hanya memenuhi capaian kognitif, tetapi juga membentuk karakter murid yang beradab dan penuh kasih sayang sesuai target: ${data.tujuan}.`;
  };

  const getLearningObjectives = () => {
    if (!data.tujuan) return ["Menentukan target pencapaian sesuai tema kegiatan."];
    
    // Split by common delimiters if the user already provided multiple
    const userObjectives = data.tujuan.split(/[;\n]/).map(o => o.trim()).filter(o => o.length > 5);
    
    // If only one objective, augment it contextually
    const objectives = userObjectives.length > 0 ? [...userObjectives] : [data.tujuan];
    
    if (objectives.length === 1) {
      // Add an objective related to Nilai Panca Cinta (KBC) if applicable
      if (selectedKBC.length > 0) {
        const kbcName = selectedKBC[0].includes(". ") ? selectedKBC[0].split(". ")[1] : selectedKBC[0];
        objectives.push(`Menginternalisasi nilai ${kbcName} melalui praktik nyata selama tahapan proyek.`);
      } else {
        objectives.push("Menguatkan karakter adab dan kasih sayang dalam interaksi selama kegiatan.");
      }

      // Add an objective related to the duration/complexity
      const jp = parseInt(data.alokasi_jp || "0", 10);
      if (jp > 4) {
        objectives.push(`Berkolaborasi secara aktif dalam kelompok untuk menyelesaikan tantangan proyek "${data.nama_kegiatan}".`);
      }
    }

    return objectives;
  };

  const integrationText = getIntegrationNarrative();
  const learningObjectives = getLearningObjectives();

  const sections = [
    "INFORMASI UMUM",
    "IDENTIFIKASI",
    "DESAIN PEMBELAJARAN",
    "DESKRIPSI KEGIATAN",
    "LANGKAH-LANGKAH KEGIATAN",
    "ASESMEN"
  ];

  const getSectionHeader = (index: number) => {
    const letter = String.fromCharCode(65 + index);
    return (
      <h2 className="bg-primary-700 text-white px-2 py-1 font-bold text-base mb-2 flex justify-between items-center group transition-colors">
        <span>{letter}. {sections[index]}</span>
        <button 
          onClick={() => onEdit(index)}
          className="bg-white/20 hover:bg-white/40 text-[10px] px-2 py-0.5 rounded transition-colors flex items-center gap-1 print:hidden opacity-0 group-hover:opacity-100"
        >
          <span className="font-normal text-[8px] uppercase tracking-wider">Perbaiki</span>
        </button>
      </h2>
    );
  };

  return (
    <div id="printable-module" className="bg-white dark:bg-neutral-900 p-8 md:p-12 shadow-lg border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-200 font-sans leading-relaxed max-w-[21cm] mx-auto mb-10 overflow-hidden transition-colors duration-300 print:shadow-none print:border-none print:p-0">
      {/* Header with Logo and Madrasah Name */}
      <div className="flex items-center gap-6 border-b-4 border-double border-black dark:border-neutral-100 pb-4 mb-6">
        {data.logo_url && (
          <img src={data.logo_url} alt="Logo" className="w-20 h-20 object-contain print:brightness-0" />
        )}
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold uppercase dark:text-white text-black">Perencanaan Proyek Kokurikuler</h1>
          <p className="text-lg font-serif italic text-primary-800 dark:text-primary-400 transition-colors print:text-black">Kurikulum Berbasis Cinta (KBC)</p>
          <p className="text-base font-bold uppercase tracking-wider dark:text-neutral-400 text-gray-900">{data.nama_madrasah}</p>
        </div>
      </div>

      <section className="mb-6">
        {getSectionHeader(0)}
        <table className="w-full border-none text-sm">
          <tbody>
            <tr>
              <td className="w-40 font-semibold text-primary-900 dark:text-primary-400 py-1 transition-colors">Nama Madrasah</td>
              <td className="py-1">:<span className="ml-2 dark:text-neutral-300">{data.nama_madrasah}</span></td>
            </tr>
            <tr>
              <td className="font-semibold text-primary-900 dark:text-primary-400 py-1 transition-colors">Fase/ Kelas</td>
              <td className="py-1">:<span className="ml-2 dark:text-neutral-300">{data.fase_kelas}</span></td>
            </tr>
            <tr>
              <td className="font-semibold text-primary-900 dark:text-primary-400 py-1 transition-colors">Semester</td>
              <td className="py-1">:<span className="ml-2 dark:text-neutral-300">{data.semester}</span></td>
            </tr>
            <tr>
              <td className="font-semibold text-primary-900 dark:text-primary-400 py-1 transition-colors">Tahun Pelajaran</td>
              <td className="py-1">:<span className="ml-2 dark:text-neutral-300">{data.tahun_pelajaran}</span></td>
            </tr>
            <tr>
              <td className="font-semibold text-primary-900 dark:text-primary-400 py-1 transition-colors">Tema Kegiatan</td>
              <td className="py-1">:<span className="ml-2 font-bold text-primary-800 dark:text-primary-300 transition-colors">{data.nama_kegiatan}</span></td>
            </tr>
            <tr>
              <td className="font-semibold text-primary-900 dark:text-primary-400 py-1 transition-colors">Jenis Kokurikuler</td>
              <td className="py-1">:<span className="ml-2 dark:text-neutral-300">{data.jenis_kokurikuler}</span></td>
            </tr>
            <tr>
              <td className="font-semibold text-primary-900 dark:text-primary-400 py-1 transition-colors">Alokasi Waktu</td>
              <td className="py-1">:<span className="ml-2 dark:text-neutral-300">{data.alokasi_jp} JP</span></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        {getSectionHeader(1)}
        <div className="pl-4 mt-2 space-y-4 text-sm">
          <table className="w-full border-none">
            <tbody>
              <tr>
                <td className="py-1 align-top"><p className="font-bold text-primary-900 dark:text-primary-400 transition-colors">Karakteristik Peserta Didik</p></td>
              </tr>
              <tr>
                <td className="pb-3 text-gray-700 dark:text-neutral-300 leading-relaxed text-justify">{data.karakteristik}</td>
              </tr>
              <tr>
                <td className="py-1"><p className="font-bold text-primary-900 dark:text-primary-400 transition-colors">Nama Kegiatan</p></td>
              </tr>
              <tr>
                <td className="pb-3 text-gray-700 dark:text-neutral-300 font-medium">{data.nama_kegiatan}</td>
              </tr>
              <tr>
                <td className="py-1"><p className="font-bold text-primary-900 dark:text-primary-400 transition-colors">Dimensi Profil Lulusan</p></td>
              </tr>
              <tr>
                <td className="pb-3">
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {selectedDimensions.length > 0 ? selectedDimensions.map((d, i) => (
                      <li key={i} className="text-gray-700 dark:text-neutral-300">
                        <span className="font-bold text-primary-800 dark:text-primary-300 transition-colors">{d}</span>
                      </li>
                    )) : <li className="text-xs italic text-gray-400 dark:text-neutral-600">Belum dipilih</li>}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="py-1"><p className="font-bold text-primary-900 dark:text-primary-400 transition-colors">Topik Panca Cinta (KBC)</p></td>
              </tr>
              <tr>
                <td className="pb-3">
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {data.topik ? data.topik.split(', ').map((t, i) => (
                      <li key={i}>
                        <span className="text-primary-700 dark:text-primary-400 font-medium transition-colors">{t.includes('. ') ? t.split('. ')[1] : t}</span>
                      </li>
                    )) : <li className="text-xs italic text-gray-400 dark:text-neutral-600">-</li>}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="py-1"><p className="font-bold text-primary-900 dark:text-primary-400 transition-colors">Materi Integrasi KBC</p></td>
              </tr>
              <tr>
                <td className="pb-3 text-gray-700 dark:text-neutral-300 leading-relaxed italic">{integrationText}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-6">
        {getSectionHeader(2)}
        <div className="pl-4 mt-2 space-y-4 text-sm">
          <table className="w-full border-none">
            <tbody>
              {[
                { label: "Tema Kegiatan", value: <span className="font-bold text-primary-800 dark:text-primary-300 transition-colors">{data.nama_kegiatan}</span> },
                { 
                  label: "Tujuan Pembelajaran", 
                  value: (
                    <ul className="list-disc pl-5 space-y-1">
                      {learningObjectives.map((tp, i) => (
                        <li key={i} className="text-gray-700 dark:text-neutral-300">{tp}</li>
                      ))}
                    </ul>
                  ) 
                },
                { label: "Praktik Pedagogis", value: <p className="text-gray-700 dark:text-neutral-300">{pedagogisDesc[data.praktik_pedagogis || 'PjBL']}</p> },
                { label: "Lingkungan", value: <p className="text-gray-700 dark:text-neutral-300 leading-relaxed text-justify">Penguatan karakter melalui kegiatan "{data.nama_kegiatan}" dengan mengedepankan pendekatan yang memuliakan dan kasih sayang melalui praktik yang dilakukan secara berkesadaran, bermakna, dan menggembirakan pada ekosistem yang mendukung.</p> },
                { 
                  label: "Kemitraan", 
                  value: (
                    <div className="space-y-1.5 text-[11px] leading-tight text-gray-700 dark:text-neutral-400">
                      <p>• <strong>Murid</strong>, sebagai aktor utama dalam kegiatan ini.</p>
                      <p>• <strong>Madrasah</strong>, kolaborasi semua guru dengan membimbing refleksi pasca kegiatan.</p>
                      <p>• <strong>Keluarga</strong>, membantu anak memahami bahwa nilai {selectedKBC.length > 0 ? selectedKBC.map(t => t.includes('. ') ? t.split('. ')[1] : t).join(", ") : "Panca Cinta"} juga penting diterapkan di rumah.</p>
                    </div>
                  )
                },
                { label: "Pemanfaatan Digital", value: <p className="text-gray-700 dark:text-neutral-300">Dokumentasi Portofolio Berbasis Digital.</p> },
              ].map((item, idx) => (
                <React.Fragment key={idx}>
                  <tr>
                    <td className="py-1 font-bold text-primary-900 dark:text-primary-400 transition-colors">{item.label}</td>
                  </tr>
                  <tr>
                    <td className="pb-3 text-gray-800 dark:text-neutral-200">{item.value}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-6">
        {getSectionHeader(3)}
        <div className="pl-4 mt-2 text-sm text-justify leading-relaxed markdown-content text-gray-800 dark:text-neutral-200">
          {data.deskripsi_kegiatan_ai ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.deskripsi_kegiatan_ai}
            </ReactMarkdown>
          ) : (
            <p className="italic text-gray-500 dark:text-neutral-600">Deskripsi otomatis akan muncul di sini setelah Anda mengklik 'Generate AI Content'...</p>
          )}
        </div>
      </section>

      <section className="mb-6">
        {getSectionHeader(4)}
        <div className="pl-4 mt-2 text-sm">
          <table className="w-full border-collapse border border-gray-100 dark:border-neutral-800">
            <tbody>
              {[
                { 
                  title: "Persiapan (1 Minggu Sebelum Kegiatan)", 
                  value: data.langkah_tahap_1, 
                  jp: jp1,
                  default: `a. Guru melakukan observasi lingkungan terkait tema "${data.nama_kegiatan}".\nb. Identifikasi alat dan bahan yang dibutuhkan (berbasis cinta lingkungan).\nc. Sosialisasi kepada murid mengenai tujuan dan nilai Panca Cinta yang akan dipraktikkan.`
                },
                { 
                  title: "Pelaksanaan (Hari-H Kegiatan)", 
                  value: data.langkah_tahap_2, 
                  jp: jp2,
                  default: `a. Pembukaan dengan doa dan penguatan niat belajar sebagai ibadah.\nb. Aktivitas Inti: Murid melakukan proyek sesuai panduan teknis yang memuliakan adab.\nc. Eksplorasi: Murid mengamati hubungan materi dengan kebesaran Allah Swt.` 
                },
                { 
                  title: "Tindak Lanjut (Pasca Kegiatan)", 
                  value: data.langkah_tahap_3, 
                  jp: jp3,
                  default: `a. Refleksi Bersama: Guru membimbing murid untuk merasakan makna kasih sayang dalam kegiatan.\nb. Evaluasi Portofolio: Dokumentasi digital hasil karya murid.\nc. Rencana Aksi: Murid berkomitmen mempraktikkan nilai "${selectedKBC.length > 0 ? selectedKBC[0] : 'Cinta'}" secara berkelanjutan di rumah.`
                },
              ].map((step, idx) => (
                <React.Fragment key={idx}>
                  <tr className="bg-gray-50/50 dark:bg-neutral-800/50">
                    <td className="border border-gray-100 dark:border-neutral-800 p-2 font-bold text-primary-900 dark:text-primary-300 transition-colors">
                      {idx + 1}. {step.title} (Alokasi: {step.jp} JP)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-100 dark:border-neutral-800 p-3 text-gray-700 dark:text-neutral-300 leading-relaxed text-justify">
                      {step.value ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {step.value}
                        </ReactMarkdown>
                      ) : (
                        <div className="italic text-gray-500 dark:text-neutral-600 whitespace-pre-line">
                          {step.default}
                        </div>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-6 page-break-before">
        {getSectionHeader(5)}
        <div className="pl-4 mt-2 text-sm space-y-4">
          <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 p-4 rounded-lg shadow-sm transition-colors">
            <p className="font-bold text-primary-800 dark:text-primary-300 mb-2 flex items-center gap-2 transition-colors">
              <span className="bg-primary-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
              Asesmen Formatif (Awal & Proses)
            </p>
            <div className="text-xs leading-relaxed text-gray-700 dark:text-neutral-400 pl-7">
              <p className="mb-2"><strong>Tujuan:</strong> Memantau perkembangan adab, kemandirian, dan keterlibatan murid secara berkesinambungan.</p>
              <p><strong>Teknik:</strong> Observasi Langsung & Catatan Anekdotal.</p>
              <p className="mt-1 italic text-primary-700 dark:text-primary-400">Dilakukan setiap pertemuan untuk mencatat momen "Aha!" atau kendala karakter murid.</p>
            </div>
          </div>
          
          <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 p-4 rounded-lg shadow-sm transition-colors">
            <p className="font-bold text-primary-800 dark:text-primary-300 mb-2 flex items-center gap-2 transition-colors">
              <span className="bg-primary-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
              Asesmen Sumatif (Akhir Proyek)
            </p>
            <div className="text-xs leading-relaxed text-gray-700 dark:text-neutral-400 pl-7">
              <p className="mb-2"><strong>Tujuan:</strong> Mengukur pencapaian target dimensi Profil Lulusan dan nilai Panca Cinta di akhir kegiatan.</p>
              <p><strong>Teknik:</strong> Penilaian Kinerja (Performance Assessment).</p>
              <p className="mt-1">Instrumen menggunakan **Rubrik Penilaian** yang mencakup aspek {selectedItems.map(item => rubricContent[item]?.aspect).join(", ")}.</p>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-50 dark:bg-neutral-800 p-3 rounded border border-dashed border-gray-300 dark:border-neutral-700 transition-colors">
            <p className="font-bold text-xs mb-1 text-gray-600 dark:text-neutral-500 uppercase tracking-tighter">Lampiran Instrumen:</p>
            <p className="text-[10px] text-gray-500 dark:text-neutral-600 italic">Silakan merujuk pada Lembar Lampiran untuk instrumen tabel Catatan Anekdotal dan Rubrik Penilaian Kinerja yang lengkap.</p>
          </div>
        </div>
      </section>

      {/* NEW: Appendix Section */}
      <section id="appendix-section" className="mt-10 border-t-2 border-dashed border-gray-300 dark:border-neutral-700 pt-8 page-break-before transition-colors">
        <h2 className="bg-primary-900 text-white px-2 py-1 font-bold text-base mb-4 flex justify-between transition-colors">
          <span>LAMPIRAN MODUL: INSTRUMEN PENILAIAN</span>
          <span className="text-xs font-normal self-center">Kurikulum Berbasis Cinta</span>
        </h2>
        <div className="space-y-8">
          {/* Formatif Table: Catatan Anekdotal */}
          <div className="page-break-before">
            <div className="flex justify-between items-end mb-3 border-b-2 border-black pb-1 transition-colors">
              <h3 className="text-base font-bold text-black uppercase">Lampiran 1: Instrumen Penilaian Formatif (Catatan Anekdotal)</h3>
              <p className="text-[10px] italic text-gray-600">Metode: Observasi & Dokumentasi Perilaku</p>
            </div>
            <table className="w-full border-collapse border-2 border-black text-[11px] lampiran-table">
              <thead>
                <tr className="bg-primary-800 text-white uppercase text-[10px] text-center">
                  <th className="border-2 border-black p-2 w-10">No</th>
                  <th className="border-2 border-black p-2 w-32">Hari/Tanggal</th>
                  <th className="border-2 border-black p-2 w-40">Nama Murid</th>
                  <th className="border-2 border-black p-2 w-36">Aspek Diamati</th>
                  <th className="border-2 border-black p-2">Catatan Kejadian / Perilaku</th>
                  <th className="border-2 border-black p-2 w-40">Tindak Lanjut Guru</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="h-12">
                    <td className="border border-black p-2 text-center font-mono">{i}</td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2 text-gray-400 italic text-[10px]">... deskripsi perilaku murid ...</td>
                    <td className="border border-black p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summative Table: Rubrik Penilaian Kinerja */}
          <div className="page-break-before">
            <div className="flex justify-between items-end mb-3 border-b-2 border-black pb-1 transition-colors">
              <h3 className="text-base font-bold text-black uppercase">Lampiran 2: Instrumen Penilaian Sumatif (Rubrik Penilaian Kinerja)</h3>
              <p className="text-[10px] italic text-gray-600">Objek: Proyek "{data.nama_kegiatan}"</p>
            </div>
            <table className="w-full border-collapse border-2 border-black text-[10px] lampiran-table">
              <thead>
                <tr className="bg-primary-800 text-white uppercase font-bold text-center">
                  <th className="border-2 border-black p-2 w-28">Indikator (DPL/KBC)</th>
                  <th className="border-2 border-black p-2 w-32">Bukti Pencapaian</th>
                  <th className="border-2 border-black p-2">Mulai Berkembang (1)</th>
                  <th className="border-2 border-black p-2">Sedang Berkembang (2)</th>
                  <th className="border-2 border-black p-2">Berkembang Sesuai Harapan (3)</th>
                  <th className="border-2 border-black p-2">Sangat Berkembang (4)</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.length > 0 ? (
                  selectedItems.map((item, index) => {
                    const content = rubricContent[item];
                    const label = item.includes('.') ? item.split('. ')[1] : item;
                    return (
                      <tr key={index} className="h-16">
                        <td className="border border-black p-2 font-bold text-black bg-gray-50/50">{label}</td>
                        <td className="border border-black p-2 font-medium">{content.aspect}</td>
                        <td className="border border-black p-2 text-center text-gray-300"></td>
                        <td className="border border-black p-2 text-center text-gray-300"></td>
                        <td className="border border-black p-2 text-center text-gray-300"></td>
                        <td className="border border-black p-2 text-center text-gray-300"></td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="border border-black p-6 text-center italic text-gray-500">Pilih Dimensi atau Topik KBC untuk melihat rubrik spesifik.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="page-break-before">
            <h3 className="text-base mb-3 uppercase font-bold text-black border-b-2 border-black pb-1">Lampiran 3: Penjelasan Detail Topik Panca Cinta (KBC)</h3>
            <table className="w-full border-collapse border-2 border-black text-[11px] lampiran-table">
              <thead>
                <tr className="bg-primary-800 text-white uppercase font-bold">
                  <th className="border-2 border-black p-3 w-40 text-left">Topik Panca Cinta</th>
                  <th className="border-2 border-black p-3 text-left">Deskripsi & Internalisasi Nilai</th>
                </tr>
              </thead>
              <tbody>
                {selectedKBC.length > 0 ? selectedKBC.map((topic, i) => (
                  <tr key={i} className="h-auto">
                    <td className="border border-black p-3 font-bold text-black bg-gray-50/50" id={`desc-${topic.split('.')[0]}`}>
                      {topic.includes('. ') ? topic.split('. ')[1] : topic}
                    </td>
                    <td className="border border-black p-3 text-justify leading-relaxed">
                      {kbcTopicDescriptions[topic] || "Penjelasan topik sedang dikembangkan untuk mendukung integrasi nilai-nilai Panca Cinta dalam modul ini."}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={2} className="border border-black p-6 text-center italic text-gray-500">Tidak ada topik KBC yang dipilih.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="page-break-before">
            <h3 className="text-base mb-3 uppercase font-bold text-black border-b-2 border-black pb-1">Lampiran 4: Panduan Observasi & Refleksi</h3>
            <table className="w-full border-collapse border-2 border-black text-[11px] lampiran-table">
              <tbody>
                <tr>
                  <td className="border-2 border-black p-4 w-1/2 bg-gray-50/50">
                    <h4 className="font-bold text-xs mb-2 uppercase text-black">A. Panduan Observasi Guru</h4>
                    <p className="italic text-gray-800 leading-relaxed text-justify">
                      Guru mengamati perilaku murid selama kegiatan. Fokus pengamatan pada perubahan sikap yang signifikan terkait adab, kemandirian, dan antusiasme dalam belajar sebagai wujud cinta ilmu dan lingkungan. Catat hal-hal positif yang muncul sebagai dasar bimbingan berkelanjutan.
                    </p>
                  </td>
                  <td className="border-2 border-black p-4 w-1/2">
                    <h4 className="font-bold text-xs mb-2 uppercase text-black">B. Lembar Refleksi Murid</h4>
                    <p className="italic text-gray-800 leading-relaxed text-justify">
                      Pancingan Refleksi untuk Murid: "Apa yang paling aku syukuri hari ini saat berkegiatan?", "Bagaimana perasaanku saat berhasil menyelesaikan tantangan proyek?", "Adab dan kasih sayang apa yang sudah aku praktikkan hari ini kepada teman atau lingkungan?"
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* Signatures and Footer */}
      <div className="mt-12 text-sm break-inside-avoid">
        <table className="w-full border-none">
          <tbody>
            <tr>
              <td colSpan={2} className="text-right py-4 dark:text-neutral-400">
                {data.titimangsa || "...................., ...................."}
              </td>
            </tr>
            <tr className="text-center">
              <td className="w-1/2 py-2 dark:text-neutral-300">
                <p>Mengetahui,</p>
                <p className="mb-20 pb-16">Kepala Madrasah,</p>
                <p className="font-bold underline uppercase dark:text-white">{data.nama_kepala || "........................................."}</p>
                <p>NIP. {data.nip_kepala || "........................................."}</p>
              </td>
              <td className="w-1/2 py-2 dark:text-neutral-300">
                <p className="invisible">Guru,</p>
                <p className="mb-20 pb-16">Guru/ Fasilitator,</p>
                <p className="font-bold underline uppercase dark:text-white">{data.nama_guru || "........................................."}</p>
                <p>NIP. {data.nip_guru || "........................................."}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
