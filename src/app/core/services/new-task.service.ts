import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NewTaskService {
  readonly trigger = signal(false);

  requestNewTask(): void {
    this.trigger.set(true);
    setTimeout(() => {
      this.trigger.set(false);
    }, 100);
  }
}
