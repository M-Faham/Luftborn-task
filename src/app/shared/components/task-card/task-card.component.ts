import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, JsonPipe } from '@angular/common';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Task } from '../../models';
import { TaskStatusEnum } from '../../enums';
import { DueDatePipe } from '../../pipes';
import { Tooltip } from 'primeng/tooltip';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'lb-task-card',
  imports: [CommonModule, DueDatePipe, TranslatePipe, Tooltip, SpeedDialModule, JsonPipe],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  task = input.required<Task>();

  delete = output<Task>();
  update = output<Task>();
  moveForward = output<Task>();
  moveBackward = output<Task>();

  cardClasses = computed(() => {
    const task = this.task();
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return {
      [`priority-${task.priority}`]: true,
      'is-overdue': task.status !== 'done' && dueDate < today,
    };
  });

  speedDialItems: Signal<MenuItem[]>;

  private readonly translate = inject(TranslateService);
  private readonly langChange = toSignal(this.translate.onLangChange);

  constructor() {
    this.speedDialItems = computed<MenuItem[]>(() => {
      this.langChange();
      const task = this.task();
      return [
        {
          tooltipOptions: { tooltipLabel: this.translate.instant('tasks.actions.move_forward') },
          icon: 'pi pi-arrow-right',
          disabled: task.status === TaskStatusEnum.Done,
          command: () => this.moveForward.emit(task),
        },
        {
          tooltipOptions: { tooltipLabel: this.translate.instant('tasks.actions.update') },
          icon: 'pi pi-pencil',
          command: () => this.update.emit(task),
        },
        {
          tooltipOptions: { tooltipLabel: this.translate.instant('tasks.actions.delete') },
          icon: 'pi pi-trash',
          command: () => this.delete.emit(task),
        },
        {
          tooltipOptions: { tooltipLabel: this.translate.instant('tasks.actions.move_backward') },
          icon: 'pi pi-arrow-left',
          disabled: task.status === TaskStatusEnum.Todo,
          command: () => this.moveBackward.emit(task),
        },
      ];
    });
  }
}
