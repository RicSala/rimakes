'use client';

import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}
const BlurFade = ({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = '-50px',
  blur = '6px',
}: BlurFadeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hiddenY = variant?.hidden.y ?? yOffset;
  const visibleY = variant?.visible.y ?? -yOffset;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!inView) {
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: inViewMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [inView, inViewMargin]);

  const style = useMemo<CSSProperties>(
    () => ({
      opacity: isVisible ? 1 : 0,
      filter: isVisible ? 'blur(0px)' : `blur(${blur})`,
      transform: `translateY(${isVisible ? visibleY : hiddenY}px)`,
      transition: `opacity ${duration}s ease-out ${delay + 0.04}s, filter ${duration}s ease-out ${delay + 0.04}s, transform ${duration}s ease-out ${delay + 0.04}s`,
    }),
    [blur, delay, duration, hiddenY, isVisible, visibleY]
  );

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

export default BlurFade;
