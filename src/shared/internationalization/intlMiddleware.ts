import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';

import { routing } from '@/shared/internationalization/i18n/config';
import { MiddlewareFunction } from '@/shared/middleware/chain';

export const intlMiddleware = createMiddleware(routing);

export function customIntlMiddleware(middleware: MiddlewareFunction) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const intlResponse = intlMiddleware(request);

    const mergedResponse = mergeResponses(response, intlResponse);

    return middleware(request, event, mergedResponse);
  };
}

function mergeResponses(
  original: NextResponse | undefined,
  intl: NextResponse
): NextResponse {
  // If there's no original response, return the intl response
  if (!original) return intl;
  // Start with the intl response
  const mergedResponse = intl;

  // Copy headers from the original response, but don't overwrite existing ones
  original.headers.forEach((value, key) => {
    if (!mergedResponse.headers.has(key)) {
      mergedResponse.headers.set(key, value);
    }
  });

  // Copy cookies from the original response
  original.cookies.getAll().forEach((cookie) => {
    if (!mergedResponse.cookies.has(cookie.name)) {
      mergedResponse.cookies.set(cookie.name, cookie.value);
    }
  });

  return mergedResponse;
}
