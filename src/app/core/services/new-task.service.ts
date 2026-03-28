import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NewTaskService {
  /** Incremented each time a "new task" request is made. */
  readonly trigger = signal(0);

  requestNewTask(): void {
    this.trigger.update((v) => v + 1);
  }
}
