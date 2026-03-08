export interface Listing {
  floor: string;
  area: string;
  price: number;
  premium: number;
  date: string;
  note: string;
  dong?: string;
  direction?: string;
  url?: string;
}

export interface ApartmentType {
  name: string;
  areaPy: number;
  areaM2: number;
  listings: Listing[];
}

export interface Apartment {
  id: string;
  name: string;
  location: string;
  region: string;
  subRegion: string;
  types: ApartmentType[];
}

export const mockApartments: Apartment[] = [
  {
    id: "1",
    name: "래미안 원베일리",
    location: "서울 서초구 반포동",
    region: "서울",
    subRegion: "서초구",
    types: [
      {
        name: "59A",
        areaPy: 24,
        areaM2: 59,
        listings: [
          { floor: "15층", area: "59.9㎡", price: 285000, premium: 32000, date: "2025.03", note: "로얄층 남향" },
          { floor: "8층", area: "59.9㎡", price: 275000, premium: 22000, date: "2025.03", note: "중층 조망권" },
          { floor: "3층", area: "59.9㎡", price: 268000, premium: 15000, date: "2025.02", note: "저층" },
        ],
      },
      {
        name: "84A",
        areaPy: 34,
        areaM2: 84,
        listings: [
          { floor: "22층", area: "84.9㎡", price: 385000, premium: 55000, date: "2025.03", note: "고층 한강뷰" },
          { floor: "12층", area: "84.9㎡", price: 365000, premium: 35000, date: "2025.03", note: "중층" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "디에이치 클래스트",
    location: "서울 강남구 개포동",
    region: "서울",
    subRegion: "강남구",
    types: [
      {
        name: "59B",
        areaPy: 24,
        areaM2: 59,
        listings: [
          { floor: "18층", area: "59.5㎡", price: 245000, premium: 28000, date: "2025.03", note: "탑층 남향" },
          { floor: "10층", area: "59.5㎡", price: 232000, premium: 15000, date: "2025.02", note: "" },
        ],
      },
      {
        name: "84B",
        areaPy: 34,
        areaM2: 84,
        listings: [
          { floor: "20층", area: "84.3㎡", price: 340000, premium: 48000, date: "2025.03", note: "고층 판상형" },
          { floor: "5층", area: "84.3㎡", price: 315000, premium: 23000, date: "2025.02", note: "저층" },
          { floor: "14층", area: "84.3㎡", price: 328000, premium: 36000, date: "2025.03", note: "중층 정남향" },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "올림픽파크포레온",
    location: "서울 강동구 둔촌동",
    region: "서울",
    subRegion: "강동구",
    types: [
      {
        name: "59A",
        areaPy: 24,
        areaM2: 59,
        listings: [
          { floor: "25층", area: "59.9㎡", price: 178000, premium: 12000, date: "2025.03", note: "고층" },
          { floor: "7층", area: "59.9㎡", price: 165000, premium: -1000, date: "2025.02", note: "마피" },
        ],
      },
      {
        name: "84C",
        areaPy: 34,
        areaM2: 84,
        listings: [
          { floor: "30층", area: "84.7㎡", price: 225000, premium: 18000, date: "2025.03", note: "최고층" },
          { floor: "15층", area: "84.7㎡", price: 215000, premium: 8000, date: "2025.03", note: "" },
          { floor: "4층", area: "84.7㎡", price: 205000, premium: -2000, date: "2025.01", note: "저층 마피" },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "힐스테이트 메디알레",
    location: "경기 과천시 별양동",
    region: "경기",
    subRegion: "과천시",
    types: [
      {
        name: "59A",
        areaPy: 24,
        areaM2: 59,
        listings: [
          { floor: "12층", area: "59.8㎡", price: 142000, premium: 8000, date: "2025.03", note: "역세권" },
        ],
      },
      {
        name: "84A",
        areaPy: 34,
        areaM2: 84,
        listings: [
          { floor: "18층", area: "84.2㎡", price: 198000, premium: 15000, date: "2025.03", note: "고층 조망" },
          { floor: "6층", area: "84.2㎡", price: 185000, premium: 2000, date: "2025.02", note: "" },
        ],
      },
    ],
  },
  {
    id: "5",
    name: "검단 파라곤센트럴시티",
    location: "인천 서구 원당동",
    region: "인천",
    subRegion: "서구",
    types: [
      {
        name: "59A",
        areaPy: 24,
        areaM2: 59,
        listings: [
          { floor: "10층", area: "59.6㎡", price: 42000, premium: -3000, date: "2025.03", note: "마피" },
          { floor: "20층", area: "59.6㎡", price: 45000, premium: 0, date: "2025.03", note: "고층" },
        ],
      },
      {
        name: "84B",
        areaPy: 34,
        areaM2: 84,
        listings: [
          { floor: "15층", area: "84.1㎡", price: 55000, premium: -2000, date: "2025.03", note: "" },
        ],
      },
    ],
  },
];

export function getMinPrice(apt: Apartment): number {
  return Math.min(...apt.types.flatMap((t) => t.listings.map((l) => l.price)));
}

export function getMaxPrice(apt: Apartment): number {
  return Math.max(...apt.types.flatMap((t) => t.listings.map((l) => l.price)));
}

export function getTotalListings(apt: Apartment): number {
  return apt.types.reduce((sum, t) => sum + t.listings.length, 0);
}

export function formatPrice(manwon: number): string {
  if (Math.abs(manwon) >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const rest = manwon % 10000;
    return rest > 0 ? `${eok}억 ${rest.toLocaleString()}만` : `${eok}억`;
  }
  return `${manwon.toLocaleString()}만`;
}
