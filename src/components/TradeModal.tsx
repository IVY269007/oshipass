import { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  MapPin,
  Send,
  ShieldCheck,
  Star,
  UserCheck,
  X,
} from 'lucide-react';
import type { ActiveTrade, TradeListing, TradeStep, UserProfile } from '../types';
import { QUICK_CHAT_PRESETS } from '../data/mockData';
import { GoodsImage } from './GoodsImage';

interface TradeModalProps {
  listing: TradeListing;
  trade: ActiveTrade;
  profile: UserProfile;
  onClose: () => void;
  onAdvanceStep: (listingId: string, nextStep: TradeStep) => void;
  onSendMessage: (listingId: string, text: string) => void;
}

const STEPS: { step: TradeStep; label: string }[] = [
  { step: 1, label: 'マッチング確定' },
  { step: 2, label: '現地到着' },
  { step: 3, label: '手渡し＆確認' },
  { step: 4, label: '取引完了' },
];

export function TradeModal({
  listing,
  trade,
  profile,
  onClose,
  onAdvanceStep,
  onSendMessage,
}: TradeModalProps) {
  const [customText, setCustomText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [trade.messages.length, trade.step]);

  const personalLandmarkPhrase = `目印：${profile.bagLandmark}と${profile.penlightColor}`;
  const allQuickPhrases = [
    QUICK_CHAT_PRESETS[0],
    personalLandmarkPhrase,
    ...QUICK_CHAT_PRESETS.slice(1),
  ];

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customText.trim();
    if (!trimmed) return;
    onSendMessage(listing.id, trimmed);
    setCustomText('');
  };

  const renderPrimaryStepAction = () => {
    if (trade.step === 1) {
      return (
        <button
          type="button"
          onClick={() => onAdvanceStep(listing.id, 2)}
          className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:from-violet-700 hover:to-pink-700 active:scale-[0.98] transition-all cursor-pointer"
        >
          <MapPin className="w-4 h-4 shrink-0" />
          <span>現地に着きました（{listing.spotName}）</span>
        </button>
      );
    }
    if (trade.step === 2) {
      return (
        <button
          type="button"
          onClick={() => onAdvanceStep(listing.id, 3)}
          className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:from-violet-700 hover:to-pink-700 active:scale-[0.98] transition-all cursor-pointer"
        >
          <UserCheck className="w-4 h-4 shrink-0" />
          <span>相手と合流しました</span>
        </button>
      );
    }
    if (trade.step === 3) {
      return (
        <button
          type="button"
          onClick={() => onAdvanceStep(listing.id, 4)}
          className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-[0.98] transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>状態確認OK · 手渡し取引を完了する</span>
        </button>
      );
    }
    return (
      <div className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>手渡し取引が完了しました（信頼スコア反映済み）</span>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-950/50 backdrop-blur-sm p-0 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trade-modal-title"
    >
      <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl max-h-[92dvh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        {/* Mobile grab handle */}
        <div className="md:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-br ${listing.userAvatarColor} text-white font-semibold text-sm flex items-center justify-center shrink-0`}
            >
              {listing.userInitial}
            </div>
            <div className="min-w-0">
              <h2 id="trade-modal-title" className="text-sm font-bold text-slate-900 truncate">
                {listing.userNickname} との現地手渡し
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono-num">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span>{listing.trustScore.toFixed(1)}</span>
                <span aria-hidden="true">·</span>
                <span className="truncate">{listing.spotName}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="取引画面を閉じる"
            className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Progress Bar */}
        <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 shrink-0">
          <div className="grid grid-cols-4 gap-1.5">
            {STEPS.map((item) => {
              const isDone = trade.step > item.step || trade.step === 4;
              const isCurrent = trade.step === item.step && trade.step < 4;
              return (
                <div key={item.step} className="flex flex-col items-center text-center gap-1">
                  <div className="w-full flex items-center">
                    <div
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        isDone
                          ? 'bg-emerald-500'
                          : isCurrent
                          ? 'bg-gradient-to-r from-violet-600 to-pink-600'
                          : 'bg-slate-200'
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center font-mono-num shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isDone ? <Check className="w-2.5 h-2.5" strokeWidth={3} /> : item.step}
                    </span>
                    <span
                      className={`text-[10px] leading-tight font-medium ${
                        isDone
                          ? 'text-emerald-700'
                          : isCurrent
                          ? 'text-violet-700 font-semibold'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compact Trade Summary + Partner Landmark */}
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-3 bg-white shrink-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100">
            <GoodsImage
              src={listing.imageUrl}
              alt={listing.giveItem}
              category={listing.category}
              className="w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0 text-xs space-y-0.5">
            <p className="font-semibold text-slate-900 truncate">
              譲：{listing.giveItem}
            </p>
            <p className="text-slate-600 truncate">
              求：{listing.wantItem}
            </p>
            <p className="text-[11px] text-violet-700 font-medium truncate">
              相手の目印：{trade.partnerLandmark}
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#F8F7FA]">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 py-1">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-600 shrink-0" />
            <span>住所・本名非公開 · 送料ゼロの現地専用チャット</span>
          </div>

          {trade.messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="bg-white/90 border border-slate-200/80 text-slate-600 text-[11px] px-3 py-1.5 rounded-lg text-center max-w-[90%]">
                    <span>{msg.text}</span>
                    <span className="ml-1.5 text-slate-400 font-mono-num">{msg.timestamp}</span>
                  </div>
                </div>
              );
            }
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-br-sm'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 font-mono-num mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* One-Tap Status Update + One-Tap Quick Chat */}
        <div className="p-3.5 bg-white border-t border-slate-200 space-y-3 shrink-0">
          {renderPrimaryStepAction()}

          <div>
            <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
              ワンタップ定型文（丁寧な長文DMは不要です）
            </p>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {allQuickPhrases.map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => onSendMessage(listing.id, phrase)}
                  className="shrink-0 min-h-[38px] px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200/80 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer active:scale-[0.98]"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmitCustom} className="flex items-center gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="補足があれば入力（例：赤い自販機の前です）"
              className="flex-1 min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-violet-500"
            />
            <button
              type="submit"
              disabled={!customText.trim()}
              aria-label="メッセージを送信"
              className="min-w-[44px] min-h-[44px] px-3.5 rounded-xl bg-slate-900 text-white disabled:bg-slate-200 disabled:text-slate-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
