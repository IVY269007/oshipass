import { useState } from 'react';
import { Download, MonitorSmartphone, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card';
}

export function PWAInstallButton({ variant = 'header' }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {variant === 'header' ? (
        <button
          type="button"
          onClick={handleClick}
          title="PC・スマホにアプリとしてインストール"
          className="min-h-[36px] md:min-h-[40px] px-3 py-1.5 rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">アプリ化</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <MonitorSmartphone className="w-4 h-4 shrink-0" />
          <span>
            {isInstallable
              ? 'このPC / 端末にアプリをインストール'
              : 'PC・スマホへのアプリインストール方法'}
          </span>
        </button>
      )}

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 backdrop-blur-sm p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-title"
        >
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 text-white flex items-center justify-center shrink-0">
                  <MonitorSmartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="pwa-guide-title" className="text-base font-bold text-slate-900">
                    OshiPass をアプリとしてインストール
                  </h3>
                  <p className="text-xs text-slate-500">
                    PCデスクトップ・ホーム画面から即起動できます
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="閉じる"
                className="min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <ol className="space-y-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                <li className="flex items-start gap-2">
                  <span className="font-mono-num font-bold text-violet-700">1.</span>
                  <span>
                    Safari下部の <Share className="w-3.5 h-3.5 inline mx-0.5 text-violet-700" />{' '}
                    <strong>共有</strong> ボタンをタップします。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono-num font-bold text-violet-700">2.</span>
                  <span>
                    スクロールして <strong>「ホーム画面に追加」</strong> を選択します。
                  </span>
                </li>
              </ol>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                <p className="font-semibold text-slate-900">PC（Chrome / Edge）でのインストール手順</p>
                <ol className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-mono-num font-bold text-violet-700">1.</span>
                    <span>
                      ブラウザ上部のアドレスバー右端にある <strong>インストールアイコン</strong>（モニター＋下矢印）をクリックします。
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono-num font-bold text-violet-700">2.</span>
                    <span>
                      アイコンが出ない場合は、ブラウザ右上メニュー（⋮）→{' '}
                      <strong>「キャスト、保存、共有」→「OshiPass をインストール」</strong> を選択してください。
                    </span>
                  </li>
                </ol>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/80">
                  ※ AI Studioのプレビュー枠（iframe内）で開いている場合は、単独タブでページを開くとワンクリックインストールが有効になります。
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="w-full min-h-[44px] rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-semibold hover:from-violet-700 hover:to-pink-700 cursor-pointer"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}
