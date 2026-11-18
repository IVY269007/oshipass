export type TradeDirection = 'give' | 'want';
export type GoodsCategory = '缶バッジ' | 'アクスタ' | 'トレカ' | 'チケット' | 'ペンライト';
export type MemberName = '蓮（Ren）' | '蒼（Ao）' | '陽向（Hinata）' | '湊（Minato）' | '全体・箱';
export type TradeStep = 1 | 2 | 3 | 4;
export type AppTab = 'home' | 'trades' | 'map' | 'mypage';

export interface TradeListing {
  id: string;
  direction: TradeDirection;
  userNickname: string;
  userAvatarColor: string;
  userInitial: string;
  trustScore: number;
  completedTrades: number;
  member: MemberName;
  category: GoodsCategory;
  giveItem: string;
  wantItem: string;
  spotId: string;
  spotName: string;
  timeWindow: string;
  imageUrl: string;
  note: string;
  createdAt: string;
  isNew?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'partner' | 'system';
  text: string;
  timestamp: string;
}

export interface ActiveTrade {
  listingId: string;
  step: TradeStep;
  unreadCount: number;
  messages: ChatMessage[];
  updatedAt: string;
  partnerLandmark: string;
}

export interface VenueSpot {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  landmarkHint: string;
  crowdLevel: '空きあり' | 'やや混雑' | '混雑';
  x: number;
  y: number;
}

export interface UserProfile {
  nickname: string;
  personaName: string;
  trustScore: number;
  completedCount: number;
  onTimeRate: number;
  bagLandmark: string;
  penlightColor: string;
  outfitLandmark: string;
}
