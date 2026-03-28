import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  readonly query = signal('');

  search(term: string): void {
    this.query.set(term);
  }

  clear(): void {
    this.query.set('');
  }
}
