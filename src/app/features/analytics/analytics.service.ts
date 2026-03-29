import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { TaskPriorityEnum, TaskStatusEnum } from '../../shared/enums';
import { Task, TasksResponse } from '../../shared/models';

export interface ChartDataset {
  labels: string[];
  data: number[];
}

@Injectable()
export class AnalyticsService {
  readonly isLoading = computed(() => this.tasksResource.isLoading());

  readonly byPriority = computed<ChartDataset>(() => {
    const tasks = this.tasks();
    return {
      labels: ['High', 'Medium', 'Low'],
      data: [
        tasks.filter((t) => t.priority === TaskPriorityEnum.High).length,
        tasks.filter((t) => t.priority === TaskPriorityEnum.Medium).length,
        tasks.filter((t) => t.priority === TaskPriorityEnum.Low).length,
      ],
    };
  });

  readonly byStatus = computed<ChartDataset>(() => {
    const tasks = this.tasks();
    return {
      labels: ['Todo', 'In Progress', 'Done'],
      data: [
        tasks.filter((t) => t.status === TaskStatusEnum.Todo).length,
        tasks.filter((t) => t.status === TaskStatusEnum.InProgress).length,
        tasks.filter((t) => t.status === TaskStatusEnum.Done).length,
      ],
    };
  });

  // Top 6 assignees Only
  readonly byAssignee = computed<ChartDataset>(() => {
    const tasks = this.tasks();
    const counts = new Map<string, number>();
    tasks.forEach((t: Task) => {
      const name = t.assignee?.name ?? 'Unassigned';
      counts.set(name, (counts.get(name) ?? 0) + 1);
    });
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    return {
      labels: sorted.map(([name]) => name),
      data: sorted.map(([, count]) => count),
    };
  });

  private readonly tasksResource = httpResource<TasksResponse>(() => '/api/tasks');
  private readonly tasks = computed(() => this.tasksResource.value()?.tasks ?? []);
}
