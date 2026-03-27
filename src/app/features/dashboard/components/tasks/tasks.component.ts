import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, TasksListComponent } from '../../../../shared';
import { TaskStatusEnum } from '../../../../shared/enums';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lb-tasks',
  imports: [TasksListComponent, ConfirmDialog],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskService, ConfirmationService],
})
export class TasksComponent {
  readonly isLoading: Signal<boolean>;
  readonly todoTasks: Signal<Task[]>;
  readonly inProgressTasks: Signal<Task[]>;
  readonly doneTasks: Signal<Task[]>;

  protected readonly statusEnum = TaskStatusEnum;

  private readonly taskService = inject(TaskService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

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
}
