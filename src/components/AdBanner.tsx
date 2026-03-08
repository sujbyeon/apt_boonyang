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
    <div className="bg-card rounded-2xl border border-border/50 p-4 lg:p-5 mb-8 animate-slide-up flex flex-col lg:flex-row gap-3 lg:gap-0 lg:justify-around">
      {ads.map((ad) => (
        <a
          key={ad.url}
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-muted/60 transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-muted-foreground font-semibold mb-0.5">{ad.label}</div>
            <div className="text-sm font-extrabold tracking-tight">{ad.title}</div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </a>
      ))}
    </div>
  );
}
