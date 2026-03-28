import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TaskPriorityEnum, TaskStatusEnum } from '../../../../shared/enums';
import { Assignee } from '../../../../shared/models';

export interface StatusTab {
  label: string;
  value: TaskStatusEnum | null;
}

@Component({
  selector: 'lb-filter-bar',
  standalone: true,
  imports: [TranslatePipe, SelectModule, ButtonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  activeStatus = input<TaskStatusEnum | null>(null);
  activePriority = input<TaskPriorityEnum | null>(null);
  activeAssignee = input<string | null>(null);
  users = input<Assignee[]>([]);

  statusChange = output<TaskStatusEnum | null>();
  priorityChange = output<TaskPriorityEnum | null>();
  assigneeChange = output<string | null>();
  newTask = output<void>();

  readonly statusTabs: StatusTab[] = [
    { label: 'filter_bar.all', value: null },
    { label: 'tasks.todo', value: TaskStatusEnum.Todo },
    { label: 'tasks.in_progress', value: TaskStatusEnum.InProgress },
    { label: 'tasks.done', value: TaskStatusEnum.Done },
  ];

  readonly priorityOptions = [
    { label: 'filter_bar.all_priorities', value: null },
    { label: 'tasks.high', value: TaskPriorityEnum.High },
    { label: 'tasks.medium', value: TaskPriorityEnum.Medium },
    { label: 'tasks.low', value: TaskPriorityEnum.Low },
  ];

  readonly assigneeOptions = computed(() => {
    const allOption: Assignee = { id: '', name: '', avatar: '👥', email: '' };
    return [allOption, ...this.users()];
  });

  readonly selectedAssignee = computed(() => {
    const id = this.activeAssignee();
    if (!id) return this.assigneeOptions()[0];
    return this.assigneeOptions().find((u) => u.id === id) ?? this.assigneeOptions()[0];
  });

  onStatusClick(value: TaskStatusEnum | null): void {
    this.statusChange.emit(value);
  }

  onPriorityChange(value: TaskPriorityEnum | null): void {
    this.priorityChange.emit(value);
  }

  onAssigneeChange(user: Assignee): void {
    this.assigneeChange.emit(user.id || null);
  }

  onNewTask(): void {
    this.newTask.emit();
  }
}
