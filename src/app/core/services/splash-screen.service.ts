import { DOCUMENT } from '@angular/common';
import { inject, Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { forkJoin, Observable, timer } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SplashScreenService {
  private counter = 0;
  private readonly animationTime = 500;
  private readonly animationComplete$ = timer(this.animationTime);
  private readonly navigationEnd$: Observable<NavigationEnd>;

  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  constructor() {
    this.navigationEnd$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      take(1),
    );

    this.show();

    forkJoin([this.animationComplete$, this.navigationEnd$]).subscribe(() => {
      this.hide();
    });
  }

  show(): void {
    this.counter++;
    if (this.counter === 1) this.document.body.classList.remove('splash-screen-hidden');
  }

  hide(): void {
    this.counter--;
    if (this.counter === 0) {
      this.document.body.classList.add('splash-screen-hidden');
    } else if (this.counter < 0) {
      throw new Error('Splash screen counter is less than 0');
    }
  }
}
