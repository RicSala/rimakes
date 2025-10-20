'use client';

import { cn } from '@/shared/lib/utils';
import { Actor, assign, MachineConfig, StateMachine } from '@tinystack/machine';
import { useEffect, useState, useSyncExternalStore } from 'react';
export default function Home() {
  const [actor] = useState(
    () => new Actor(new StateMachine(animationsMachineConfig))
  );

  useEffect(() => {
    actor.start();
    return () => actor.stop();
  }, [actor]);

  const { status, value, context } = useSyncExternalStore(
    actor.subscribe,
    actor.getSnapshot,
    actor.getSnapshot
  );
  return (
    <div className='flex flex-col gap-4'>
      Animations {status} {value} {context.isAnimating} {context.className}{' '}
      {context.counter}
      <div className={cn('rounded-md', 'bg-blue-800 w-md')}>
        <button
          className={cn('p-4 rounded-md w-full ', context.className)}
          onMouseEnter={() =>
            actor.send({
              type: 'MOUSE_HOVER',
            })
          }
          onMouseLeave={() =>
            actor.send({
              type: 'MOUSE_LEAVE',
            })
          }
          onMouseDown={() =>
            actor.send({
              type: 'MOUSE_DOWN',
            })
          }
          onMouseUp={() =>
            actor.send({
              type: 'MOUSE_UP',
            })
          }
        >
          Counter: {context.counter}
        </button>
      </div>
    </div>
  );
}

type AnimationsContext = {
  isAnimating: boolean;
  className: string;
  counter: number;
};

type AnimationsEvent =
  | {
      type: 'MOUSE_HOVER';
    }
  | {
      type: 'MOUSE_LEAVE';
    }
  | { type: 'MOUSE_DOWN' }
  | { type: 'MOUSE_UP' };

const animationsMachineConfig: MachineConfig<
  AnimationsContext,
  AnimationsEvent
> = {
  id: 'animations',
  context: {
    isAnimating: false,
    className: 'bg-blue-400 -translate-y-1',
    counter: 0,
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        MOUSE_HOVER: {
          target: 'hovered',
          actions: [
            assign((context, event) => ({
              isAnimating: true,
              className: cn(
                context.className,
                '-translate-y-2 transition-transform duration-300'
              ),
            })),
          ],
        },
      },
    },
    down: {
      on: {
        MOUSE_UP: {
          target: 'hovered',
          actions: [
            assign((context, event) => ({
              isAnimating: true,
              className: cn(
                context.className,
                '-translate-y-2 transition-transform duration-150'
              ),
            })),
          ],
        },
      },
    },
    hovered: {
      on: {
        MOUSE_LEAVE: {
          target: 'idle',
          actions: [
            assign((context) => ({
              isAnimating: false,
              className: cn(
                context.className,
                '-translate-y-1 transition-transform duration-400'
              ),
            })),
          ],
        },

        MOUSE_DOWN: {
          target: 'down',
          actions: [
            assign((context, event) => ({
              isAnimating: true,
              className: cn(
                context.className,
                '-translate-y-0.5 transition-transform duration-100'
              ),
              counter: context.counter + 1,
            })),
          ],
        },
      },
    },
  },
};
