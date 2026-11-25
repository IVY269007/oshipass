import { CheckCircle2, Lock, MonitorSmartphone, ShieldCheck, Star, Tag } from 'lucide-react';
import type { UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface MyPageViewProps {
  profile: UserProfile;
  completedSessionCount: number;
  onUpdateProfile: (next: UserProfile) => void;
}

const BAG_OPTIONS = ['黒のリュック', '白の痛バッグ', 'パープルのトート', 'ショルダーバッグ'];
const PENLIGHT_OPTIONS = ['ピンクのペンライト', 'パープルのうちわ', '白いキャップ', 'クリアポーチ'];

export function MyPageView({
  profile,
  completedSessionCount,
  onUpdateProfile,
}: MyPageViewProps) {
  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Anonymous Profile Header Card */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 text-white font-bold text-xl flex items-center justify-center shrink-0">
              ゆ
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{profile.nickname}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                本人確認済みアカウント · 公開名は匿名ニックネームのみ
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-1.5 font-mono-num">
                <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {profile.trustScore.toFixed(1)}
                </span>
                <span aria-hidden="true">·</span>
                <span>現地完了 {profile.completedCount + completedSessionCount}件</span>
                <span aria-hidden="true">·</span>
                <span>時間厳守率 {profile.onTimeRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Shield */}
        <div className="p-3.5 rounded-xl bg-violet-50/70 border border-violet-100 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-violet-700 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-violet-950">
              個人情報ゼロ露出モード有効（住所・本名は非開示）
            </p>
            <p className="leading-relaxed">
              登録情報（{profile.personaName}）は運営の本人確認にのみ使用され、取引相手に住所・本名・電話番号が共有されることはありません。送料も0円です。
            </p>
          </div>
        </div>
      </section>

      {/* One-Tap Landmark Preset (Syncs with Trade Chat!) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-violet-600" />
          <h3 className="text-sm font-bold text-slate-900">
            今日の「合流の目印」ワンタップ設定
          </h3>
        </div>
        <p className="text-xs text-slate-600">
          ここで設定した目印は、取引チャットのワンタップ定型文ボタンに自動反映されます。
        </p>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-1.5">バッグ・持ち物</p>
            <div className="flex flex-wrap gap-2">
              {BAG_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onUpdateProfile({ ...profile, bagLandmark: opt })}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    profile.bagLandmark === opt
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700 mb-1.5">推しグッズ・目印</p>
            <div className="flex flex-wrap gap-2">
              {PENLIGHT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onUpdateProfile({ ...profile, penlightColor: opt })}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    profile.penlightColor === opt
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
            チャット送信プレビュー：
            <span className="font-semibold text-slate-900 ml-1">
              「目印：{profile.bagLandmark}と{profile.penlightColor}」
            </span>
          </div>
        </div>
      </section>

      {/* Safety Checklist */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">安全な現地手渡しルール</h3>
        </div>
        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>グッズの傷・折れはその場で双方確認してから「完了」をタップしてください。</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>合流は22ゲート前や駅改札外など、明るく人通りの多い場所のみを指定できます。</span>
          </li>
        </ul>
      </section>

      {/* Desktop / Mobile PWA Installation */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <MonitorSmartphone className="w-4 h-4 text-violet-600" />
          <h3 className="text-sm font-bold text-slate-900">デスクトップ・ホーム画面にインストール</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          PC（Chrome / Edge）やスマートフォンにアプリとして追加すると、ブラウザのタブに埋もれず専用ウィンドウで素早く起動できます。
        </p>
        <PWAInstallButton variant="card" />
      </section>
    </div>
  );
}
