import { formatPrice } from "@/data/mockApartments";
import { Slider } from "@/components/ui/slider";

interface FilterBarProps {
  regions: string[];
  subRegions: string[];
  selectedRegion: string;
  selectedSubRegion: string;
  searchQuery: string;
  sortBy: string;
  onRegionChange: (v: string) => void;
  onSubRegionChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  onSortChange: (v: string) => void;
  priceRange: [number, number];
  priceBounds: { min: number; max: number };
  onPriceRangeChange: (range: [number, number]) => void;
}

export function FilterBar({
  regions, subRegions, selectedRegion, selectedSubRegion,
  searchQuery, sortBy,
  onRegionChange, onSubRegionChange, onSearchChange, onSortChange,
  priceRange, priceBounds, onPriceRangeChange,
}: FilterBarProps) {
  return (
    <div className="bg-card rounded-2xl p-5 lg:p-6 mb-8 border border-border/50 animate-fade-in space-y-4">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">광역시도</label>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-input rounded-xl text-sm bg-background focus:outline-none focus:border-accent"
          >
            <option value="">전체</option>
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">세부지역</label>
          <select
            value={selectedSubRegion}
            onChange={(e) => onSubRegionChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-input rounded-xl text-sm bg-background focus:outline-none focus:border-accent"
          >
            <option value="">전체</option>
            {subRegions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">단지명 검색</label>
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-input rounded-xl text-sm bg-background focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">정렬</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-input rounded-xl text-sm bg-background focus:outline-none focus:border-accent"
          >
            <option value="name">이름순</option>
            <option value="listings">매물 많은순</option>
            <option value="minPrice">최저가 낮은순</option>
            <option value="maxPrice">최고가 높은순</option>
          </select>
        </div>
      </div>

      {/* Price Range Slider */}
      {priceBounds.max > priceBounds.min && (
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2">
            가격 범위: <span className="text-foreground">{formatPrice(priceRange[0])}</span> ~ <span className="text-foreground">{formatPrice(priceRange[1])}</span>
          </label>
          <Slider
            min={priceBounds.min}
            max={priceBounds.max}
            step={1000}
            value={priceRange}
            onValueChange={(val) => onPriceRangeChange(val as [number, number])}
            className="w-full"
          />
          <div className="flex justify-between mt-1 text-[11px] text-muted-foreground">
            <span>{formatPrice(priceBounds.min)}</span>
            <span>{formatPrice(priceBounds.max)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
