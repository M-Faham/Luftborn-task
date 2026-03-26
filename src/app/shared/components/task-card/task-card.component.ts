import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Task } from '../../models';
import { DueDatePipe } from '../../pipes';

@Component({
  selector: 'lb-task-card',

  imports: [CommonModule, DueDatePipe, TranslatePipe],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  task = input.required<Task>();

  cardClasses = computed(() => {
    const task = this.task();
    return {
      [`priority-${task.priority}`]: true,
      'is-overdue': task.isOverdue,
    };
  });
}
