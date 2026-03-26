import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { TaskFilters } from '../shared/models/task';
import { Task, TasksResponse } from '../../../shared/models';
import { TaskStatusEnum, TaskPriorityEnum } from '../../../shared/enums';
import { invalidateCache } from '../../../core/interceptors/caching.interceptor';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Test Task',
    description: 'Description',
    status: TaskStatusEnum.Todo,
    priority: TaskPriorityEnum.Medium,
    dueDate: '2026-12-31',
    assignee: { id: 'u1', name: 'Alice', avatar: 'AL', email: 'alice@example.com' },
    tags: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

function makeResponse(tasks: Task[] = []): TasksResponse {
  return { tasks, meta: { totalCount: tasks.length, lastUpdated: '2026-01-01T00:00:00Z' } };
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  /** Flush the initial httpResource GET that fires on service creation. */
  function flushInitial(tasks: Task[] = []): void {
    TestBed.tick();
    httpMock.expectOne('/api/tasks').flush(makeResponse(tasks));
    flushMicrotasks();
    TestBed.tick();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    invalidateCache();
  });

  // ─── Initial load ───────────────────────────────────────────────────────

  describe('initial load', () => {
    it('should fetch tasks from /api/tasks on creation', fakeAsync(() => {
      const task = makeTask();
      flushInitial([task]);

      expect(service.tasks()).toEqual([task]);
    }));

    it('should expose totalCount from the meta field', fakeAsync(() => {
      flushInitial([makeTask(), makeTask({ id: 'task-2' })]);

      expect(service.totalCount()).toBe(2);
    }));

    it('should default tasks to [] before the response arrives', fakeAsync(() => {
      // Do NOT flush — resource is still loading
      expect(service.tasks()).toEqual([]);
      flushInitial(); // clean up
    }));
  });

  // ─── Filters ────────────────────────────────────────────────────────────

  describe('setFilters', () => {
    it('should add status param when status filter is set', fakeAsync(() => {
      flushInitial();

      service.setFilters({ status: TaskStatusEnum.Done });
      TestBed.tick();

      const req = httpMock.expectOne((r) => r.url === '/api/tasks');
      expect(req.request.params.get('status')).toBe('done');
      req.flush(makeResponse());
    }));

    it('should add priority param when priority filter is set', fakeAsync(() => {
      flushInitial();

      service.setFilters({ priority: TaskPriorityEnum.High });
      TestBed.tick();

      const req = httpMock.expectOne((r) => r.url === '/api/tasks');
      expect(req.request.params.get('priority')).toBe('high');
      req.flush(makeResponse());
    }));

    it('should add q param when search filter is set', fakeAsync(() => {
      flushInitial();

      service.setFilters({ search: 'design' });
      TestBed.tick();

      const req = httpMock.expectOne((r) => r.url === '/api/tasks');
      expect(req.request.params.get('q')).toBe('design');
      req.flush(makeResponse());
    }));

    it('should omit params for null/empty filter values', fakeAsync(() => {
      flushInitial();

      service.setFilters({ status: null, priority: null, search: '' });
      TestBed.tick();

      const req = httpMock.expectOne('/api/tasks');
      expect(req.request.params.keys()).toHaveLength(0);
      req.flush(makeResponse());
    }));
  });

  describe('resetFilters', () => {
    it('should remove all active filters', fakeAsync(() => {
      flushInitial();

      service.setFilters({ status: TaskStatusEnum.Done });
      TestBed.tick();
      httpMock.expectOne((r) => r.url === '/api/tasks').flush(makeResponse());

      service.resetFilters();
      TestBed.tick();
      const req = httpMock.expectOne('/api/tasks');
      expect(req.request.params.keys()).toHaveLength(0);
      req.flush(makeResponse());
    }));

    it('should expose the reset filters via the filters signal', fakeAsync(() => {
      flushInitial();

      service.setFilters({ status: TaskStatusEnum.Done });
      TestBed.tick();
      httpMock.expectOne((r) => r.url === '/api/tasks').flush(makeResponse());

      service.resetFilters();
      TestBed.tick();
      httpMock.expectOne('/api/tasks').flush(makeResponse());

      const filters = service.filters();
      expect(filters.status).toBeNull();
      expect(filters.priority).toBeNull();
      expect(filters.search).toBe('');
    }));
  });

  // ─── Mutations ──────────────────────────────────────────────────────────

  describe('create', () => {
    it('should POST to /api/tasks with the given payload', fakeAsync(() => {
      flushInitial();

      const newTask: Partial<Task> = { title: 'New Task', priority: TaskPriorityEnum.Low };
      service.create(newTask).subscribe();

      const req = httpMock.expectOne('/api/tasks');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTask);
      req.flush(makeTask({ title: 'New Task' }));

      // Reload: flush the follow-up GET
      TestBed.tick();
      httpMock.expectOne('/api/tasks').flush(makeResponse());
    }));

    it('should emit the created task to the subscriber', fakeAsync(() => {
      flushInitial();

      const created = makeTask({ id: 'new-1', title: 'Created' });
      let result!: Task;
      service.create({ title: 'Created' }).subscribe((t) => (result = t));

      httpMock.expectOne({ method: 'POST', url: '/api/tasks' }).flush(created);
      TestBed.tick();
      httpMock.expectOne('/api/tasks').flush(makeResponse([created]));

      expect(result).toEqual(created);
    }));
  });

  describe('update', () => {
    it('should PATCH /api/tasks/:id with the given changes', fakeAsync(() => {
      flushInitial();

      const changes: Partial<Task> = { title: 'Updated Title' };
      service.update('task-1', changes).subscribe();

      const req = httpMock.expectOne('/api/tasks/task-1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(changes);
      req.flush(makeTask(changes));

      TestBed.tick();
      httpMock.expectOne('/api/tasks').flush(makeResponse());
    }));

    it('should emit the updated task to the subscriber', fakeAsync(() => {
      flushInitial();

      const updated = makeTask({ title: 'Updated' });
      let result!: Task;
      service.update('task-1', { title: 'Updated' }).subscribe((t) => (result = t));

      httpMock.expectOne('/api/tasks/task-1').flush(updated);
      TestBed.tick();
      httpMock.expectOne('/api/tasks').flush(makeResponse([updated]));

      expect(result.title).toBe('Updated');
    }));
  });

  describe('delete', () => {
    it('should DELETE /api/tasks/:id', fakeAsync(() => {
      flushInitial();

      service.delete('task-1').subscribe();

      const req = httpMock.expectOne('/api/tasks/task-1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 204, statusText: 'No Content' });

      TestBed.tick();
      httpMock.expectOne('/api/tasks').flush(makeResponse());
    }));
  });

  // ─── isLoading signal ───────────────────────────────────────────────────

  describe('isLoading', () => {
    it('should be true while the request is in flight', fakeAsync(() => {
      TestBed.tick();
      expect(service.isLoading()).toBe(true);
      flushInitial();
    }));

    it('should be false after the response is received', fakeAsync(() => {
      flushInitial();
      expect(service.isLoading()).toBe(false);
    }));
  });

  // ─── filters signal ─────────────────────────────────────────────────────

  describe('filters signal', () => {
    it('should reflect partial filter updates', fakeAsync(() => {
      flushInitial();

      service.setFilters({ status: TaskStatusEnum.InProgress });
      TestBed.tick();
      httpMock.expectOne((r) => r.url === '/api/tasks').flush(makeResponse());

      expect(service.filters().status).toBe(TaskStatusEnum.InProgress);
      expect(service.filters().priority).toBeNull(); // untouched
    }));
  });
});
