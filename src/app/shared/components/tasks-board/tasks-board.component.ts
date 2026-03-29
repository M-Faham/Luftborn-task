import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  Signal,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { NewTaskService } from '../../../core/services/new-task.service';
import { SearchService } from '../../../core/services/search.service';
import { TaskService } from '../../../features/dashboard/services/task.service';
import { TaskPriorityEnum, TaskStatusEnum } from '../../enums';
import { Assignee, Task } from '../../models';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { TaskFormComponent, TaskFormResult } from '../task-form/task-form.component';
import { TasksListComponent } from '../tasks-list/tasks-list.component';

const STATUS_ORDER = [TaskStatusEnum.Todo, TaskStatusEnum.InProgress, TaskStatusEnum.Done];

@Component({
  selector: 'lb-tasks-board',
  imports: [TasksListComponent, ConfirmDialog, FilterBarComponent],
  templateUrl: './tasks-board.component.html',
  styleUrl: './tasks-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskService, ConfirmationService],
})
export class TasksBoardComponent {
  readonly isLoading: Signal<boolean>;
  readonly todoTasks: Signal<Task[]>;
  readonly inProgressTasks: Signal<Task[]>;
  readonly doneTasks: Signal<Task[]>;

  readonly users: Signal<Assignee[]>;

  readonly filterStatus = signal<TaskStatusEnum | null>(null);

  readonly filters: Signal<{
    status: TaskStatusEnum | null;
    priority: TaskPriorityEnum | null;
    assignee: string | null;
    search: string;
  }>;

  protected readonly statusEnum = TaskStatusEnum;

  protected readonly showTodo: Signal<boolean>;
  protected readonly showInProgress: Signal<boolean>;
  protected readonly showDone: Signal<boolean>;

  private readonly taskService = inject(TaskService);
  private readonly newTaskService = inject(NewTaskService);
  private readonly searchService = inject(SearchService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly dialogService = inject(DialogService);

  constructor() {
    this.isLoading = this.taskService.isLoading;
    this.filters = this.taskService.filters;

    this.todoTasks = computed(() =>
      this.taskService.tasks().filter((t) => t.status === TaskStatusEnum.Todo),
    );
    this.inProgressTasks = computed(() =>
      this.taskService.tasks().filter((t) => t.status === TaskStatusEnum.InProgress),
    );
    this.doneTasks = computed(() =>
      this.taskService.tasks().filter((t) => t.status === TaskStatusEnum.Done),
    );

    this.showTodo = computed(
      () => !this.filterStatus() || this.filterStatus() === TaskStatusEnum.Todo,
    );
    this.showInProgress = computed(
      () => !this.filterStatus() || this.filterStatus() === TaskStatusEnum.InProgress,
    );
    this.showDone = computed(
      () => !this.filterStatus() || this.filterStatus() === TaskStatusEnum.Done,
    );

    this.users = this.taskService.users;

    effect(() => {
      this.taskService.setFilters({ search: this.searchService.query() });
    });

    effect(() => {
      const tick = this.newTaskService.trigger();
      if (tick) this.onCreateTask();
    });
  }

  onStatusFilter(status: TaskStatusEnum | null): void {
    this.filterStatus.set(status);
  }

  onPriorityFilter(priority: TaskPriorityEnum | null): void {
    this.taskService.setFilters({ priority });
  }

  onAssigneeFilter(assignee: string | null): void {
    this.taskService.setFilters({ assignee });
  }

  onCreateTask(): void {
    const ref = this.dialogService.open(TaskFormComponent, {
      header: this.translate.instant('task_form.create_title'),
      width: '500px',
      data: {},
    });

    ref?.onClose.subscribe((result?: TaskFormResult) => {
      if (result?.changes) {
        this.taskService.create(result.changes).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('task_form.create_success'),
            });
          },
        });
      }
    });
  }

  onDeleteTask(task: Task): void {
    this.confirmationService.confirm({
      message: this.translate.instant('tasks.confirm_delete.message', { title: task.title }),
      header: this.translate.instant('tasks.confirm_delete.header'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.taskService.delete(task.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('tasks.delete_success'),
            });
          },
        });
      },
    });
  }

  onUpdateTask(task: Task): void {
    const ref = this.dialogService.open(TaskFormComponent, {
      header: this.translate.instant('task_form.edit_title'),
      width: '500px',
      data: { task },
    });

    ref?.onClose.subscribe((result?: TaskFormResult) => {
      if (result?.changes) {
        this.submitUpdate(task.id, result.changes);
      }
    });
  }

  onMoveForward(task: Task): void {
    const nextStatus = this.getAdjacentStatus(task.status, 1);
    if (nextStatus) {
      this.submitUpdate(task.id, { status: nextStatus });
    }
  }

  onMoveBackward(task: Task): void {
    const prevStatus = this.getAdjacentStatus(task.status, -1);
    if (prevStatus) {
      this.submitUpdate(task.id, { status: prevStatus });
    }
  }

  private submitUpdate(id: string, changes: Partial<Task>): void {
    this.taskService.update(id, changes).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('task_form.update_success'),
        });
      },
    });
  }

  // Move STATUS_ORDER by `direction` (+1 forward, -1 backward). Returns null if can't move further.
  private getAdjacentStatus(current: TaskStatusEnum, direction: 1 | -1): TaskStatusEnum | null {
    const currentIndex = STATUS_ORDER.indexOf(current);
    const nextIndex = currentIndex + direction;
    return STATUS_ORDER[nextIndex] ?? null;
  }
}
