import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

/**
 * Starts the MSW service worker.
 *
 * The service worker file (mockServiceWorker.js) is served from the same
 * base path as the app. Reading it from the <base href> tag means this
 * works both locally (/) and on GitHub Pages (/luftborn-task/).
 */
export function startMockServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
  const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';

  return worker.start({
    serviceWorker: {
      url: `${baseHref}mockServiceWorker.js`,
    },
    // Let through any request that has no handler (e.g. Angular assets, CDN)
    onUnhandledRequest: 'bypass',
  });
}
