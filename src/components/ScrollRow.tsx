import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Fileira com rolagem lateral e setas que aparecem quando há mais opções para aquele lado. */
export const ScrollRow: React.FC<{ children: React.ReactNode; className?: string; label?: string }> = ({ children, className = '', label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * Math.max(200, ref.current.clientWidth * 0.7), behavior: 'smooth' });

  const arrow = (dir: 1 | -1) => (
    <button
      type="button"
      onClick={() => scroll(dir)}
      aria-label={dir === 1 ? `Mais opções${label ? ` de ${label}` : ''} à direita` : `Mais opções${label ? ` de ${label}` : ''} à esquerda`}
      className={`absolute top-[calc(50%-4px)] -translate-y-1/2 ${dir === 1 ? 'right-0' : 'left-0'} z-10 w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-md text-[var(--text-main)] hover:text-[var(--primary)] hover:border-[var(--primary)] flex items-center justify-center cursor-pointer transition-colors`}
    >
      {dir === 1 ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
    </button>
  );

  return (
    <div className="relative">
      {canLeft && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-14 z-[5] bg-gradient-to-r from-[var(--surface)] to-transparent" />
          {arrow(-1)}
        </>
      )}
      <div ref={ref} onScroll={update} className={`overflow-x-auto scrollbar-none scroll-smooth ${className}`}>
        {children}
      </div>
      {canRight && (
        <>
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-14 z-[5] bg-gradient-to-l from-[var(--surface)] to-transparent" />
          {arrow(1)}
        </>
      )}
    </div>
  );
};
