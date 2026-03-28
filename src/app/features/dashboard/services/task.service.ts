import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { invalidateCache } from '../../../core/interceptors/caching.interceptor';
import { Assignee, Task, TasksResponse } from '../../../shared/models';
import { INITIAL_FILTERS } from '../shared/constants/intial-filters';
import { TaskFilters } from '../shared/models/task';

@Injectable()
export class TaskService {
  readonly filters: Signal<TaskFilters>;

  readonly http = inject(HttpClient);
  readonly baseUrl = '/api/tasks';

  readonly users = signal<Assignee[]>([]);

  readonly _filters = signal<TaskFilters>(INITIAL_FILTERS);

  readonly allTasks = computed(() => this.tasksResource.value()?.tasks ?? []);

  /**
   * All filtering happens here on the client — no query params are sent to the API.
   * The API always returns the full task list; this computed re-runs whenever
   * the raw data or the active filters change.
   */
  readonly tasks = computed(() => {
    let result = this.allTasks();
    const f = this._filters();
    if (f.priority) result = result.filter((t) => t.priority === f.priority);
    if (f.assignee) result = result.filter((t) => t.assignee?.id === f.assignee);
    if (f.search) {
      const q = f.search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      );
    }
    return result;
  });

  readonly totalCount = computed(() => this.tasksResource.value()?.meta?.totalCount ?? 0);

  readonly isLoading = computed(() => this.tasksResource.isLoading());

  readonly tasksResource = httpResource<TasksResponse>(() => this.baseUrl);

  readonly error = this.tasksResource.error;

  constructor() {
    this.filters = this._filters.asReadonly();
    this.http.get<Assignee[]>('/api/users').subscribe((u) => this.users.set(u));
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
