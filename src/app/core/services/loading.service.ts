import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _loading = signal(false);

  private activeRequests = 0;

  get loading() {
    return this._loading();
  }

  show(): void {
    this.activeRequests++;
    this._loading.set(true);
  }

  /**
   * Decrements the active request counter and hides the spinner once it reaches zero.
   * The `Math.max` guard prevents the counter from going negative if `hide` is somehow
   * called more times than `show` (e.g. an error path fires finalize twice).
   */
  hide(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this._loading.set(false);
    }
  }
}
