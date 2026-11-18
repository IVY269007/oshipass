import { ArrowLeftRight, CheckCircle2, Clock, MapPin, MessageCircle, Star } from 'lucide-react';
import type { ActiveTrade, TradeListing } from '../types';
import { GoodsImage } from './GoodsImage';

interface ListingCardProps {
  listing: TradeListing;
  activeTrade?: ActiveTrade;
  onOpenTrade: (listing: TradeListing) => void;
}

const STEP_LABELS: Record<number, string> = {
  1: 'マッチング確定',
  2: '現地到着済み',
  3: '手渡し・確認中',
  4: '取引完了',
};

export function ListingCard({ listing, activeTrade, onOpenTrade }: ListingCardProps) {
  const isCompleted = activeTrade?.step === 4;
  const isInProgress = Boolean(activeTrade && activeTrade.step < 4);

  return (
    <article
      className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col gap-3.5 transition-transform duration-150 hover:border-violet-200 focus-within:ring-2 focus-within:ring-violet-500/30"
    >
      {/* Top row: Anonymous user + trust score (Zero-pill clean inline metadata) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-full bg-gradient-to-br ${listing.userAvatarColor} text-white font-semibold text-sm flex items-center justify-center shrink-0`}
            aria-hidden="true"
          >
            {listing.userInitial}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {listing.userNickname}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono-num">
              <span className="inline-flex items-center gap-0.5 text-amber-600 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {listing.trustScore.toFixed(1)}
              </span>
              <span aria-hidden="true">·</span>
              <span>完了 {listing.completedTrades}件</span>
              <span aria-hidden="true">·</span>
              <span>{listing.createdAt}</span>
            </div>
          </div>
        </div>

        <span className="text-xs font-medium text-slate-500 whitespace-nowrap shrink-0">
          {listing.member} · {listing.category}
        </span>
      </div>

      {/* Main Item Content */}
      <div
        onClick={() => onOpenTrade(listing)}
        className="flex gap-3.5 cursor-pointer group"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenTrade(listing);
          }
        }}
      >
        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-100">
          <GoodsImage
            src={listing.imageUrl}
            alt={listing.giveItem}
            category={listing.category}
            className="w-full h-full group-hover:scale-[1.03] transition-transform duration-200"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
          {/* 譲 (Give) */}
          <div className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold rounded bg-violet-600 text-white shrink-0 mt-0.5">
              譲
            </span>
            <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
              {listing.giveItem}
            </p>
          </div>

          {/* 求 (Want) */}
          <div className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold rounded bg-pink-600 text-white shrink-0 mt-0.5">
              求
            </span>
            <p className="text-sm font-medium text-slate-700 leading-snug line-clamp-2">
              {listing.wantItem}
            </p>
          </div>
        </div>
      </div>

      {listing.note && (
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {listing.note}
        </p>
      )}

      {/* Location & Time Window */}
      <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-medium text-slate-800">
          <MapPin className="w-3.5 h-3.5 text-violet-600 shrink-0" />
          <span>{listing.spotName}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 font-mono-num">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{listing.timeWindow}</span>
        </div>
      </div>

      {/* Action Button (>= 44px touch target) */}
      <button
        type="button"
        onClick={() => onOpenTrade(listing)}
        className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] whitespace-nowrap cursor-pointer ${
          isCompleted
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            : isInProgress
            ? 'bg-violet-50 text-violet-800 border border-violet-200 hover:bg-violet-100'
            : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-700 hover:to-pink-700 shadow-sm shadow-violet-600/15'
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>取引完了済み · 履歴を見る</span>
          </>
        ) : isInProgress ? (
          <>
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>取引中（{STEP_LABELS[activeTrade!.step]}）· 開く</span>
          </>
        ) : (
          <>
            <ArrowLeftRight className="w-4 h-4 shrink-0" />
            <span>取引をリクエスト（現地手渡し）</span>
          </>
        )}
      </button>
    </article>
  );
}
