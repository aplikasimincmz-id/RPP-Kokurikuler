export interface ModuleData {
  // Identity
  nama_madrasah: string;
  nama_kepala: string;
  nip_kepala: string;
  nama_guru: string;
  nip_guru: string;
  tahun_pelajaran: string;
  logo_url: string;
  titimangsa: string;

  // Module Content
  fase_kelas: string;
  semester: string;
  alokasi_jp: string;
  nama_kegiatan: string;
  jenis_kokurikuler: string;
  karakteristik: string;
  dimensi: string;
  topik: string;
  tujuan: string;
  harian: string;
  mingguan: string;
  bulanan: string;
  tahunan: string;
  praktik_pedagogis: "PjBL" | "PBL" | "Discovery" | "Experiential";

  // AI Generated Sections
  deskripsi_kegiatan_ai?: string;
  langkah_tahap_1?: string;
  langkah_tahap_2?: string;
  langkah_tahap_3?: string;
  materi_integrasi?: string;
}
