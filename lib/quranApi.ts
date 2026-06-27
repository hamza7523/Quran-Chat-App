/**
 * Al-Quran Cloud API wrapper
 * Base URL: https://api.alquran.cloud/v1
 * Completely free, no API key, no rate limit published.
 * Docs: https://alquran.cloud/api
 */

const BASE = 'https://api.alquran.cloud/v1';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlQuranAyah = {
  number: number;           // global ayah number (1–6236)
  numberInSurah: number;
  text: string;             // Arabic or translated text
  surah: {
    number: number;
    name: string;           // Arabic name
    englishName: string;    // e.g. "Al-Fatiha"
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  };
  audio?: string;           // audio URL for this ayah
};

export type DailyAyah = {
  arabicText: string;
  englishText: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  reference: string;        // e.g. "Al-Fatiha 1:1"
};

export type SearchResult = {
  ayahNumber: number;
  surahNumber: number;
  surahName: string;
  arabicText: string;
  englishText: string;
  reference: string;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Al-Quran API error: ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(`Al-Quran API: ${json.status}`);
  return json.data as T;
}

// ─── Daily Ayah ───────────────────────────────────────────────────────────────

export async function fetchDailyAyah(): Promise<DailyAyah> {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  // Distribute across 6236 ayahs, skip 0
  const ayahNumber = (dayOfYear % 6236) + 1;

  // Fetch Arabic and English in parallel
  const [arabicData, englishData] = await Promise.all([
    apiFetch<AlQuranAyah>(`/ayah/${ayahNumber}/quran-uthmani`),
    apiFetch<AlQuranAyah>(`/ayah/${ayahNumber}/en.asad`),
  ]);

  return {
    arabicText: arabicData.text,
    englishText: englishData.text,
    surahName: englishData.surah.englishName,
    surahNumber: englishData.surah.number,
    ayahNumber: englishData.numberInSurah,
    reference: `${englishData.surah.englishName} ${englishData.surah.number}:${englishData.numberInSurah}`,
  };
}

// ─── Fetch Single Ayah ────────────────────────────────────────────────────────

export async function fetchAyah(
  surahNumber: number,
  ayahNumber: number
): Promise<{ arabic: string; english: string; reference: string }> {
  const ref = `${surahNumber}:${ayahNumber}`;
  const [arabicData, englishData] = await Promise.all([
    apiFetch<AlQuranAyah>(`/ayah/${ref}/quran-uthmani`),
    apiFetch<AlQuranAyah>(`/ayah/${ref}/en.asad`),
  ]);

  return {
    arabic: arabicData.text,
    english: englishData.text,
    reference: `${englishData.surah.englishName} ${surahNumber}:${ayahNumber}`,
  };
}

// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * Keyword search across the whole Quran (English translation).
 * Returns up to `limit` results with BOTH English and Arabic text.
 */
export async function searchQuran(query: string, limit: number = 5): Promise<SearchResult[]> {
  try {
    // 1. Check if the user typed a specific reference (e.g., "2:255" or "Al-Baqarah 2:255")
    const referenceMatch = query.match(/(\d+:\d+)/);

    if (referenceMatch) {
      const ref = referenceMatch[1];
      
      // Fetch both languages using our helper
      const [arabicData, englishData] = await Promise.all([
        apiFetch<AlQuranAyah>(`/ayah/${ref}/quran-uthmani`),
        apiFetch<AlQuranAyah>(`/ayah/${ref}/en.asad`),
      ]);
      
      return [{
        ayahNumber: englishData.numberInSurah,
        surahNumber: englishData.surah.number,
        surahName: englishData.surah.englishName,
        arabicText: arabicData.text,
        englishText: englishData.text,
        reference: `${englishData.surah.englishName} ${englishData.surah.number}:${englishData.numberInSurah}`,
      }];
    }

    // 2. Otherwise, fallback to the standard keyword text search
    const searchUrl = `https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/en.asad`;
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (data.code === 200 && data.data && data.data.matches) {
      const englishMatches = data.data.matches.slice(0, limit);

      // ─── THE FIX: Fetch Arabic text for each English match in parallel ───
      const enrichedMatches = await Promise.all(
        englishMatches.map(async (match: any): Promise<SearchResult> => {
          let arabicText = '';
          try {
            const arabicData = await apiFetch<AlQuranAyah>(`/ayah/${match.surah.number}:${match.numberInSurah}/quran-uthmani`);
            arabicText = arabicData.text;
          } catch (e) {
            console.warn(`Could not fetch Arabic text for ${match.surah.number}:${match.numberInSurah}`);
          }

          return {
            ayahNumber: match.numberInSurah,
            surahNumber: match.surah.number,
            surahName: match.surah.englishName,
            arabicText: arabicText,
            englishText: match.text,
            reference: `${match.surah.englishName} ${match.surah.number}:${match.numberInSurah}`,
          };
        })
      );

      return enrichedMatches;
    }
    return [];
  } catch (error) {
    console.warn("Al-Quran API Error:", error);
    return []; 
  }
}

// ─── Fetch verses for Gemini context grounding ────────────────────────────────

export async function fetchVerseContext(
  refs: { surah: number; ayah: number }[]
): Promise<string> {
  const results = await Promise.all(
    refs.slice(0, 5).map(({ surah, ayah }) =>
      fetchAyah(surah, ayah).catch(() => null)
    )
  );

  return results
    .filter(Boolean)
    .map((r) => `[${r!.reference}]: "${r!.english}"`)
    .join('\n');
}