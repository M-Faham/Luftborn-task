import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Task, TasksResponse } from '../../../shared/models';
import { TaskPriorityEnum, TaskStatusEnum } from '../../../shared/enums';
import { invalidateCache } from '../../../core/interceptors/caching.interceptor';
import { TaskFilters } from '../shared/models/task';
import { INITIAL_FILTERS } from '../shared/constants/intial-filters';

@Injectable()
export class TaskService {
  readonly filters: Signal<TaskFilters>;

  readonly http = inject(HttpClient);
  readonly baseUrl = '/api/tasks';

  readonly _filters = signal<TaskFilters>(INITIAL_FILTERS);
  readonly tasks = computed(() => this.tasksResource.value()?.tasks ?? []);

  readonly totalCount = computed(() => this.tasksResource.value()?.meta?.totalCount ?? 0);

  readonly isLoading = computed(() => this.tasksResource.isLoading());

  readonly tasksResource = httpResource<TasksResponse>(() => {
    const f = this._filters();
    const params: Record<string, string> = {};
    if (f.status) params['status'] = f.status;
    if (f.priority) params['priority'] = f.priority;
    if (f.assignee) params['assignee'] = f.assignee;
    if (f.search) params['q'] = f.search;
    return { url: this.baseUrl, params };
  });

  readonly error = this.tasksResource.error;

  constructor() {
    this.filters = this._filters.asReadonly();
  }

  setFilters(patch: Partial<TaskFilters>): void {
    this._filters.update((current) => ({ ...current, ...patch }));
  }

  resetFilters(): void {
    this._filters.set(INITIAL_FILTERS);
  }

  create(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task).pipe(
      tap(() => {
        invalidateCache(this.baseUrl);
        this.tasksResource.reload();
      }),
    );
  }

  update(id: string, changes: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${id}`, changes).pipe(
      tap(() => {
        invalidateCache(this.baseUrl);
        this.tasksResource.reload();
      }),
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        invalidateCache(this.baseUrl);
        this.tasksResource.reload();
      }),
    );
  }
}
