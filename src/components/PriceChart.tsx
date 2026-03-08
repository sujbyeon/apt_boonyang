import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Apartment, formatPrice } from "@/data/mockApartments";

interface PriceChartProps {
  apartments: Apartment[];
}

export function PriceChart({ apartments }: PriceChartProps) {
  const chartData = apartments.map((apt) => {
    const price59 = apt.types
      .filter((t) => t.areaM2 >= 55 && t.areaM2 <= 65)
      .flatMap((t) => t.listings.map((l) => l.price).filter((p) => p > 0));
    const price84 = apt.types
      .filter((t) => t.areaM2 >= 80 && t.areaM2 <= 90)
      .flatMap((t) => t.listings.map((l) => l.price).filter((p) => p > 0));

    return {
      name: apt.name.length > 8 ? apt.name.slice(0, 8) + "…" : apt.name,
      fullName: apt.name,
      "59㎡ 최저": price59.length ? Math.min(...price59) : 0,
      "84㎡ 최저": price84.length ? Math.min(...price84) : 0,
    };
  }).filter((d) => d["59㎡ 최저"] > 0 || d["84㎡ 최저"] > 0)
    .sort((a, b) => (a["59㎡ 최저"] || a["84㎡ 최저"]) - (b["59㎡ 최저"] || b["84㎡ 최저"]))
    .slice(0, 20);

  if (chartData.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl p-5 lg:p-7 border border-border/50 mb-8 animate-fade-in">
      <h3 className="text-base font-bold tracking-tight mb-1">단지별 최저가 비교</h3>
      <p className="text-xs text-muted-foreground mb-5">59㎡ · 84㎡ 기준</p>
      <div className="h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => formatPrice(v)}
              width={70}
            />
            <Tooltip
              formatter={(value: number) => formatPrice(value)}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: 13,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            <Bar dataKey="59㎡ 최저" fill="hsl(200, 35%, 68%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="84㎡ 최저" fill="hsl(25, 30%, 68%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
