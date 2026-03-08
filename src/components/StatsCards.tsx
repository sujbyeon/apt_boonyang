import { Building2, ClipboardList, TrendingDown, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalApts: number;
  totalListings: number;
  minPrice: string;
  maxPrice: string;
}

const stats = [
  { icon: Building2, label: "총 단지 수", key: "totalApts" as const, emoji: "🏠" },
  { icon: ClipboardList, label: "총 매물 수", key: "totalListings" as const, emoji: "📋" },
  { icon: TrendingDown, label: "최저가", key: "minPrice" as const, emoji: "💰" },
  { icon: TrendingUp, label: "최고가", key: "maxPrice" as const, emoji: "📈" },
];

export function StatsCards({ totalApts, totalListings, minPrice, maxPrice }: StatsCardsProps) {
  const values = { totalApts: String(totalApts), totalListings: String(totalListings), minPrice, maxPrice };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8">
      {stats.map((s, i) => (
        <div
          key={s.key}
          className="bg-card rounded-2xl p-5 lg:p-7 text-center border border-border/50 animate-slide-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="text-2xl mb-2">{s.emoji}</div>
          <div className="text-xs font-medium text-muted-foreground mb-1">{s.label}</div>
          <div className="text-2xl lg:text-3xl font-extrabold tracking-tight tabular-nums">
            {values[s.key]}
          </div>
        </div>
      ))}
    </div>
  );
}
