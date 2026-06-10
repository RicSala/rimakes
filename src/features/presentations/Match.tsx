'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '@/shared/lib/utils';

// useLayoutEffect warns during SSR; this component is client-only (React.lazy
// across the RSC boundary) but guard anyway so measuring stays crisp on the
// client without the warning.
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * `{% pair %}` is folded into `Match`'s `pairs` prop by the `match` tag's
 * transform (see custom-components.tsx) — like `quiz`/`option`, the nested tags
 * can't be read as React children because Markdoc client components are
 * `React.lazy`-wrapped across the RSC boundary, so the parent could never match
 * them by identity. This passthrough renderer is only a fallback if a
 * `{% pair %}` is authored outside a `{% match %}`.
 */
export function MatchPair(_props: { left?: string; right?: string }) {
  return null;
}

export type MatchPairData = { left: string; right: string };

// Stable, deterministic scramble of the right column so SSR and the first client
// render agree (no hydration mismatch) and the answers never flash pre-aligned.
// `Reiniciar` swaps in a real random shuffle — a client-only event, so
// Math.random is fine there.
function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return hash;
}
function deterministicOrder(pairs: MatchPairData[]) {
  const order = pairs.map((_, index) => index);
  order.sort(
    (a, b) => hashString(pairs[a].right) - hashString(pairs[b].right) || a - b
  );
  // Guard against the scramble coming out as identity (a give-away quiz).
  const isIdentity = order.every((pairIndex, slot) => pairIndex === slot);
  return isIdentity && order.length > 1 ? [...order.slice(1), order[0]] : order;
}
function shuffledOrder(length: number) {
  const order = Array.from({ length }, (_, index) => index);
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

// Distinct line colors before checking (so several connections are tellable
// apart); after checking, every line goes green (right) or red (wrong). Literal
// classes so Tailwind's JIT keeps them.
const LINE_COLORS = [
  'text-indigo-500',
  'text-sky-500',
  'text-violet-500',
  'text-emerald-500',
  'text-amber-500',
  'text-fuchsia-500',
  'text-cyan-500',
  'text-rose-500',
];

const NODE_STATE = {
  idle: 'border-border bg-background hover:border-primary/50 hover:bg-primary/[0.04] hover:shadow-sm',
  pending: 'border-primary bg-primary/[0.06] ring-2 ring-primary/40 shadow-sm',
  linked: 'border-primary/40 bg-primary/[0.04]',
  correct: 'border-green-500/70 bg-green-50 text-green-950 ring-1 ring-green-500/30',
  wrong: 'border-red-500/70 bg-red-50 text-red-950 ring-1 ring-red-500/30',
} as const;

const DOT_STATE = {
  idle: 'border-muted-foreground/30',
  pending: 'border-primary bg-primary',
  linked: 'border-primary bg-primary/70',
  correct: 'border-green-500 bg-green-500',
  wrong: 'border-red-500 bg-red-500',
} as const;

type NodeState = keyof typeof NODE_STATE;
type Side = 'left' | 'right';
type Anchor = {
  L: number;
  R: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

function scoreBg(ratio: number) {
  if (ratio === 1) return 'bg-green-500';
  if (ratio >= 0.5) return 'bg-amber-500';
  return 'bg-red-500';
}

export function Match({
  title,
  instructions,
  pairs = [],
}: {
  title?: string;
  instructions?: string;
  pairs?: MatchPairData[];
}) {
  const total = pairs.length;

  const [rightOrder, setRightOrder] = useState<number[]>(() =>
    deterministicOrder(pairs)
  );
  // leftPairIndex -> rightPairIndex
  const [links, setLinks] = useState<Record<number, number>>({});
  const [pending, setPending] = useState<{ side: Side; index: number } | null>(
    null
  );
  const [checked, setChecked] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rightRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [anchors, setAnchors] = useState<Anchor[]>([]);

  // Re-measure the endpoints of every connection (right edge of the left node →
  // left edge of the matched right node), relative to the container.
  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const box = container.getBoundingClientRect();
    const next: Anchor[] = [];
    for (const [key, R] of Object.entries(links)) {
      const L = Number(key);
      const leftNode = leftRefs.current[L];
      const rightNode = rightRefs.current[R];
      if (!leftNode || !rightNode) continue;
      const lb = leftNode.getBoundingClientRect();
      const rb = rightNode.getBoundingClientRect();
      next.push({
        L,
        R,
        x1: lb.right - box.left,
        y1: lb.top + lb.height / 2 - box.top,
        x2: rb.left - box.left,
        y2: rb.top + rb.height / 2 - box.top,
      });
    }
    setAnchors(next);
  }, [links]);

  useIsoLayoutEffect(() => {
    recompute();
  }, [recompute, rightOrder]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => recompute());
    observer.observe(container);
    window.addEventListener('resize', recompute);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, [recompute]);

  if (total === 0) return null;

  const connectedCount = Object.keys(links).length;
  const allConnected = connectedCount === total;
  const correctCount = Object.entries(links).reduce(
    (count, [L, R]) => count + (Number(L) === R ? 1 : 0),
    0
  );

  const select = (side: Side, index: number) => {
    if (checked) return;
    // Re-clicking the current selection clears it.
    if (pending && pending.side === side && pending.index === index) {
      setPending(null);
      return;
    }
    // A node on the opposite column is selected → make (or toggle) a connection.
    if (pending && pending.side !== side) {
      const L = side === 'left' ? index : pending.index;
      const R = side === 'right' ? index : pending.index;
      setLinks((prev) => {
        const next = { ...prev };
        if (next[L] === R) {
          delete next[L]; // toggle an existing exact link back off
          return next;
        }
        // Each left and each right participates in at most one connection.
        delete next[L];
        for (const k of Object.keys(next)) {
          if (next[Number(k)] === R) delete next[Number(k)];
        }
        next[L] = R;
        return next;
      });
      setPending(null);
      return;
    }
    // Same column (or nothing pending yet) → just select this node.
    setPending({ side, index });
  };

  const reset = () => {
    setLinks({});
    setPending(null);
    setChecked(false);
    setRightOrder(shuffledOrder(total));
  };

  const leftState = (L: number): NodeState => {
    if (checked && links[L] !== undefined) return links[L] === L ? 'correct' : 'wrong';
    if (pending?.side === 'left' && pending.index === L) return 'pending';
    if (links[L] !== undefined) return 'linked';
    return 'idle';
  };
  const rightSourceOf = (R: number) => {
    const found = Object.entries(links).find(([, value]) => value === R);
    return found ? Number(found[0]) : null;
  };
  const rightState = (R: number): NodeState => {
    const source = rightSourceOf(R);
    if (checked && source !== null) return source === R ? 'correct' : 'wrong';
    if (pending?.side === 'right' && pending.index === R) return 'pending';
    if (source !== null) return 'linked';
    return 'idle';
  };

  return (
    <div className='not-prose my-6 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7'>
      {/* Header: title / instructions + progress */}
      <div className='mb-5 flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          {title ? (
            <div className='text-sm font-bold text-card-foreground'>{title}</div>
          ) : null}
          <div className='text-xs text-muted-foreground'>
            {instructions ??
              'Toca un elemento de cada columna para unirlos; vuelve a tocarlo para soltar.'}
          </div>
        </div>
        <span className='shrink-0 text-xs font-medium tabular-nums text-muted-foreground'>
          {checked ? `${correctCount} / ${total}` : `${connectedCount} / ${total}`}
        </span>
      </div>

      <div ref={containerRef} className='relative'>
        {/* Connector lines drawn over the gap between the two columns. */}
        <svg
          className='pointer-events-none absolute inset-0 z-10 h-full w-full'
          aria-hidden
        >
          {anchors.map((anchor) => {
            const status = checked
              ? anchor.L === anchor.R
                ? 'text-green-500'
                : 'text-red-500'
              : LINE_COLORS[anchor.L % LINE_COLORS.length];
            const dx = Math.abs(anchor.x2 - anchor.x1);
            const curve = Math.max(28, dx * 0.4);
            const d = `M ${anchor.x1} ${anchor.y1} C ${anchor.x1 + curve} ${anchor.y1}, ${anchor.x2 - curve} ${anchor.y2}, ${anchor.x2} ${anchor.y2}`;
            return (
              <g key={`${anchor.L}-${anchor.R}`} className={status}>
                <path
                  d={d}
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2.5}
                  strokeLinecap='round'
                  className='duration-200 animate-in fade-in'
                />
                <circle cx={anchor.x1} cy={anchor.y1} r={4} fill='currentColor' />
                <circle cx={anchor.x2} cy={anchor.y2} r={4} fill='currentColor' />
              </g>
            );
          })}
        </svg>

        <div className='grid grid-cols-2 gap-x-10 sm:gap-x-16'>
          {/* Left column — fixed order */}
          <ul className='space-y-2.5'>
            {pairs.map((pair, L) => {
              const state = leftState(L);
              return (
                <li key={L}>
                  <button
                    type='button'
                    ref={(element) => {
                      leftRefs.current[L] = element;
                    }}
                    onClick={() => select('left', L)}
                    disabled={checked}
                    aria-pressed={pending?.side === 'left' && pending.index === L}
                    className={cn(
                      'group flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[0.95rem] font-medium leading-snug transition-all duration-150 disabled:cursor-default',
                      NODE_STATE[state]
                    )}
                  >
                    <span className='min-w-0 flex-1'>{pair.left}</span>
                    <span
                      className={cn(
                        'size-3 shrink-0 rounded-full border-2 transition-colors',
                        DOT_STATE[state]
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right column — scrambled order */}
          <ul className='space-y-2.5'>
            {rightOrder.map((pairIndex) => {
              const state = rightState(pairIndex);
              return (
                <li key={pairIndex}>
                  <button
                    type='button'
                    ref={(element) => {
                      rightRefs.current[pairIndex] = element;
                    }}
                    onClick={() => select('right', pairIndex)}
                    disabled={checked}
                    aria-pressed={
                      pending?.side === 'right' && pending.index === pairIndex
                    }
                    className={cn(
                      'group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[0.95rem] leading-snug transition-all duration-150 disabled:cursor-default',
                      NODE_STATE[state]
                    )}
                  >
                    <span
                      className={cn(
                        'size-3 shrink-0 rounded-full border-2 transition-colors',
                        DOT_STATE[state]
                      )}
                    />
                    <span className='min-w-0 flex-1'>{pairs[pairIndex].right}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Footer: reset + check / score */}
      <div className='mt-5 flex items-center justify-between gap-3'>
        <button
          type='button'
          onClick={reset}
          className='text-xs font-medium text-muted-foreground transition hover:text-foreground'
        >
          ↺ Reiniciar
        </button>
        {checked ? (
          <span
            className={cn(
              'shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white',
              scoreBg(total ? correctCount / total : 0)
            )}
          >
            {correctCount === total
              ? '¡Todas! 🎉'
              : `${correctCount}/${total} correctas`}
          </span>
        ) : (
          <button
            type='button'
            onClick={() => setChecked(true)}
            disabled={!allConnected}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition',
              allConnected
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'cursor-not-allowed bg-muted text-muted-foreground'
            )}
          >
            Comprobar <span aria-hidden>✓</span>
          </button>
        )}
      </div>
    </div>
  );
}
