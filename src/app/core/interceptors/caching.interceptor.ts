import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

/** Cache TTL in milliseconds (30 seconds). */
const CACHE_TTL_MS = 30_000;

interface CacheEntry {
  response: HttpResponse<unknown>;
  expiresAt: number;
}

/** Module-level cache shared across all requests in the session. */
const cache = new Map<string, CacheEntry>();

/**
 * Caches successful GET responses for {@link CACHE_TTL_MS} ms.
 * Non-GET requests bypass the cache entirely.
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
 * Removes all cache entries whose key starts with the given URL prefix.
 * Call with no argument to wipe the entire cache.
 *
 * @example
 * // After mutating tasks, invalidate all cached task URLs
 * invalidateCache('/api/tasks');
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
