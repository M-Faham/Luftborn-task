import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, TaskCardComponent, TasksListComponent } from '../../../../shared';
import { TaskStatusEnum } from '../../../../shared/enums';

@Component({
  selector: 'lb-tasks',
  imports: [TaskCardComponent, TasksListComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskService],
})
export class TasksComponent {
  readonly isLoading: Signal<boolean>;
  readonly todoTasks: Signal<Task[]>;
  readonly inProgressTasks: Signal<Task[]>;
  readonly doneTasks: Signal<Task[]>;

  protected readonly statusEnum = TaskStatusEnum;

  private readonly taskService = inject(TaskService);

  constructor() {
    this.isLoading = this.taskService.isLoading;
    this.todoTasks = computed(() =>
      this.taskService.tasks().filter((t) => t.status === TaskStatusEnum.Todo),
    );
    this.inProgressTasks = computed(() =>
      this.taskService.tasks().filter((t) => t.status === TaskStatusEnum.InProgress),
    );
    this.doneTasks = computed(() =>
      this.taskService.tasks().filter((t) => t.status === TaskStatusEnum.Done),
    );
  }
}
