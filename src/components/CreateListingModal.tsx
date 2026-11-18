import { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import type { GoodsCategory, MemberName, TradeDirection, TradeListing } from '../types';
import { CATEGORY_FILTERS, MEMBER_FILTERS, VENUE_SPOTS } from '../data/mockData';

interface CreateListingModalProps {
  onClose: () => void;
  onCreate: (listing: Omit<TradeListing, 'id' | 'createdAt' | 'userNickname' | 'userAvatarColor' | 'userInitial' | 'trustScore' | 'completedTrades'>) => void;
}

const CATEGORY_IMAGES: Record<GoodsCategory, string> = {
  '缶バッジ': '/src/assets/images/goods_can_badge_1794977031166.jpg',
  'アクスタ': '/src/assets/images/goods_acrylic_stand_1794977031872.jpg',
  'トレカ': '/src/assets/images/goods_trading_card_1794977032092.jpg',
  'チケット': '/src/assets/images/goods_ticket_pass_1794977032787.jpg',
  'ペンライト': '/src/assets/images/goods_lightstick_1794977032479.jpg',
};

export function CreateListingModal({ onClose, onCreate }: CreateListingModalProps) {
  const [direction, setDirection] = useState<TradeDirection>('give');
  const [member, setMember] = useState<MemberName>('蓮（Ren）');
  const [category, setCategory] = useState<GoodsCategory>('缶バッジ');
  const [giveItem, setGiveItem] = useState('');
  const [wantItem, setWantItem] = useState('');
  const [spotId, setSpotId] = useState(VENUE_SPOTS[0].id);
  const [timeWindow, setTimeWindow] = useState('16:00〜17:30');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giveItem.trim() || !wantItem.trim()) return;
    const spot = VENUE_SPOTS.find((s) => s.id === spotId) ?? VENUE_SPOTS[0];

    onCreate({
      direction,
      member,
      category,
      giveItem: giveItem.trim(),
      wantItem: wantItem.trim(),
      spotId: spot.id,
      spotName: spot.shortLabel === '22G前' ? '22ゲート前' : spot.name,
      timeWindow: timeWindow.trim() || '16:00〜17:30',
      imageUrl: CATEGORY_IMAGES[category],
      note: note.trim() || 'OPP袋・硬質ケース等で保護して現地手渡しします。',
      isNew: true,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-950/50 backdrop-blur-sm p-0 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-listing-title"
    >
      <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl max-h-[90dvh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 id="create-listing-title" className="text-base font-bold text-slate-900">
            現地手渡しの募集を投稿
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              取引タイプ
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setDirection('give')}
                className={`min-h-[40px] rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  direction === 'give'
                    ? 'bg-white text-violet-700 shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                譲（譲ります）
              </button>
              <button
                type="button"
                onClick={() => setDirection('want')}
                className={`min-h-[40px] rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  direction === 'want'
                    ? 'bg-white text-pink-700 shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                求（探しています）
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="member-select" className="block text-xs font-semibold text-slate-700 mb-1">
                メンバー
              </label>
              <select
                id="member-select"
                value={member}
                onChange={(e) => setMember(e.target.value as MemberName)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
              >
                {MEMBER_FILTERS.filter((m) => m !== 'すべて').map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category-select" className="block text-xs font-semibold text-slate-700 mb-1">
                グッズ種別
              </label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as GoodsCategory)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
              >
                {CATEGORY_FILTERS.filter((c) => c !== 'すべて').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="give-input" className="block text-xs font-semibold text-slate-700 mb-1">
              譲るアイテム（またはお礼条件）
            </label>
            <input
              id="give-input"
              type="text"
              required
              value={giveItem}
              onChange={(e) => setGiveItem(e.target.value)}
              placeholder="例：蒼 缶バッジ（ツアー2026 Ver.）"
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="want-input" className="block text-xs font-semibold text-slate-700 mb-1">
              求めるアイテム（または定価手渡し等）
            </label>
            <input
              id="want-input"
              type="text"
              required
              value={wantItem}
              onChange={(e) => setWantItem(e.target.value)}
              placeholder="例：蓮 アクスタ または 蓮 缶バッジ"
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="spot-select" className="block text-xs font-semibold text-slate-700 mb-1">
                手渡し希望場所
              </label>
              <select
                id="spot-select"
                value={spotId}
                onChange={(e) => setSpotId(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
              >
                {VENUE_SPOTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="time-input" className="block text-xs font-semibold text-slate-700 mb-1">
                対応可能な時間帯
              </label>
              <input
                id="time-input"
                type="text"
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                placeholder="16:00〜17:30"
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-mono-num"
              />
            </div>
          </div>

          <div>
            <label htmlFor="note-input" className="block text-xs font-semibold text-slate-700 mb-1">
              ひとことメモ（任意）
            </label>
            <input
              id="note-input"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="開封後OPP袋保管・異種交換もご相談OKです"
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:from-violet-700 hover:to-pink-700 active:scale-[0.98] transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>この内容で現地募集を公開する</span>
          </button>
        </form>
      </div>
    </div>
  );
}
