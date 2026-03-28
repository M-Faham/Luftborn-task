import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

const CACHE_TTL_MS = 30_000;

interface CacheEntry {
  response: HttpResponse<unknown>;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

/**
 * Caches GET responses for 30 seconds using the full URL (including query params) as the key.
 * Non-GET requests bypass the cache entirely — mutations should use `invalidateCache` to
 * clear stale entries so the next GET fetches fresh data.
 */
export function cachingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (req.method !== 'GET') return next(req);

  const key = req.urlWithParams;
  const entry = cache.get(key);

  if (entry && Date.now() < entry.expiresAt) {
    return of(entry.response);
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.ok) {
        cache.set(key, { response: event, expiresAt: Date.now() + CACHE_TTL_MS });
      }
    }),
  );
}

/**
 * Removes cached entries whose key starts with `urlPrefix`.
 * Called after any mutation (POST/PATCH/DELETE) so the next GET goes to the network.
 * If no prefix is given, the entire cache is wiped.
 */
export function invalidateCache(urlPrefix?: string): void {
  if (!urlPrefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(urlPrefix)) {
      cache.delete(key);
    }
  }
}
