import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task, TasksResponse } from '../../../shared/models';
import { TaskPriorityEnum, TaskStatusEnum } from '../../../shared/enums';
import { invalidateCache } from '../../../core/interceptors/caching.interceptor';
import { INITIAL_FILTERS } from '../shared/constants/intial-filters';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Test Task',
    description: 'A test task',
    status: TaskStatusEnum.Todo,
    priority: TaskPriorityEnum.Medium,
    dueDate: '2026-04-01',
    assignee: { id: 'user-1', name: 'John', avatar: '', email: 'john@test.com' },
    tags: ['test'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

function makeResponse(tasks: Task[] = [], totalCount?: number): TasksResponse {
  return {
    tasks,
    meta: { totalCount: totalCount ?? tasks.length, lastUpdated: '2026-01-01T00:00:00Z' },
  };
}

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const ALL_TASKS = [
    makeTask({
      id: 't1',
      title: 'Buy groceries',
      description: 'Milk and eggs',
      priority: TaskPriorityEnum.Low,
      status: TaskStatusEnum.Todo,
      assignee: { id: 'user-1', name: 'John', avatar: '', email: '' },
    }),
    makeTask({
      id: 't2',
      title: 'Fix urgent bug',
      description: 'Production crash',
      priority: TaskPriorityEnum.High,
      status: TaskStatusEnum.InProgress,
      assignee: { id: 'user-2', name: 'Jane', avatar: '', email: '' },
    }),
    makeTask({
      id: 't3',
      title: 'Write docs',
      description: 'API documentation',
      priority: TaskPriorityEnum.Medium,
      status: TaskStatusEnum.Done,
      assignee: { id: 'user-1', name: 'John', avatar: '', email: '' },
    }),
  ];

  async function flushInitial(tasks: Task[] = [], totalCount?: number): Promise<void> {
    TestBed.tick();
    httpMock.match('/api/users').forEach((r) => r.flush([]));
    httpMock.expectOne('/api/tasks').flush(makeResponse(tasks, totalCount));
    await TestBed.inject(ApplicationRef).whenStable();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.match('/api/users').forEach((r) => r.flush([]));
    httpMock.verify();
    invalidateCache();
  });

  describe('initial load', () => {
    it('should fetch from /api/tasks on creation', async () => {
      const task = makeTask();
      await flushInitial([task]);

      expect(service.tasks()).toEqual([task]);
    });

    it('should default tasks to [] before response arrives', async () => {
      expect(service.tasks()).toEqual([]);
      await flushInitial();
    });

    it('should default totalCount to 0 before response arrives', async () => {
      expect(service.totalCount()).toBe(0);
      await flushInitial();
    });
  });

  describe('isLoading', () => {
    it('should be true while the request is in flight', async () => {
      TestBed.tick();
      expect(service.isLoading()).toBe(true);
      await flushInitial();
    });

    it('should be false after response is received', async () => {
      await flushInitial();
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('error signal', () => {
    it('should be undefined when no error has occurred', async () => {
      await flushInitial();
      expect(service.error()).toBeUndefined();
    });
  });

  describe('totalCount', () => {
    it('should reflect meta.totalCount from the response', async () => {
      await flushInitial([makeTask()], 42);
      expect(service.totalCount()).toBe(42);
    });
  });

  describe('client-side filters', () => {
    it('should expose initial filters as readonly', async () => {
      await flushInitial();
      expect(service.filters()).toEqual(INITIAL_FILTERS);
    });

    it('should filter by priority client-side', async () => {
      await flushInitial(ALL_TASKS);

      service.setFilters({ priority: TaskPriorityEnum.High });
      expect(service.tasks()).toHaveLength(1);
      expect(service.tasks()[0].id).toBe('t2');
    });

    it('should filter by assignee client-side', async () => {
      await flushInitial(ALL_TASKS);

      service.setFilters({ assignee: 'user-1' });
      expect(service.tasks()).toHaveLength(2);
      expect(service.tasks().map((t) => t.id)).toEqual(['t1', 't3']);
    });

    it('should filter by search (title) client-side', async () => {
      await flushInitial(ALL_TASKS);

      service.setFilters({ search: 'urgent' });
      expect(service.tasks()).toHaveLength(1);
      expect(service.tasks()[0].id).toBe('t2');
    });

    it('should filter by search (description) client-side', async () => {
      await flushInitial(ALL_TASKS);

      service.setFilters({ search: 'documentation' });
      expect(service.tasks()).toHaveLength(1);
      expect(service.tasks()[0].id).toBe('t3');
    });

    it('should combine multiple filters', async () => {
      await flushInitial(ALL_TASKS);

      service.setFilters({ assignee: 'user-1', priority: TaskPriorityEnum.Low });
      expect(service.tasks()).toHaveLength(1);
      expect(service.tasks()[0].id).toBe('t1');
    });

    it('should return all tasks when no filters are set', async () => {
      await flushInitial(ALL_TASKS);
      expect(service.tasks()).toHaveLength(3);
    });

    it('should not trigger a new HTTP request when filters change', async () => {
      await flushInitial(ALL_TASKS);

      service.setFilters({ priority: TaskPriorityEnum.High });
      // No new request expected — httpMock.verify() in afterEach will catch leaks
      expect(service.tasks()).toHaveLength(1);
    });

    it('should reset filters to initial values', async () => {
      await flushInitial(ALL_TASKS);

      service.setFilters({ priority: TaskPriorityEnum.Low, assignee: 'user-1' });
      expect(service.tasks()).toHaveLength(1);

      service.resetFilters();
      expect(service.filters()).toEqual(INITIAL_FILTERS);
      expect(service.tasks()).toHaveLength(3);
    });

    it('should be case-insensitive for search', async () => {
      await flushInitial(ALL_TASKS);

      service.setFilters({ search: 'BUY' });
      expect(service.tasks()).toHaveLength(1);
      expect(service.tasks()[0].id).toBe('t1');
    });
  });

  describe('allTasks', () => {
    it('should always return all tasks regardless of filters', async () => {
      await flushInitial(ALL_TASKS);

      service.setFilters({ priority: TaskPriorityEnum.High });
      expect(service.allTasks()).toHaveLength(3);
      expect(service.tasks()).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should POST to /api/tasks and reload', async () => {
      await flushInitial();

      const newTask: Partial<Task> = { title: 'New', description: 'Desc' };
      const created = makeTask({ id: 'task-new', title: 'New' });

      service.create(newTask).subscribe((result) => {
        expect(result).toEqual(created);
      });

      const postReq = httpMock.expectOne({ method: 'POST', url: '/api/tasks' });
      expect(postReq.request.body).toEqual(newTask);
      postReq.flush(created);

      TestBed.tick();
      httpMock.expectOne('/api/tasks').flush(makeResponse([created]));
      await TestBed.inject(ApplicationRef).whenStable();
    });
  });

  describe('update', () => {
    it('should PATCH to /api/tasks/:id and reload', async () => {
      await flushInitial();

      const changes: Partial<Task> = { title: 'Updated' };
      const updated = makeTask({ title: 'Updated' });

      service.update('task-1', changes).subscribe((result) => {
        expect(result).toEqual(updated);
      });

      const patchReq = httpMock.expectOne({ method: 'PATCH', url: '/api/tasks/task-1' });
      expect(patchReq.request.body).toEqual(changes);
      patchReq.flush(updated);

      TestBed.tick();
      httpMock.expectOne('/api/tasks').flush(makeResponse([updated]));
      await TestBed.inject(ApplicationRef).whenStable();
    });
  });

  describe('delete', () => {
    it('should DELETE to /api/tasks/:id and reload', async () => {
      await flushInitial();

      service.delete('task-1').subscribe();

      const deleteReq = httpMock.expectOne({ method: 'DELETE', url: '/api/tasks/task-1' });
      deleteReq.flush(null);

      TestBed.tick();
      httpMock.expectOne('/api/tasks').flush(makeResponse());
      await TestBed.inject(ApplicationRef).whenStable();
    });
  });
});
