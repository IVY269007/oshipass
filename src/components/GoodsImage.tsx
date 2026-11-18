import { useState } from 'react';
import { Package } from 'lucide-react';

interface GoodsImageProps {
  src: string;
  alt: string;
  category: string;
  className?: string;
}

export function GoodsImage({ src, alt, category, className = '' }: GoodsImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-violet-100 via-fuchsia-50 to-slate-100 text-violet-700 p-3 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Package className="w-6 h-6 mb-1 opacity-80" strokeWidth={1.75} />
        <span className="text-[11px] font-medium leading-tight">{category}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`object-cover bg-slate-100 ${className}`}
      loading="lazy"
    />
  );
}
