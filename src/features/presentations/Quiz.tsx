'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { Portal } from '@/shared/components/Portal';
import { cn } from '@/shared/lib/utils';

// Markdown inside an option / explanation body renders without prose styles (the
// card is `not-prose`), so re-add the few inline marks that matter.
const RICH =
  '[&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_p]:my-0 [&_strong]:font-semibold [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5';

/**
 * `{% question %}` / `{% option %}` / `{% explanation %}` are consumed by the
 * `quiz` tag's transform (see `custom-components.tsx`), which folds them into
 * `Quiz`'s `questions` prop — they are NOT rendered as React children, because
 * Markdoc client components are `React.lazy`-wrapped across the RSC boundary, so a
 * parent could never identify them by component identity. These passthrough
 * renderers are only a fallback if one is authored outside a quiz.
 */
export function QuizQuestion({ children }: { text?: string; children?: ReactNode }) {
  return <>{children}</>;
}
export function QuizOption({ children }: { correct?: boolean; children?: ReactNode }) {
  return <>{children}</>;
}
export function QuizExplanation({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

/** One answer: `correct` plus its already-rendered body. */
export type QuizOptionData = { correct: boolean; body: ReactNode };
/** One question: prompt, its answers, and an optional post-answer explanation. */
export type QuizQuestionData = {
  text?: string;
  options: QuizOptionData[];
  explanation?: ReactNode;
};

const OPTION_STATE = {
  idle: 'border-border bg-background hover:border-primary/50 hover:bg-primary/[0.04] hover:shadow-sm',
  correct: 'border-green-500/70 bg-green-50 text-green-950 ring-1 ring-green-500/30',
  wrong: 'border-red-500/70 bg-red-50 text-red-950 ring-1 ring-red-500/30',
  muted: 'border-border bg-background/40 text-muted-foreground opacity-60',
} as const;

const BADGE_STATE = {
  idle: 'border-border bg-muted text-muted-foreground group-hover:border-primary/40 group-hover:text-foreground',
  correct: 'border-green-500 bg-green-500 text-white',
  wrong: 'border-red-500 bg-red-500 text-white',
  muted: 'border-border bg-muted text-muted-foreground',
} as const;

type OptionState = keyof typeof OPTION_STATE;

function OptionRow({
  option,
  index,
  answered,
  isSelected,
  onSelect,
}: {
  option: QuizOptionData;
  index: number;
  answered: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const state: OptionState = !answered
    ? 'idle'
    : option.correct
      ? 'correct'
      : isSelected
        ? 'wrong'
        : 'muted';
  const badge = !answered
    ? String.fromCharCode(65 + index)
    : option.correct
      ? '✓'
      : isSelected
        ? '✗'
        : String.fromCharCode(65 + index);

  return (
    <li>
      <button
        type='button'
        disabled={answered}
        onClick={onSelect}
        aria-pressed={isSelected}
        className={cn(
          'group flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left text-[0.95rem] transition-all duration-150 disabled:cursor-default',
          OPTION_STATE[state]
        )}
      >
        <span
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors',
            BADGE_STATE[state]
          )}
        >
          {badge}
        </span>
        <span className={cn('min-w-0 flex-1', RICH)}>{option.body}</span>
      </button>
    </li>
  );
}

function QuestionView({
  question,
  index,
  total,
  selected,
  onSelect,
  onNext,
  onReset,
}: {
  question: QuizQuestionData;
  index: number;
  total: number;
  selected: number | null;
  onSelect: (optionIndex: number) => void;
  onNext: () => void;
  onReset: () => void;
}) {
  const answered = selected !== null;
  const isLast = index === total - 1;
  const multi = total > 1;

  return (
    <div className='space-y-5'>
      {question.text ? (
        <p className='text-xl font-semibold leading-snug text-card-foreground'>
          {question.text}
        </p>
      ) : null}

      <ul className='space-y-2.5'>
        {question.options.map((option, optionIndex) => (
          <OptionRow
            key={optionIndex}
            option={option}
            index={optionIndex}
            answered={answered}
            isSelected={selected === optionIndex}
            onSelect={() => onSelect(optionIndex)}
          />
        ))}
      </ul>

      {answered && question.explanation ? (
        <div className='rounded-xl border border-border bg-muted/60 p-4 duration-200 animate-in fade-in slide-in-from-bottom-1'>
          <div className='mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            <span aria-hidden>💡</span> Explicación
          </div>
          <div className={cn('text-sm leading-relaxed text-card-foreground', RICH)}>
            {question.explanation}
          </div>
        </div>
      ) : null}

      {answered ? (
        <div className='flex items-center justify-between gap-3 pt-1'>
          <button
            type='button'
            onClick={onReset}
            className='text-xs font-medium text-muted-foreground transition hover:text-foreground'
          >
            ↺ Reiniciar
          </button>
          {multi ? (
            <button
              type='button'
              onClick={onNext}
              className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90'
            >
              {isLast ? 'Ver resultados' : 'Siguiente'} <span aria-hidden>→</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// Literal class strings (not built dynamically) so Tailwind's JIT detects them.
function scoreTone(ratio: number) {
  if (ratio >= 0.8)
    return { ring: 'text-green-500', bg: 'bg-green-500', emoji: '🎉', msg: '¡Dominado!' };
  if (ratio >= 0.5)
    return { ring: 'text-amber-500', bg: 'bg-amber-500', emoji: '👍', msg: 'Bien — repasa algún punto.' };
  return { ring: 'text-red-500', bg: 'bg-red-500', emoji: '📚', msg: 'A repasar con calma.' };
}

function ResultView({
  questions,
  answers,
  onRestart,
}: {
  questions: QuizQuestionData[];
  answers: (number | null)[];
  onRestart: () => void;
}) {
  const total = questions.length;
  const correct = questions.reduce((count, question, index) => {
    const pick = answers[index];
    return count + (pick !== null && question.options[pick]?.correct ? 1 : 0);
  }, 0);
  const ratio = total ? correct / total : 0;
  const tone = scoreTone(ratio);

  // Progress ring geometry.
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className='flex flex-col items-center gap-5 py-2 text-center duration-300 animate-in fade-in'>
      <div className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
        Resultado
      </div>

      <div className='relative flex size-32 items-center justify-center'>
        <svg viewBox='0 0 120 120' className='size-32 -rotate-90'>
          <circle
            cx='60'
            cy='60'
            r={radius}
            fill='none'
            strokeWidth='10'
            className='text-muted'
            stroke='currentColor'
          />
          <circle
            cx='60'
            cy='60'
            r={radius}
            fill='none'
            strokeWidth='10'
            strokeLinecap='round'
            className={cn('transition-[stroke-dashoffset] duration-700', tone.ring)}
            stroke='currentColor'
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - ratio)}
          />
        </svg>
        <div className='absolute flex flex-col items-center leading-none'>
          <span className='text-3xl font-bold tabular-nums text-card-foreground'>
            {correct}
            <span className='text-xl text-muted-foreground'>/{total}</span>
          </span>
        </div>
      </div>

      <div className='space-y-1'>
        <div className='text-lg font-semibold text-card-foreground'>
          <span aria-hidden>{tone.emoji}</span> {tone.msg}
        </div>
        <div className='text-sm text-muted-foreground'>
          {correct} de {total} correctas
        </div>
      </div>

      <div className='flex flex-wrap items-center justify-center gap-1.5'>
        {questions.map((question, index) => {
          const pick = answers[index];
          const ok = pick !== null && question.options[pick]?.correct;
          return (
            <span
              key={index}
              title={`Pregunta ${index + 1}`}
              className={cn(
                'flex size-7 items-center justify-center rounded-full text-xs font-bold text-white',
                ok ? 'bg-green-500' : 'bg-red-500'
              )}
            >
              {index + 1}
            </span>
          );
        })}
      </div>

      <button
        type='button'
        onClick={onRestart}
        className='mt-1 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/50'
      >
        ↺ Repetir quiz
      </button>
    </div>
  );
}

// Full-screen modal for `mode="modal"`. Traps the keyboard in the capture phase so
// the presenter's slide-nav keys (handled by SlideController's window listener)
// can't move the deck underneath; Escape or a click outside closes it.
function QuizModal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      event.stopImmediatePropagation();
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <Portal>
      <div
        role='dialog'
        aria-modal='true'
        onClick={onClose}
        className='fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm duration-200 animate-in fade-in'
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className='relative max-h-[88vh] w-[min(38rem,100%)] overflow-auto rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl duration-200 animate-in zoom-in-95 sm:p-7'
        >
          <button
            type='button'
            onClick={onClose}
            aria-label='Cerrar'
            className='absolute right-4 top-4 z-10 text-sm text-muted-foreground transition hover:text-foreground'
          >
            Esc ✕
          </button>
          {children}
        </div>
      </div>
    </Portal>
  );
}

export function Quiz({
  title,
  mode,
  questions = [],
}: {
  title?: string;
  mode?: string;
  questions?: QuizQuestionData[];
}) {
  const total = questions.length;
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(total).fill(null)
  );
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [open, setOpen] = useState(false);

  if (total === 0) return null;

  const multi = total > 1;
  const selected = answers[current] ?? null;
  const answered = selected !== null;

  const correct = questions.reduce((count, question, index) => {
    const pick = answers[index];
    return count + (pick !== null && question.options[pick]?.correct ? 1 : 0);
  }, 0);
  // "Done" for the trigger: a multi-quiz is done once the result screen shows; a
  // single-question quiz is done as soon as it's answered.
  const done = multi ? finished : answered;
  const singleCorrect = !multi && answered && Boolean(questions[0].options[selected!]?.correct);

  const handleSelect = (optionIndex: number) => {
    setAnswers((prev) => {
      if (prev[current] !== null) return prev; // lock once answered
      const next = [...prev];
      next[current] = optionIndex;
      return next;
    });
  };

  const handleNext = () => {
    if (current === total - 1) setFinished(true);
    else setCurrent((value) => value + 1);
  };

  const reset = () => {
    setAnswers(Array(total).fill(null));
    setCurrent(0);
    setFinished(false);
  };

  const progress = finished ? 1 : (current + (answered ? 1 : 0)) / total;

  const body = (
    <div className='space-y-5'>
      {/* Header: title + progress */}
      {title || multi ? (
        <div className='space-y-2'>
          <div className='flex items-center justify-between gap-3'>
            {title ? (
              <span className='text-sm font-bold text-card-foreground'>{title}</span>
            ) : (
              <span />
            )}
            {multi ? (
              <span className='shrink-0 text-xs font-medium tabular-nums text-muted-foreground'>
                {finished ? `${total} / ${total}` : `Pregunta ${current + 1} / ${total}`}
              </span>
            ) : null}
          </div>
          {multi ? (
            <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
              <div
                className='h-full rounded-full bg-primary transition-[width] duration-300'
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      <div key={finished ? 'result' : `q-${current}`} className='duration-200 animate-in fade-in'>
        {finished ? (
          <ResultView questions={questions} answers={answers} onRestart={reset} />
        ) : (
          <QuestionView
            question={questions[current]}
            index={current}
            total={total}
            selected={selected}
            onSelect={handleSelect}
            onNext={handleNext}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );

  if (mode === 'modal') {
    return (
      <div className='not-prose my-6'>
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='flex w-full items-center gap-3.5 rounded-2xl border border-border bg-card px-5 py-4 text-left shadow-sm transition hover:border-primary/60 hover:shadow'
        >
          <span className='text-2xl' aria-hidden>
            📝
          </span>
          <span className='min-w-0 flex-1'>
            <span className='block font-semibold text-card-foreground'>
              {title ?? (multi ? `Quiz · ${total} preguntas` : questions[0].text ?? 'Quiz')}
            </span>
            {multi && title ? (
              <span className='text-xs text-muted-foreground'>{total} preguntas</span>
            ) : null}
          </span>
          {done ? (
            <span
              className={cn(
                'shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-white',
                multi
                  ? scoreTone(correct / total).bg
                  : singleCorrect
                    ? 'bg-green-500'
                    : 'bg-red-500'
              )}
            >
              {multi ? `${correct}/${total}` : singleCorrect ? '✓ Acertaste' : '✗ Repasa'}
            </span>
          ) : (
            <span className='shrink-0 text-sm font-semibold text-primary'>
              {multi ? 'Empezar →' : 'Responder →'}
            </span>
          )}
        </button>

        {open ? <QuizModal onClose={() => setOpen(false)}>{body}</QuizModal> : null}
      </div>
    );
  }

  return (
    <div className='not-prose my-6 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7'>
      {body}
    </div>
  );
}
