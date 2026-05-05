import { GoogleGenAI, Type } from "@google/genai";
import { ModuleData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateModuleContent(data: Partial<ModuleData>) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const prompt = `
    Anda adalah ahli kurikulum madrasah dan pengembang Kurikulum Berbasis Cinta (KBC).
    Berdasarkan data berikut, buatlah narasi untuk bagian E dan F modul ajar Kokurikuler MI.
    
    Data Input:
    - Nama Kegiatan: ${data.nama_kegiatan}
    - Tema: ${data.nama_kegiatan}
    - Topik Panca Cinta: ${data.topik}
    - Tujuan Pembelajaran: ${data.tujuan}
    - Fase/Kelas: ${data.fase_kelas}
    - Karakteristik Murid: ${data.karakteristik}
    
    Tugas:
    1. Buat narasi Deskripsi Kegiatan (Bagian E) yang menjelaskan alur kegiatan secara utuh, menyatu, dan terintegrasi KBC.
    2. Buat narasi Langkah-Langkah Kegiatan (Bagian F) yang terbagi menjadi 3 Tahap:
       - Tahap 1: Memahami (Exploration)
       - Tahap 2: Mengaplikasi (Action)
       - Tahap 3: Merefleksi (Reflection)
    
    Bahasa harus formal tetapi praktis (gaya guru MI), mengandung unsur keimanan (dzikir, syukur) dan cinta lingkungan.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          deskripsi_kegiatan_ai: { type: Type.STRING },
          langkah_tahap_1: { type: Type.STRING },
          langkah_tahap_2: { type: Type.STRING },
          langkah_tahap_3: { type: Type.STRING },
        },
        required: ["deskripsi_kegiatan_ai", "langkah_tahap_1", "langkah_tahap_2", "langkah_tahap_3"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("AI returned empty response");
  
  return JSON.parse(text) as {
    deskripsi_kegiatan_ai: string;
    langkah_tahap_1: string;
    langkah_tahap_2: string;
    langkah_tahap_3: string;
  };
}

export async function generateKarakteristik(data: Partial<ModuleData>) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const prompt = `
    Tugas: Buat narasi profil karakteristik peserta didik (1-2 paragraf) untuk Modul Kurikulum Merdeka Madrasah.
    
    Data Input:
    - Nama Kegiatan/Tema: ${data.nama_kegiatan}
    - Fase/Kelas: ${data.fase_kelas}
    - Jenis Kokurikuler: ${data.jenis_kokurikuler}
    - Topik Panca Cinta: ${data.topik}
    
    Instruksi Khusus:
    1. JANGAN gunakan kalimat pengantar (seperti: "Tentu, ini narasinya..." atau "Sebagai ahli...").
    2. LANGSUNG mulai dengan deskripsi profil murid.
    3. Deskripsi harus spesifik menghubungkan tahapan perkembangan anak pada ${data.fase_kelas} dengan antusiasme mereka terhadap tema "${data.nama_kegiatan}".
    4. Gunakan diksi yang santun, edukatif, dan penuh kasih sayang (Nilai Panca Cinta).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  // Remove potential markdown code blocks if the model wraps text in them
  let text = response.text || "";
  text = text.replace(/```markdown\n|```/g, "").trim();
  
  return text;
}
