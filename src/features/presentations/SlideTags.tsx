import {
  AlertTriangle,
  BookOpen,
  GraduationCap,
  MousePointerClick,
  Tag,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

type TagStyle = { Icon: LucideIcon; className: string };

/**
 * Visual identity per tag. The LABELS are authored in Keystatic (content); the
 * icon + color live here in code (design). To add a new style, add one entry —
 * keyed by the lowercased label. Unknown labels fall back to a neutral chip.
 *
 * Light-on-tint chips read well over both the white and indigo backgrounds, so
 * they don't need a dark-mode variant.
 */
const TAG_STYLES: Record<string, TagStyle> = {
  advanced: {
    Icon: GraduationCap,
    className: 'border-amber-300/60 bg-amber-100 text-amber-900',
  },
  theory: {
    Icon: BookOpen,
    className: 'border-sky-300/60 bg-sky-100 text-sky-900',
  },
  skills: {
    Icon: Wrench,
    className: 'border-emerald-300/60 bg-emerald-100 text-emerald-900',
  },
  practice: {
    Icon: Zap,
    className: 'border-violet-300/60 bg-violet-100 text-violet-900',
  },
  warning: {
    Icon: AlertTriangle,
    className: 'border-red-300/60 bg-red-100 text-red-900',
  },
  // A saturated gradient pill (instead of the light-on-tint chips above) so the
  // "do something on your screen" slides — quizzes & matches — stand out as
  // special. The soft inner ring + drop shadow give it a polished, raised feel,
  // and the white text reads cleanly over both the white and indigo backgrounds.
  interactivo: {
    Icon: MousePointerClick,
    className:
      'border-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md shadow-fuchsia-500/25 ring-1 ring-inset ring-white/25',
  },
};

const DEFAULT_TAG_STYLE: TagStyle = {
  Icon: Tag,
  className: 'border-border bg-muted text-muted-foreground',
};

/**
 * The corner tag rail. Positioned absolutely against its parent (the content
 * wrapper), so the chips align to the content's right edge rather than flying
 * to the screen corner on wide displays.
 */
export function SlideTags({ labels }: { labels: string[] }) {
  return (
    <div className='pointer-events-none absolute right-6 top-6 z-30 flex max-w-[70%] flex-wrap justify-end gap-2 animate-in fade-in duration-500'>
      {labels.map((label) => {
        const { Icon, className } =
          TAG_STYLES[label.toLowerCase()] ?? DEFAULT_TAG_STYLE;
        return (
          <span
            key={label}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm ${className}`}
          >
            <Icon className='h-3.5 w-3.5' aria-hidden />
            {label}
          </span>
        );
      })}
    </div>
  );
}
