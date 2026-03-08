import { X, TrendingDown, TrendingUp } from "lucide-react";
import { Apartment, formatPrice, getMinPrice, getMaxPrice, getTotalListings } from "@/data/mockApartments";

interface ComparisonPanelProps {
  apartments: Apartment[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function ComparisonPanel({ apartments, onRemove, onClear }: ComparisonPanelProps) {
  if (apartments.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-info/30 p-5 lg:p-7 mb-8 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold tracking-tight">📊 비교 패널</h3>
        <button
          onClick={onClear}
          className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
        >
          전체 해제
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {apartments.map((apt) => (
          <div key={apt.id} className="bg-muted/40 rounded-xl p-4 relative">
            <button
              onClick={() => onRemove(apt.id)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="font-bold text-sm mb-2 pr-6">{apt.name}</h4>
            <p className="text-xs text-muted-foreground mb-3">{apt.location}</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">매물</span>
                <span className="font-bold">{getTotalListings(apt)}건</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><TrendingDown className="w-3 h-3" /> 최저</span>
                <span className="font-bold text-success">{formatPrice(getMinPrice(apt))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 최고</span>
                <span className="font-bold text-destructive">{formatPrice(getMaxPrice(apt))}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
