import { Download } from "lucide-react";
import type { Apartment } from "@/data/mockApartments";
import { toast } from "sonner";

interface ExportButtonProps {
  apartments: Apartment[];
}

export function ExportButton({ apartments }: ExportButtonProps) {
  const handleExport = () => {
    if (apartments.length === 0) {
      toast.error("내보낼 데이터가 없습니다");
      return;
    }

    const headers = ["단지명", "지역", "세부지역", "평형", "전용면적(㎡)", "평수(평)", "동", "층", "거래가(만원)", "프리미엄(만원)", "방향", "특이사항", "확인일"];
    const rows: string[][] = [];

    apartments.forEach((apt) => {
      apt.types.forEach((type) => {
        type.listings.forEach((listing) => {
          rows.push([
            apt.name,
            apt.region,
            apt.subRegion,
            type.name,
            String(type.areaM2),
            String(type.areaPy),
            listing.dong || "",
            listing.floor,
            String(listing.price),
            String(listing.premium),
            listing.direction || "",
            listing.note,
            listing.date,
          ]);
        });
      });
    });

    const csvContent = "\uFEFF" + [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `분양권_매물_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast("CSV 파일이 다운로드되었습니다 📥");
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
    >
      <Download className="w-3.5 h-3.5" /> 내보내기
    </button>
  );
}
