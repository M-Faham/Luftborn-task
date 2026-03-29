import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

const CACHE_TTL_MS = 30_000;

interface CacheEntry {
  response: HttpResponse<unknown>;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

// Only GETs are cached. Mutations skip this entirely — callers are expected
// to call invalidateCache() so the next read goes to the network.
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

/** Remove all entries matching the given URL prefix, or wipe the whole cache if omitted. */
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
