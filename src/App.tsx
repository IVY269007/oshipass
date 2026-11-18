import { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  Home,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import type {
  ActiveTrade,
  AppTab,
  TradeDirection,
  TradeListing,
  TradeStep,
  UserProfile,
} from './types';
import {
  CATEGORY_FILTERS,
  EVENT_INFO,
  INITIAL_ACTIVE_TRADES,
  INITIAL_LISTINGS,
  INITIAL_USER_PROFILE,
  MEMBER_FILTERS,
  VENUE_SPOTS,
} from './data/mockData';
import { ListingCard } from './components/ListingCard';
import { TradeModal } from './components/TradeModal';
import { VenueMapView } from './components/VenueMapView';
import { CreateListingModal } from './components/CreateListingModal';
import { MyPageView } from './components/MyPageView';

function getCurrentHHMM(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

const PARTNER_LANDMARKS = [
  '白いトートバッグ・蓮のうちわ',
  'ラベンダー色のパーカー・クリアポーチ',
  '黒のミニショルダー・銀テホルダー',
  'ピンクのリボン付き痛バ',
];

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [listings, setListings] = useState<TradeListing[]>(INITIAL_LISTINGS);
  const [activeTrades, setActiveTrades] = useState<Record<string, ActiveTrade>>(
    INITIAL_ACTIVE_TRADES,
  );
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);

  // Filters
  const [directionFilter, setDirectionFilter] = useState<'all' | TradeDirection>('all');
  const [memberFilter, setMemberFilter] = useState<string>('すべて');
  const [categoryFilter, setCategoryFilter] = useState<string>('すべて');
  const [spotFilter, setSpotFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredListings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return listings.filter((item) => {
      if (directionFilter !== 'all' && item.direction !== directionFilter) return false;
      if (memberFilter !== 'すべて' && item.member !== memberFilter) return false;
      if (categoryFilter !== 'すべて' && item.category !== categoryFilter) return false;
      if (spotFilter !== 'all' && item.spotId !== spotFilter) return false;
      if (q) {
        const hay = `${item.giveItem} ${item.wantItem} ${item.spotName} ${item.member} ${item.category} ${item.userNickname}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [listings, directionFilter, memberFilter, categoryFilter, spotFilter, searchQuery]);

  const activeTradeList = useMemo(() => {
    return Object.values(activeTrades)
      .map((trade) => ({
        trade,
        listing: listings.find((l) => l.id === trade.listingId),
      }))
      .filter((entry): entry is { trade: ActiveTrade; listing: TradeListing } =>
        Boolean(entry.listing),
      );
  }, [activeTrades, listings]);

  const inProgressCount = useMemo(
    () => activeTradeList.filter((t) => t.trade.step < 4).length,
    [activeTradeList],
  );

  const totalUnreadCount = useMemo(
    () => activeTradeList.reduce((acc, item) => acc + item.trade.unreadCount, 0),
    [activeTradeList],
  );

  const completedSessionCount = useMemo(
    () => activeTradeList.filter((t) => t.trade.step === 4).length,
    [activeTradeList],
  );

  const handleOpenTrade = (listing: TradeListing) => {
    setActiveTrades((prev) => {
      const existing = prev[listing.id];
      if (existing) {
        return {
          ...prev,
          [listing.id]: {
            ...existing,
            unreadCount: 0,
          },
        };
      }
      const landmark =
        PARTNER_LANDMARKS[Math.floor(Math.random() * PARTNER_LANDMARKS.length)];
      return {
        ...prev,
        [listing.id]: {
          listingId: listing.id,
          step: 1,
          unreadCount: 0,
          updatedAt: 'たった今',
          partnerLandmark: landmark,
          messages: [
            {
              id: `sys-${Date.now()}`,
              sender: 'system',
              text: `「${listing.spotName}」での手渡しマッチングが確定しました（住所非公開・送料0円）`,
              timestamp: getCurrentHHMM(),
            },
            {
              id: `pt-${Date.now() + 1}`,
              sender: 'partner',
              text: `リクエストありがとうございます！${listing.timeWindow}頃、${listing.spotName}で大丈夫でしょうか？目印は「${landmark}」です！`,
              timestamp: getCurrentHHMM(),
            },
          ],
        },
      };
    });
    setSelectedListingId(listing.id);
  };

  const handleAdvanceStep = (listingId: string, nextStep: TradeStep) => {
    const stepText: Record<TradeStep, string> = {
      1: 'マッチングが確定しました',
      2: 'あなたが「現地到着」にステータスを更新しました',
      3: '相手と合流しました！グッズ・チケットの状態を相互確認してください',
      4: '手渡し取引が完了しました！お互いの信頼スコアがアップしました',
    };

    setActiveTrades((prev) => {
      const current = prev[listingId];
      if (!current) return prev;
      return {
        ...prev,
        [listingId]: {
          ...current,
          step: nextStep,
          updatedAt: 'たった今',
          messages: [
            ...current.messages,
            {
              id: `step-${Date.now()}`,
              sender: 'system',
              text: stepText[nextStep],
              timestamp: getCurrentHHMM(),
            },
          ],
        },
      };
    });

    if (nextStep === 2 || nextStep === 3) {
      const listing = listings.find((l) => l.id === listingId);
      setTimeout(() => {
        setActiveTrades((prev) => {
          const current = prev[listingId];
          if (!current) return prev;
          const reply =
            nextStep === 2
              ? `私も今${listing?.spotName ?? '指定場所'}に向かっています！あと2〜3分で着きます。`
              : '確認できました！とても綺麗な状態で安心しました！';
          return {
            ...prev,
            [listingId]: {
              ...current,
              messages: [
                ...current.messages,
                {
                  id: `auto-${Date.now()}`,
                  sender: 'partner',
                  text: reply,
                  timestamp: getCurrentHHMM(),
                },
              ],
            },
          };
        });
      }, 500);
    }
  };

  const handleSendMessage = (listingId: string, text: string) => {
    setActiveTrades((prev) => {
      const current = prev[listingId];
      if (!current) return prev;
      return {
        ...prev,
        [listingId]: {
          ...current,
          updatedAt: 'たった今',
          messages: [
            ...current.messages,
            {
              id: `me-${Date.now()}`,
              sender: 'me',
              text,
              timestamp: getCurrentHHMM(),
            },
          ],
        },
      };
    });

    setTimeout(() => {
      setActiveTrades((prev) => {
        const current = prev[listingId];
        if (!current) return prev;
        let autoReply = '承知しました！そのままお待ちください。';
        if (text.includes('目印')) {
          autoReply = `目印ありがとうございます！私も「${current.partnerLandmark}」で分かりやすくしておきます！`;
        } else if (text.includes('時計台') || text.includes('います')) {
          autoReply = '確認しました！すぐ近くにいるので今向かいます！';
        } else if (text.includes('ありがとう')) {
          autoReply = 'こちらこそ丁寧かつスムーズなお取引ありがとうございました！ライブ楽しみましょう！';
        }
        return {
          ...prev,
          [listingId]: {
            ...current,
            messages: [
              ...current.messages,
              {
                id: `partner-${Date.now()}`,
                sender: 'partner',
                text: autoReply,
                timestamp: getCurrentHHMM(),
              },
            ],
          },
        };
      });
    }, 550);
  };

  const handleCreateListing = (
    data: Omit<
      TradeListing,
      | 'id'
      | 'createdAt'
      | 'userNickname'
      | 'userAvatarColor'
      | 'userInitial'
      | 'trustScore'
      | 'completedTrades'
    >,
  ) => {
    const newListing: TradeListing = {
      ...data,
      id: `list-user-${Date.now()}`,
      userNickname: profile.nickname,
      userAvatarColor: 'from-violet-600 to-pink-600',
      userInitial: 'ゆ',
      trustScore: profile.trustScore,
      completedTrades: profile.completedCount + completedSessionCount,
      createdAt: 'たった今',
    };
    setListings((prev) => [newListing, ...prev]);
    setActiveTab('home');
  };

  const selectedListing = selectedListingId
    ? listings.find((l) => l.id === selectedListingId) ?? null
    : null;
  const selectedTrade = selectedListingId ? activeTrades[selectedListingId] ?? null : null;

  const activeSpotObj = VENUE_SPOTS.find((s) => s.id === spotFilter);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6FA] text-slate-900 pb-20 md:pb-10">
      {/* Top Bar (3-zone contract on desktop, compact <=48px on mobile) */}
      <header className="sticky top-0 z-30 h-12 md:h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-700 to-pink-600 bg-clip-text text-transparent whitespace-nowrap shrink-0 cursor-pointer"
          >
            OshiPass
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'home'
                  ? 'border-violet-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ホーム
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trades')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'trades'
                  ? 'border-violet-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <span>取引中</span>
              {(inProgressCount > 0 || totalUnreadCount > 0) && (
                <span className="font-mono-num text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-pink-600 text-white leading-none">
                  {totalUnreadCount > 0 ? totalUnreadCount : inProgressCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'map'
                  ? 'border-violet-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              会場マップ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mypage')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'mypage'
                  ? 'border-violet-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              マイページ
            </button>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              aria-label="会場マップを開く"
              className="md:hidden min-w-[40px] min-h-[40px] rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-violet-600" />
            </button>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="min-h-[36px] md:min-h-[40px] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs md:text-sm font-semibold inline-flex items-center gap-1.5 hover:from-violet-700 hover:to-pink-700 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>募集を投稿</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 md:py-6 space-y-5">
        {activeTab === 'home' && (
          <>
            {/* 1. Event & Venue Status Area */}
            <section className="rounded-2xl bg-gradient-to-r from-violet-700 via-purple-700 to-pink-600 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-violet-100 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>{EVENT_INFO.areaStatus}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{EVENT_INFO.dateLabel}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-balance">
                  {EVENT_INFO.title}
                </h1>
                <p className="text-xs text-violet-100/90">
                  住所・本名は非公開 · 送料0円 · 定型ワンタップ連絡でそのまま現地手渡し
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-white text-violet-900 hover:bg-violet-50 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shrink-0 transition-colors cursor-pointer whitespace-nowrap"
              >
                <MapIcon className="w-4 h-4 text-violet-700 shrink-0" />
                <span>東京ドーム 会場MAP</span>
              </button>
            </section>

            {/* 2. Tag Filter & Search Area */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 space-y-3.5">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* 譲 / 求 One-Tap Segmented Tabs */}
                <div
                  className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl shrink-0 md:w-80"
                  role="tablist"
                  aria-label="取引方向フィルタ"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={directionFilter === 'all'}
                    onClick={() => setDirectionFilter('all')}
                    className={`min-h-[40px] rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      directionFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    すべて
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={directionFilter === 'give'}
                    onClick={() => setDirectionFilter('give')}
                    className={`min-h-[40px] rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      directionFilter === 'give'
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    譲（譲ります）
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={directionFilter === 'want'}
                    onClick={() => setDirectionFilter('want')}
                    className={`min-h-[40px] rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      directionFilter === 'want'
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    求（探してます）
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="アイテム名・22ゲート・メンバー名で検索..."
                    className="w-full min-h-[44px] pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Member & Category Filter Rows */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1">
                    推し：
                  </span>
                  {MEMBER_FILTERS.map((member) => (
                    <button
                      key={member}
                      type="button"
                      onClick={() => setMemberFilter(member)}
                      className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        memberFilter === member
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {member}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1">
                    種別：
                  </span>
                  {CATEGORY_FILTERS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Spot Filter Indicator */}
              {activeSpotObj && (
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-medium text-violet-800">
                    <MapPin className="w-3.5 h-3.5" />
                    場所絞り込み中：{activeSpotObj.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSpotFilter('all')}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    解除
                  </button>
                </div>
              )}
            </section>

            {/* 3. Trade Listings Header + Grid */}
            <section className="space-y-3">
              <div className="flex items-center justify-between px-0.5">
                <h2 className="text-sm font-bold text-slate-800">
                  東京ドーム周辺の現地手渡し募集
                </h2>
                <span className="text-xs text-slate-500 font-mono-num">
                  {filteredListings.length}件表示
                </span>
              </div>

              {filteredListings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-violet-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-800">
                    条件に一致する現地募集が見つかりませんでした
                  </p>
                  <p className="text-xs text-slate-500">
                    フィルタをリセットするか、「募集を投稿」から自分でリクエストを出してみましょう。
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDirectionFilter('all');
                      setMemberFilter('すべて');
                      setCategoryFilter('すべて');
                      setSpotFilter('all');
                      setSearchQuery('');
                    }}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                  >
                    フィルタをすべてリセット
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      activeTrade={activeTrades[listing.id]}
                      onOpenTrade={handleOpenTrade}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'trades' && (
          <section className="space-y-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">進行中・完了した現地取引</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  タップしてワンタップ定型文チャットやステータス更新を行えます
                </p>
              </div>
              <span className="text-xs font-mono-num text-slate-600">
                全 {activeTradeList.length}件
              </span>
            </div>

            {activeTradeList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-3">
                <MessageCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-800">
                  進行中の取引はまだありません
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-semibold cursor-pointer"
                >
                  ホームでグッズ・チケットを探す
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTradeList.map(({ trade, listing }) => {
                  const lastMsg = trade.messages[trade.messages.length - 1];
                  return (
                    <button
                      key={listing.id}
                      type="button"
                      onClick={() => handleOpenTrade(listing)}
                      className="w-full text-left bg-white rounded-2xl border border-slate-200/90 hover:border-violet-300 p-4 flex items-center gap-3.5 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-11 h-11 rounded-full bg-gradient-to-br ${listing.userAvatarColor} text-white font-bold flex items-center justify-center shrink-0`}
                      >
                        {listing.userInitial}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {listing.userNickname}
                          </span>
                          <span
                            className={`text-[11px] font-semibold whitespace-nowrap ${
                              trade.step === 4 ? 'text-emerald-700' : 'text-violet-700'
                            }`}
                          >
                            {trade.step === 1 && '① マッチング確定'}
                            {trade.step === 2 && '② 現地到着'}
                            {trade.step === 3 && '③ 手渡し・確認中'}
                            {trade.step === 4 && '④ 取引完了'}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-800 truncate">
                          譲：{listing.giveItem} ↔ 求：{listing.wantItem}
                        </p>
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                          <span className="truncate">{lastMsg?.text}</span>
                          <span className="font-mono-num shrink-0">{trade.updatedAt}</span>
                        </div>
                      </div>

                      {trade.unreadCount > 0 && (
                        <span className="w-6 h-6 rounded-full bg-pink-600 text-white text-xs font-bold font-mono-num flex items-center justify-center shrink-0">
                          {trade.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === 'map' && (
          <VenueMapView
            spots={VENUE_SPOTS}
            listings={listings}
            onSelectSpotForFilter={(spotId) => {
              setSpotFilter(spotId);
              setActiveTab('home');
            }}
            onOpenTrade={handleOpenTrade}
          />
        )}

        {activeTab === 'mypage' && (
          <MyPageView
            profile={profile}
            completedSessionCount={completedSessionCount}
            onUpdateProfile={setProfile}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (56px height, 44px+ hitboxes) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200/90"
        aria-label="メインナビゲーション"
      >
        <div className="grid grid-cols-4 h-full max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
              activeTab === 'home' ? 'text-violet-700' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5" strokeWidth={activeTab === 'home' ? 2.4 : 1.8} />
            <span className="text-[10px] font-semibold">ホーム</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trades')}
            className={`relative min-h-[44px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
              activeTab === 'trades' ? 'text-violet-700' : 'text-slate-500'
            }`}
          >
            <div className="relative">
              <ArrowLeftRight
                className="w-5 h-5"
                strokeWidth={activeTab === 'trades' ? 2.4 : 1.8}
              />
              {(inProgressCount > 0 || totalUnreadCount > 0) && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-pink-600 text-white text-[10px] font-bold font-mono-num flex items-center justify-center leading-none">
                  {totalUnreadCount > 0 ? totalUnreadCount : inProgressCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">取引中</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
              activeTab === 'map' ? 'text-violet-700' : 'text-slate-500'
            }`}
          >
            <MapIcon className="w-5 h-5" strokeWidth={activeTab === 'map' ? 2.4 : 1.8} />
            <span className="text-[10px] font-semibold">会場マップ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mypage')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
              activeTab === 'mypage' ? 'text-violet-700' : 'text-slate-500'
            }`}
          >
            <User className="w-5 h-5" strokeWidth={activeTab === 'mypage' ? 2.4 : 1.8} />
            <span className="text-[10px] font-semibold">マイページ</span>
          </button>
        </div>
      </nav>

      {/* Interactive Trade Progress & Quick-Chat Modal */}
      {selectedListing && selectedTrade && (
        <TradeModal
          listing={selectedListing}
          trade={selectedTrade}
          profile={profile}
          onClose={() => setSelectedListingId(null)}
          onAdvanceStep={handleAdvanceStep}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* New Listing Modal */}
      {isCreateOpen && (
        <CreateListingModal
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreateListing}
        />
      )}
    </div>
  );
}
