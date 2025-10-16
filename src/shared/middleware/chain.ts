import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

export type MiddlewareFunction = (
  request: NextRequest,
  event: NextFetchEvent,
  response: NextResponse
) => NextMiddlewareResult | Promise<NextMiddlewareResult>;

type MiddlewareEnhancer = (
  nextMiddleware: MiddlewareFunction
) => MiddlewareFunction;

export function composeMiddleware(
  middlewares: MiddlewareEnhancer[],
  index = 0
): MiddlewareFunction {
  const currentMiddleware = middlewares[index];

  if (currentMiddleware) {
    const nextMiddleware = composeMiddleware(middlewares, index + 1);
    return currentMiddleware(nextMiddleware);
  }

  // Default middleware that just returns the response
  return (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    return response;
  };
}
