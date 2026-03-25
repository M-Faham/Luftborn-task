import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

// Shared subject that emits when navigation starts
let cancelRequests$ = new Subject<void>();
let isSubscribed = false;

export function RequestCancelInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> {
  const router = inject(Router);

  // Subscribe to router events only once
  if (!isSubscribed) {
    router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      cancelRequests$.next();
      cancelRequests$.complete();
      cancelRequests$ = new Subject<void>();
    });
    isSubscribed = true;
  }

  if (req.url.includes('api')) {
    return next(req).pipe(takeUntil(cancelRequests$));
  }

  return next(req);
}
