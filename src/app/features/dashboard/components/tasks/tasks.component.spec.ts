import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { TasksComponent } from './tasks.component';
import { TaskService } from '../../services/task.service';
import { Task, TasksResponse } from '../../../../shared/models';
import { TaskStatusEnum, TaskPriorityEnum } from '../../../../shared/enums';
import { invalidateCache } from '../../../../core/interceptors/caching.interceptor';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Test Task',
    description: 'Description',
    status: TaskStatusEnum.Todo,
    priority: TaskPriorityEnum.Medium,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isOverdue: false,
    assignee: { id: 'u1', name: 'Alice', avatar: 'AL', email: 'alice@example.com' },
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeResponse(tasks: Task[] = []): TasksResponse {
  return { tasks, meta: { totalCount: tasks.length, lastUpdated: '2026-01-01T00:00:00Z' } };
}

describe('TasksComponent', () => {
  let fixture: ComponentFixture<TasksComponent>;
  let component: TasksComponent;
  let httpMock: HttpTestingController;

  function flushInitial(tasks: Task[] = []): void {
    TestBed.tick();
    httpMock.expectOne('/api/tasks').flush(makeResponse(tasks));
    TestBed.tick();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    invalidateCache();
    TestBed.resetTestingModule();
  });

  describe('component creation', () => {
    it('should create', () => {
      flushInitial();
      expect(component).toBeTruthy();
    });

    it('should provide TaskService', () => {
      flushInitial();
      const service = fixture.debugElement.injector.get(TaskService);
      expect(service).toBeTruthy();
    });
  });

  describe('task filtering by status', () => {
    it('should expose only todo tasks in todoTasks signal', () => {
      flushInitial([
        makeTask({ id: '1', status: TaskStatusEnum.Todo }),
        makeTask({ id: '2', status: TaskStatusEnum.InProgress }),
        makeTask({ id: '3', status: TaskStatusEnum.Done }),
      ]);

      expect(component.todoTasks().length).toBe(1);
      expect(component.todoTasks()[0].status).toBe(TaskStatusEnum.Todo);
    });

    it('should expose only in-progress tasks in inProgressTasks signal', () => {
      flushInitial([
        makeTask({ id: '1', status: TaskStatusEnum.Todo }),
        makeTask({ id: '2', status: TaskStatusEnum.InProgress }),
        makeTask({ id: '3', status: TaskStatusEnum.InProgress }),
      ]);

      expect(component.inProgressTasks().length).toBe(2);
      expect(component.inProgressTasks().every((t) => t.status === TaskStatusEnum.InProgress)).toBe(
        true,
      );
    });

    it('should expose only done tasks in doneTasks signal', () => {
      flushInitial([
        makeTask({ id: '1', status: TaskStatusEnum.Done }),
        makeTask({ id: '2', status: TaskStatusEnum.Done }),
        makeTask({ id: '3', status: TaskStatusEnum.Todo }),
      ]);

      expect(component.doneTasks().length).toBe(2);
      expect(component.doneTasks().every((t) => t.status === TaskStatusEnum.Done)).toBe(true);
    });

    it('should return empty arrays when no tasks match a status', () => {
      flushInitial([makeTask({ id: '1', status: TaskStatusEnum.Todo })]);

      expect(component.inProgressTasks()).toEqual([]);
      expect(component.doneTasks()).toEqual([]);
    });
  });

  describe('isLoading signal', () => {
    it('should be true while tasks are loading', () => {
      expect(component.isLoading()).toBe(true);
      flushInitial();
    });

    it('should be false after tasks are loaded', () => {
      flushInitial();
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('template rendering', () => {
    it('should render three lb-tasks-list elements', () => {
      flushInitial();
      fixture.detectChanges();
      const lists = fixture.nativeElement.querySelectorAll('lb-tasks-list');
      expect(lists.length).toBe(3);
    });
  });
});
