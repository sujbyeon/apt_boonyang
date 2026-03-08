import { useState, useMemo, useCallback, useEffect } from "react";
import { RefreshCw, Heart, Loader2 } from "lucide-react";
import { formatPrice, getMinPrice, getMaxPrice, getTotalListings } from "@/data/mockApartments";
import { useSheetData } from "@/hooks/useSheetData";
import { StatsCards } from "@/components/StatsCards";
import { FilterBar } from "@/components/FilterBar";
import { ApartmentCard } from "@/components/ApartmentCard";
import { PriceChart } from "@/components/PriceChart";
import { ComparisonPanel } from "@/components/ComparisonPanel";
import { AdBanner } from "@/components/AdBanner";
import { ExportButton } from "@/components/ExportButton";
import { toast } from "sonner";

const Index = () => {
  const { apartments, loading, error, refresh } = useSheetData();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSubRegion, setSelectedSubRegion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("favorites") || "[]"));
    } catch { return new Set(); }
  });
  const [comparing, setComparing] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [priceRangeInitialized, setPriceRangeInitialized] = useState(false);

  const regions = useMemo(() => [...new Set(apartments.map((a) => a.region))], [apartments]);
  const subRegions = useMemo(() => {
    const filtered = selectedRegion
      ? apartments.filter((a) => a.region === selectedRegion)
      : apartments;
    return [...new Set(filtered.map((a) => a.subRegion))];
  }, [selectedRegion, apartments]);

  // Compute global price bounds from all apartments (before filtering)
  const priceBounds = useMemo(() => {
    if (apartments.length === 0) return { min: 0, max: 100000 };
    const allPrices = apartments.flatMap(a => a.types.flatMap(t => t.listings.map(l => l.price)));
    return { min: Math.min(...allPrices), max: Math.max(...allPrices) };
  }, [apartments]);

  // Initialize price range when data loads
  useEffect(() => {
    if (apartments.length > 0 && !priceRangeInitialized) {
      setPriceRange([priceBounds.min, priceBounds.max]);
      setPriceRangeInitialized(true);
    }
  }, [apartments, priceBounds, priceRangeInitialized]);

  const filtered = useMemo(() => {
    let result = [...apartments];
    if (selectedRegion) result = result.filter((a) => a.region === selectedRegion);
    if (selectedSubRegion) result = result.filter((a) => a.subRegion === selectedSubRegion);
    if (searchQuery) result = result.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (showFavoritesOnly) result = result.filter((a) => favorites.has(a.id));

    // Price range filter: keep apartments that have at least one listing in range
    if (priceRangeInitialized) {
      result = result.filter((a) => {
        const prices = a.types.flatMap(t => t.listings.map(l => l.price));
        return prices.some(p => p >= priceRange[0] && p <= priceRange[1]);
      });
    }

    switch (sortBy) {
      case "listings": result.sort((a, b) => getTotalListings(b) - getTotalListings(a)); break;
      case "minPrice": result.sort((a, b) => getMinPrice(a) - getMinPrice(b)); break;
      case "maxPrice": result.sort((a, b) => getMaxPrice(b) - getMaxPrice(a)); break;
      default: result.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    }
    return result;
  }, [selectedRegion, selectedSubRegion, searchQuery, sortBy, showFavoritesOnly, favorites, apartments, priceRange, priceRangeInitialized]);

  const totalListings = useMemo(() => filtered.reduce((s, a) => s + getTotalListings(a), 0), [filtered]);
  const globalMin = useMemo(() => filtered.length ? Math.min(...filtered.map(getMinPrice)) : 0, [filtered]);
  const globalMax = useMemo(() => filtered.length ? Math.max(...filtered.map(getMaxPrice)) : 0, [filtered]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast("즐겨찾기에서 제거되었습니다");
      } else {
        next.add(id);
        toast("즐겨찾기에 추가되었습니다 ❤️");
      }
      localStorage.setItem("favorites", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setComparing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 5) {
          toast.error("최대 5개까지 비교할 수 있습니다");
          return prev;
        }
        next.add(id);
        toast("비교 목록에 추가되었습니다 📊");
      }
      return next;
    });
  }, []);

  const comparingApts = useMemo(
    () => apartments.filter((a) => comparing.has(a.id)),
    [comparing, apartments]
  );

  return (
    <div className="min-h-screen bg-background py-8 lg:py-12 px-4 lg:px-5">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <header className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl lg:text-[38px] font-extrabold tracking-tighter mb-2">
            🏢 분양권 매물 요약
          </h1>
          <p className="text-base text-accent font-semibold">
            아파트별 · 평형별 가격 요약 대시보드
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => {
                refresh();
                toast("새로고침 완료!");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> 새로고침
            </button>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                showFavoritesOnly
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              }`}
            >
              <Heart className="w-3.5 h-3.5" fill={showFavoritesOnly ? "currentColor" : "none"} />
              즐겨찾기 {favorites.size > 0 && `(${favorites.size})`}
            </button>
            <ExportButton apartments={filtered} />
          </div>
        </header>

        {/* Ad Banner */}
        <AdBanner />

        {/* Loading / Error */}
        {loading && (
          <div className="bg-card rounded-2xl p-12 text-center border border-border/50 mb-8 animate-fade-in">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-accent" />
            <p className="text-base text-muted-foreground font-semibold">데이터를 불러오는 중입니다...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/5 rounded-2xl p-12 text-center border border-destructive/20 mb-8 animate-fade-in">
            <p className="text-4xl mb-4">❌</p>
            <p className="text-base text-destructive font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats */}
            <StatsCards
              totalApts={filtered.length}
              totalListings={totalListings}
              minPrice={filtered.length ? formatPrice(globalMin) : "-"}
              maxPrice={filtered.length ? formatPrice(globalMax) : "-"}
            />

            {/* Filters */}
            <FilterBar
              regions={regions}
              subRegions={subRegions}
              selectedRegion={selectedRegion}
              selectedSubRegion={selectedSubRegion}
              searchQuery={searchQuery}
              sortBy={sortBy}
              onRegionChange={(v) => { setSelectedRegion(v); setSelectedSubRegion(""); }}
              onSubRegionChange={setSelectedSubRegion}
              onSearchChange={setSearchQuery}
              onSortChange={setSortBy}
              priceRange={priceRange}
              priceBounds={priceBounds}
              onPriceRangeChange={setPriceRange}
            />

            {/* Comparison Panel */}
            <ComparisonPanel
              apartments={comparingApts}
              onRemove={(id) => toggleCompare(id)}
              onClear={() => setComparing(new Set())}
            />

            {/* Chart */}
            {filtered.length > 0 && <PriceChart apartments={filtered} />}

            {/* Apartment Cards */}
            {filtered.length === 0 ? (
              <div className="bg-card rounded-2xl p-12 text-center border border-border/50">
                <p className="text-lg text-muted-foreground">조건에 맞는 매물이 없습니다</p>
              </div>
            ) : (
              filtered.map((apt, i) => (
                <ApartmentCard
                  key={apt.id}
                  apt={apt}
                  index={i}
                  isFavorite={favorites.has(apt.id)}
                  isComparing={comparing.has(apt.id)}
                  onToggleFavorite={toggleFavorite}
                  onToggleCompare={toggleCompare}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
