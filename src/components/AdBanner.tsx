import { ExternalLink } from "lucide-react";

const ads = [
  {
    label: "제작",
    title: "수잔의 블로그",
    url: "https://blog.naver.com/chachalacha",
  },
  {
    label: "재개발 전문 세무상담",
    title: "⚖️ 세무회계 평온",
    url: "https://blog.naver.com/po-tax/222638285211",
  },
  {
    label: "프리미엄 매물 분석",
    title: "📈 재개발 재건축 추천매물 스터디",
    url: "https://contents.premium.naver.com/jejeguide/jejemvp",
  },
];

export function AdBanner() {
  return (
    <div className="bg-card/60 rounded-xl border border-border/30 px-4 py-2 mb-6 animate-slide-up flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
      {ads.map((ad, i) => (
        <a
          key={ad.url}
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-muted/60 transition-colors group text-xs"
        >
          <span className="text-muted-foreground font-medium">{ad.label}:</span>
          <span className="font-bold tracking-tight">{ad.title}</span>
          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          {i < ads.length - 1 && <span className="text-border ml-2 hidden lg:inline">|</span>}
        </a>
      ))}
    </div>
  );
}
