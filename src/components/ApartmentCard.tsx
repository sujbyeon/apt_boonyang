import { useState } from "react";
import { Heart, ChevronDown, ChevronUp, GitCompareArrows } from "lucide-react";
import { Apartment, ApartmentType, formatPrice, getMinPrice, getMaxPrice, getTotalListings } from "@/data/mockApartments";

interface ApartmentCardProps {
  apt: Apartment;
  index: number;
  isFavorite: boolean;
  isComparing: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
}

export function ApartmentCard({ apt, index, isFavorite, isComparing, onToggleFavorite, onToggleCompare }: ApartmentCardProps) {
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const totalListings = getTotalListings(apt);
  const minPrice = getMinPrice(apt);
  const maxPrice = getMaxPrice(apt);

  return (
    <div
      className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-5 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="p-5 lg:p-7 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg lg:text-xl font-extrabold tracking-tight">{apt.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{apt.location}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-xl text-sm font-bold bg-gold-light text-accent">
            {totalListings}건
          </span>
          <span className="px-3 py-1.5 rounded-xl text-sm font-bold bg-info/10 text-info">
            {formatPrice(minPrice)} ~ {formatPrice(maxPrice)}
          </span>
          <button
            onClick={() => onToggleFavorite(apt.id)}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isFavorite ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground hover:text-destructive"
            }`}
          >
            <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => onToggleCompare(apt.id)}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isComparing ? "bg-info/10 text-info" : "bg-muted text-muted-foreground hover:text-info"
            }`}
          >
            <GitCompareArrows className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Type table */}
      <div className="px-5 lg:px-7 pb-5">
        {/* Desktop table */}
        <div className="hidden lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-muted">
                <th className="text-left text-xs font-bold text-muted-foreground py-3 px-3">타입</th>
                <th className="text-right text-xs font-bold text-muted-foreground py-3 px-3">매물</th>
                <th className="text-right text-xs font-bold text-muted-foreground py-3 px-3">최저가</th>
                <th className="text-right text-xs font-bold text-muted-foreground py-3 px-3">최고가</th>
                <th className="text-right text-xs font-bold text-muted-foreground py-3 px-3">P 범위</th>
                <th className="text-right text-xs font-bold text-muted-foreground py-3 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {apt.types.map((type) => (
                <TypeRow
                  key={type.name}
                  type={type}
                  isExpanded={expandedType === type.name}
                  onToggle={() => setExpandedType(expandedType === type.name ? null : type.name)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden space-y-3">
          {apt.types.map((type) => (
            <MobileTypeCard
              key={type.name}
              type={type}
              isExpanded={expandedType === type.name}
              onToggle={() => setExpandedType(expandedType === type.name ? null : type.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TypeRow({ type, isExpanded, onToggle }: { type: ApartmentType; isExpanded: boolean; onToggle: () => void }) {
  const prices = type.listings.map((l) => l.price);
  const premiums = type.listings.map((l) => l.premium);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minP = Math.min(...premiums);
  const maxP = Math.max(...premiums);

  return (
    <>
      <tr className="border-b border-muted/50 hover:bg-muted/30 transition-colors">
        <td className="py-3 px-3">
          <span className="font-bold">{type.name}</span>
          <span className="text-xs text-muted-foreground ml-2">{type.areaM2}㎡ · {type.areaPy}평</span>
        </td>
        <td className="text-right py-3 px-3">
          <span className="inline-block bg-gold-light text-accent px-2.5 py-0.5 rounded-lg text-xs font-bold">
            {type.listings.length}건
          </span>
        </td>
        <td className="text-right py-3 px-3 tabular-nums font-bold text-success text-sm">
          {formatPrice(minPrice)}
        </td>
        <td className="text-right py-3 px-3 tabular-nums font-bold text-destructive text-sm">
          {formatPrice(maxPrice)}
        </td>
        <td className="text-right py-3 px-3 tabular-nums text-sm">
          <PremiumRange min={minP} max={maxP} />
        </td>
        <td className="text-right py-3 px-3">
          <button
            onClick={onToggle}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-input text-xs font-semibold text-muted-foreground hover:border-accent hover:text-accent transition-all"
          >
            상세 {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-0">
            <div className="bg-muted/30 p-4 animate-fade-in">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-[11px] text-muted-foreground font-bold py-1.5 px-2">동</th>
                    <th className="text-left text-[11px] text-muted-foreground font-bold py-1.5 px-2">층수</th>
                    <th className="text-left text-[11px] text-muted-foreground font-bold py-1.5 px-2">방향</th>
                    <th className="text-right text-[11px] text-muted-foreground font-bold py-1.5 px-2">가격</th>
                    <th className="text-right text-[11px] text-muted-foreground font-bold py-1.5 px-2">프리미엄</th>
                    <th className="text-left text-[11px] text-muted-foreground font-bold py-1.5 px-2">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {type.listings.map((l, i) => (
                    <tr key={i} className="border-t border-border/50">
                      <td className="py-2 px-2 text-sm">{l.dong || "-"}</td>
                      <td className="py-2 px-2 text-sm font-bold">{l.floor || "-"}</td>
                      <td className="py-2 px-2 text-sm">{l.direction || "-"}</td>
                      <td className="py-2 px-2 text-sm text-right tabular-nums font-bold">
                        {l.price > 0 ? formatPrice(l.price) : "-"}
                      </td>
                      <td className={`py-2 px-2 text-sm text-right tabular-nums font-bold ${l.premium >= 0 ? "text-success" : "text-destructive"}`}>
                        {l.premium !== 0 ? (l.premium >= 0 ? "+" : "") + formatPrice(l.premium) : "-"}
                      </td>
                      <td className="py-2 px-2 text-sm text-muted-foreground">
                        {l.url ? (
                          <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline mr-1">🔗</a>
                        ) : null}
                        {l.note || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function MobileTypeCard({ type, isExpanded, onToggle }: { type: ApartmentType; isExpanded: boolean; onToggle: () => void }) {
  const prices = type.listings.map((l) => l.price);
  const premiums = type.listings.map((l) => l.premium);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minP = Math.min(...premiums);
  const maxP = Math.max(...premiums);

  return (
    <div className="bg-muted/40 rounded-xl p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-bold text-sm">{type.name}</span>
          <span className="text-xs text-muted-foreground ml-1.5">{type.areaM2}㎡</span>
        </div>
        <span className="bg-gold-light text-accent px-2 py-0.5 rounded-lg text-xs font-bold">{type.listings.length}건</span>
      </div>
      <div className="grid grid-cols-2 gap-1 text-sm mb-2">
        <div><span className="text-xs text-muted-foreground">최저 </span><span className="font-bold text-success">{formatPrice(minPrice)}</span></div>
        <div><span className="text-xs text-muted-foreground">최고 </span><span className="font-bold text-destructive">{formatPrice(maxPrice)}</span></div>
        <div className="col-span-2"><span className="text-xs text-muted-foreground">P </span><PremiumRange min={minP} max={maxP} /></div>
      </div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-1 py-2 rounded-lg border border-input text-xs font-semibold text-muted-foreground hover:border-accent hover:text-accent transition-all"
      >
        상세 {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {isExpanded && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {type.listings.map((l, i) => (
            <div key={i} className="bg-card rounded-lg p-3 border border-border/50 text-sm">
              <div className="flex justify-between">
                <span className="font-bold">{l.dong ? `${l.dong}동 ` : ""}{l.floor || "-"}</span>
                <span className="font-bold tabular-nums">{l.price > 0 ? formatPrice(l.price) : "-"}</span>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{l.direction || ""}{l.direction && " · "}{l.date}</span>
                <span className={`font-bold ${l.premium >= 0 ? "text-success" : "text-destructive"}`}>
                  P {l.premium !== 0 ? (l.premium >= 0 ? "+" : "") + formatPrice(l.premium) : "-"}
                </span>
              </div>
              {(l.note || l.url) && (
                <div className="text-xs text-muted-foreground mt-1">
                  {l.url ? <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline mr-1">🔗</a> : null}
                  {l.note || ""}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PremiumRange({ min, max }: { min: number; max: number }) {
  return (
    <span className="text-sm">
      <span className={`font-bold ${min >= 0 ? "text-success" : "text-destructive"}`}>
        {min >= 0 ? "+" : ""}{formatPrice(min)}
      </span>
      <span className="text-muted-foreground mx-1">~</span>
      <span className={`font-bold ${max >= 0 ? "text-success" : "text-destructive"}`}>
        {max >= 0 ? "+" : ""}{formatPrice(max)}
      </span>
    </span>
  );
}
