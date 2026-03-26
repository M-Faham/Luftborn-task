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

  async function flushInitial(tasks: Task[] = [], totalCount?: number): Promise<void> {
    TestBed.tick();
    httpMock.expectOne('/api/tasks').flush(makeResponse(tasks, totalCount));
    await TestBed.inject(ApplicationRef).whenStable();
  }

  async function stabilize(): Promise<void> {
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

  describe('filters', () => {
    it('should expose initial filters as readonly', async () => {
      await flushInitial();
      expect(service.filters()).toEqual(INITIAL_FILTERS);
    });

    it('should update filters and trigger a new request with query params', async () => {
      await flushInitial();

      service.setFilters({ status: TaskStatusEnum.InProgress });
      TestBed.tick();

      const req = httpMock.expectOne((r) => r.url === '/api/tasks');
      expect(req.request.params.get('status')).toBe('in_progress');
      req.flush(makeResponse());
      await stabilize();
    });

    it('should merge partial filter updates with existing filters', async () => {
      await flushInitial();

      service.setFilters({ priority: TaskPriorityEnum.High });
      TestBed.tick();
      httpMock.expectOne((r) => r.url === '/api/tasks').flush(makeResponse());
      await stabilize();

      service.setFilters({ status: TaskStatusEnum.Done });
      TestBed.tick();

      const req = httpMock.expectOne((r) => r.url === '/api/tasks');
      expect(req.request.params.get('priority')).toBe('high');
      expect(req.request.params.get('status')).toBe('done');
      req.flush(makeResponse());
      await stabilize();
    });

    it('should send search as q param', async () => {
      await flushInitial();

      service.setFilters({ search: 'urgent' });
      TestBed.tick();

      const req = httpMock.expectOne((r) => r.url === '/api/tasks');
      expect(req.request.params.get('q')).toBe('urgent');
      req.flush(makeResponse());
      await stabilize();
    });

    it('should send assignee param', async () => {
      await flushInitial();

      service.setFilters({ assignee: 'user-5' });
      TestBed.tick();

      const req = httpMock.expectOne((r) => r.url === '/api/tasks');
      expect(req.request.params.get('assignee')).toBe('user-5');
      req.flush(makeResponse());
      await stabilize();
    });

    it('should not send params for null/empty filter values', async () => {
      await flushInitial();

      service.setFilters({ status: null, search: '' });
      TestBed.tick();

      const req = httpMock.expectOne((r) => r.url === '/api/tasks');
      expect(req.request.params.has('status')).toBe(false);
      expect(req.request.params.has('q')).toBe(false);
      req.flush(makeResponse());
      await stabilize();
    });

    it('should reset filters to initial values', async () => {
      await flushInitial();

      service.setFilters({ status: TaskStatusEnum.Done, priority: TaskPriorityEnum.Low });
      TestBed.tick();
      httpMock.expectOne((r) => r.url === '/api/tasks').flush(makeResponse());
      await stabilize();

      service.resetFilters();
      expect(service.filters()).toEqual(INITIAL_FILTERS);
      TestBed.tick();
      httpMock.expectOne((r) => r.url === '/api/tasks').flush(makeResponse());
      await stabilize();
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
      await stabilize();
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
      await stabilize();
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
      await stabilize();
    });
  });
});
