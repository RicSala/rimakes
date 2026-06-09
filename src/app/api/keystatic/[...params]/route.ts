import { makeRouteHandler } from '@keystatic/next/route-handler';

import { keystaticConfig } from '@/keystatic.config';

const handlers = makeRouteHandler({ config: keystaticConfig });

function productionGuard(
  routeHandler: (request: Request) => Promise<Response>
) {
  return (request: Request) => {
    if (process.env.NODE_ENV === 'production') {
      return new Response('Not found', { status: 404 });
    }

    return routeHandler(request);
  };
}

export const GET = productionGuard(handlers.GET);
export const POST = productionGuard(handlers.POST);
