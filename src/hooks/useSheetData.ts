import { useState, useEffect, useCallback } from "react";
import type { Apartment, ApartmentType, Listing } from "@/data/mockApartments";

const SHEET_URLS = [
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTNbiO170sxkjo_rgOvvis5eTZP0VYfm1aYetd792BcWwXs-b1BsRtX9DQha6LlZkfRIIE_4IIeplIM/pub?gid=0&single=true&output=csv",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTNbiO170sxkjo_rgOvvis5eTZP0VYfm1aYetd792BcWwXs-b1BsRtX9DQha6LlZkfRIIE_4IIeplIM/pub?gid=614527479&single=true&output=csv",
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTNbiO170sxkjo_rgOvvis5eTZP0VYfm1aYetd792BcWwXs-b1BsRtX9DQha6LlZkfRIIE_4IIeplIM/pub?gid=653792883&single=true&output=csv",
];

interface RawRow {
  지역: string;
  지역2: string;
  단지명: string;
  동: string;
  매물방식: string;
  전용: string;
  층: string;
  특이사항: string;
  확인일: string;
  가격숫자: number;
  월세: string;
  최소P: string;
  최대P: string;
  방향: string;
  부동산: string;
  매물URL: string;
}

// Major region mapping (same as HTML)
const REGION_MAP: string[][] = [
  ["서울"], ["경기"], ["인천"], ["부산"], ["대구"], ["대전"],
  ["광주"], ["울산"], ["세종"], ["충북", "충청북"], ["충남", "충청남"],
  ["전북", "전라북"], ["전남", "전라남"], ["경북", "경상북"],
  ["경남", "경상남"], ["강원"], ["제주"],
];

function getMajor(region: string): string {
  for (const m of REGION_MAP) {
    for (const prefix of m) {
      if (region.startsWith(prefix)) return m[0];
    }
  }
  return region;
}

function csvParse(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const nx = text[i + 1];
    if (inQ) {
      if (ch === '"' && nx === '"') { cell += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cell += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n' || (ch === '\r' && nx === '\n')) {
        row.push(cell);
        if (row.some(c => c.trim())) result.push(row);
        row = []; cell = '';
        if (ch === '\r') i++;
      } else cell += ch;
    }
  }
  if (cell || row.length) { row.push(cell); if (row.some(c => c.trim())) result.push(row); }
  return result;
}

function parseP(text: string): number | null {
  if (!text || !text.trim()) return null;
  let s = text.trim();
  let neg = false;
  if (s.startsWith('-')) { neg = true; s = s.substring(1).trim(); }
  let total = 0;
  const eokM = s.match(/(\d+)\s*억/);
  if (eokM) total += parseInt(eokM[1]) * 1e8;
  let manPart = s.replace(/\d+\s*억\s*/, '').trim();
  if (!manPart && !eokM) manPart = s;
  if (manPart) {
    const num = parseFloat(manPart.replace(/,/g, ''));
    if (!isNaN(num)) total += num * 1e4;
  }
  return neg ? -total : total;
}

function numParse(s: string): number {
  return parseFloat((s || '').replace(/,/g, '')) || 0;
}

async function fetchOne(url: string): Promise<string | null> {
  const proxies = [
    url,
    'https://api.allorigins.win/raw?url=' + encodeURIComponent(url),
    'https://corsproxy.io/?' + encodeURIComponent(url),
  ];
  for (const u of proxies) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(u, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) continue;
      const text = await res.text();
      if (text.length < 20) continue;
      return text;
    } catch { continue; }
  }
  return null;
}

function parseCSV(text: string): RawRow[] {
  const lines = csvParse(text);
  if (lines.length < 2) return [];

  const h = lines[0].map(s => s.trim());
  const fi = (kw: string[]) => h.findIndex(col => kw.every(k => col.includes(k)));
  const exact = (name: string) => h.findIndex(c => c.trim() === name);

  const I = {
    지역: exact('지역') >= 0 ? exact('지역') : fi(['지역']),
    지역명: fi(['지역명']) >= 0 ? fi(['지역명']) : -1,
    단지명: fi(['단지명']),
    동: exact('동'),
    매물방식: fi(['매물방식']),
    전용: fi(['전용']),
    층: exact('층'),
    특이사항: fi(['특이사항']),
    확인매물: fi(['확인매물']),
    거래가액: fi(['거래가액']),
    월세: fi(['월세']),
    최소P: fi(['최소P']) >= 0 ? fi(['최소P']) : exact('최소P'),
    최대P: fi(['최대P']) >= 0 ? fi(['최대P']) : exact('최대P'),
    방향: fi(['방향']),
    부동산: fi(['부동산']),
    매물URL: fi(['매물URL']) >= 0 ? fi(['매물URL']) : fi(['URL']),
  };

  const gc = (arr: string[], i: number) => (i >= 0 && i < arr.length) ? arr[i].trim() : '';
  const rows: RawRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const c = lines[i];
    const name = gc(c, I.단지명);
    if (!name) continue;
    const rawPrice = gc(c, I.거래가액);
    const priceMan = numParse(rawPrice);
    const price = priceMan > 0 && isFinite(priceMan) ? priceMan * 10000 : 0;

    rows.push({
      지역: gc(c, I.지역),
      지역2: gc(c, I.지역명),
      단지명: name,
      동: gc(c, I.동),
      매물방식: gc(c, I.매물방식),
      전용: gc(c, I.전용),
      층: gc(c, I.층),
      특이사항: gc(c, I.특이사항),
      확인일: gc(c, I.확인매물),
      가격숫자: price,
      월세: gc(c, I.월세),
      최소P: gc(c, I.최소P),
      최대P: gc(c, I.최대P),
      방향: gc(c, I.방향),
      부동산: gc(c, I.부동산),
      매물URL: gc(c, I.매물URL),
    });
  }
  return rows;
}

function buildApartments(rawData: RawRow[]): Apartment[] {
  const aptMap: Record<string, { 지역: string; 지역2: string; items: RawRow[] }> = {};
  rawData.forEach(d => {
    const k = d.단지명;
    if (!aptMap[k]) aptMap[k] = { 지역: d.지역, 지역2: d.지역2, items: [] };
    aptMap[k].items.push(d);
  });

  return Object.entries(aptMap).map(([name, data], idx) => {
    const typeMap: Record<string, RawRow[]> = {};
    data.items.forEach(d => {
      const k = String(Math.floor(parseFloat(d.전용)) || d.전용);
      if (!typeMap[k]) typeMap[k] = [];
      typeMap[k].push(d);
    });

    const types: ApartmentType[] = Object.entries(typeMap).map(([areaKey, items]) => {
      const areaM2 = parseFloat(areaKey) || 0;
      const listings: Listing[] = items
        .map(item => {
          const pVal = parseP(item.최소P);
          return {
            floor: item.층,
            area: item.전용 + '㎡',
            price: item.가격숫자 > 0 ? Math.round(item.가격숫자 / 10000) : 0, // convert to 만원
            premium: pVal !== null ? Math.round(pVal / 10000) : 0, // convert to 만원
            date: item.확인일,
            note: item.특이사항,
            dong: item.동,
            direction: item.방향,
            url: item.매물URL,
          };
        })
        .sort((a, b) => a.price - b.price);

      return {
        name: areaM2 + 'm²',
        areaPy: Math.round(areaM2 * 0.3025 * 10) / 10,
        areaM2,
        listings,
      };
    });

    const region = getMajor(data.지역);
    return {
      id: String(idx + 1),
      name,
      location: `${data.지역} ${data.지역2}`,
      region,
      subRegion: data.지역2,
      types,
    };
  });
}

export function useSheetData() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(SHEET_URLS.map(u => fetchOne(u)));
      const validResults = results.filter((t): t is string => t !== null && t.length > 0);
      if (!validResults.length) {
        setError("데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
        setLoading(false);
        return;
      }
      const allRaw: RawRow[] = [];
      validResults.forEach(text => {
        allRaw.push(...parseCSV(text));
      });
      const apts = buildApartments(allRaw);
      setApartments(apts);
    } catch (e: any) {
      setError("데이터 파싱 실패: " + (e?.message || "알 수 없는 오류"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { apartments, loading, error, refresh: loadData };
}
