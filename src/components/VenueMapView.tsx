import { useState } from 'react';
import { ArrowRight, MapPin, Navigation, Users } from 'lucide-react';
import type { TradeListing, VenueSpot } from '../types';

interface VenueMapViewProps {
  spots: VenueSpot[];
  listings: TradeListing[];
  onSelectSpotForFilter: (spotId: string) => void;
  onOpenTrade: (listing: TradeListing) => void;
}

export function VenueMapView({
  spots,
  listings,
  onSelectSpotForFilter,
  onOpenTrade,
}: VenueMapViewProps) {
  const [selectedSpotId, setSelectedSpotId] = useState<string>(spots[0].id);

  const selectedSpot = spots.find((s) => s.id === selectedSpotId) ?? spots[0];
  const spotListings = listings.filter((item) => item.spotId === selectedSpot.id);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            東京ドーム 現地手渡しスポットMAP
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            ピンをタップして、各ゲート・待ち合わせ場所の募集中アイテムを確認できます。
          </p>
        </div>
        <span className="text-xs font-medium text-violet-700 inline-flex items-center gap-1 whitespace-nowrap">
          <Navigation className="w-3.5 h-3.5" />
          現在地：22ゲート周辺（現地認証済み）
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Interactive SVG Map Canvas */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#F3F1F8] border border-slate-200/70">
            {/* Stylised Tokyo Dome & Venue Grounds SVG */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              aria-label="東京ドーム周辺の手渡しスポットマップ"
            >
              {/* Roads & Walkways */}
              <path
                d="M 5 84 Q 50 76 95 86"
                fill="none"
                stroke="#E2E0EC"
                strokeWidth="4.5"
              />
              <path
                d="M 14 10 L 14 82"
                fill="none"
                stroke="#E2E0EC"
                strokeWidth="3.2"
              />
              <path
                d="M 82 14 L 82 84"
                fill="none"
                stroke="#E2E0EC"
                strokeWidth="3.2"
              />

              {/* Tokyo Dome Roof Structure */}
              <ellipse
                cx="46"
                cy="38"
                rx="24"
                ry="18"
                fill="#FFFFFF"
                stroke="#D4CFE6"
                strokeWidth="1.5"
              />
              <ellipse
                cx="46"
                cy="38"
                rx="17"
                ry="12"
                fill="none"
                stroke="#EAE6F5"
                strokeWidth="1"
              />
              <text
                x="46"
                y="37"
                textAnchor="middle"
                className="fill-slate-700 font-bold"
                style={{ fontSize: '4.2px' }}
              >
                TOKYO DOME
              </text>
              <text
                x="46"
                y="42.5"
                textAnchor="middle"
                className="fill-slate-400"
                style={{ fontSize: '2.8px' }}
              >
                推しフェス 2026 会場
              </text>

              {/* Goods Tent Area */}
              <rect
                x="14"
                y="26"
                width="14"
                height="9"
                rx="1.5"
                fill="#EDE9FE"
                stroke="#C4B5FD"
                strokeWidth="0.8"
              />
              <text
                x="21"
                y="31.5"
                textAnchor="middle"
                className="fill-violet-800 font-semibold"
                style={{ fontSize: '2.5px' }}
              >
                物販エリア
              </text>

              {/* Prism Hall */}
              <rect
                x="72"
                y="34"
                width="16"
                height="10"
                rx="1.5"
                fill="#FCE7F3"
                stroke="#F9A8D4"
                strokeWidth="0.8"
              />
              <text
                x="80"
                y="40"
                textAnchor="middle"
                className="fill-pink-800 font-semibold"
                style={{ fontSize: '2.4px' }}
              >
                プリズムホール
              </text>

              {/* Suidobashi Station */}
              <rect
                x="58"
                y="84"
                width="22"
                height="7"
                rx="1.2"
                fill="#E2E8F0"
              />
              <text
                x="69"
                y="88.5"
                textAnchor="middle"
                className="fill-slate-700 font-semibold"
                style={{ fontSize: '2.5px' }}
              >
                JR 水道橋駅
              </text>
            </svg>

            {/* Interactive Spot Pins */}
            {spots.map((spot) => {
              const count = listings.filter((l) => l.spotId === spot.id).length;
              const isSelected = spot.id === selectedSpot.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setSelectedSpotId(spot.id)}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 min-h-[40px] px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white scale-105 z-20 ring-4 ring-violet-500/20'
                      : 'bg-white text-slate-800 border border-slate-300 hover:border-violet-400 z-10'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{spot.shortLabel}</span>
                  <span
                    className={`font-mono-num px-1.5 py-0.5 rounded-md text-[10px] ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-violet-100 text-violet-800'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>※ ピン上の数字は現在募集中の取引件数です</span>
            <span>明るく人通りの多い公式エリアのみ掲載</span>
          </div>
        </div>

        {/* Selected Spot Details & Preview List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-4 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {selectedSpot.name}
              </h3>
              <span
                className={`text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap ${
                  selectedSpot.crowdLevel === '空きあり'
                    ? 'text-emerald-700'
                    : selectedSpot.crowdLevel === 'やや混雑'
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                {selectedSpot.crowdLevel}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedSpot.description}
            </p>
            <p className="text-xs text-violet-700 font-medium pt-0.5">
              おすすめ合流目印：{selectedSpot.landmarkHint}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 font-mono-num">
                この場所の募集（{spotListings.length}件）
              </span>
              <button
                type="button"
                onClick={() => onSelectSpotForFilter(selectedSpot.id)}
                className="text-xs font-semibold text-violet-700 hover:text-violet-900 inline-flex items-center gap-1 min-h-[36px] px-2 cursor-pointer"
              >
                <span>ホームで絞り込む</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {spotListings.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                現在このスポットでの募集はありません。
              </p>
            ) : (
              <div className="space-y-2">
                {spotListings.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onOpenTrade(item)}
                    className="w-full text-left p-3 rounded-xl border border-slate-200/80 hover:border-violet-300 bg-slate-50/60 hover:bg-violet-50/40 transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-slate-900 truncate">
                        {item.userNickname}
                      </span>
                      <span className="text-slate-500 font-mono-num shrink-0">
                        {item.timeWindow}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium truncate">
                      譲：{item.giveItem}
                    </p>
                    <p className="text-xs text-slate-600 truncate">
                      求：{item.wantItem}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
