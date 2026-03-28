import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { TasksComponent } from './tasks.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TaskService } from '../../services/task.service';
import { Task } from '../../../../shared/models';
import { TaskStatusEnum, TaskPriorityEnum } from '../../../../shared/enums';

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

describe('TasksComponent', () => {
  let component: TasksComponent;
  const tasksSignal = signal<Task[]>([]);
  const isLoadingSignal = signal<boolean>(true);

  const mockTaskService = {
    tasks: tasksSignal.asReadonly(),
    isLoading: isLoadingSignal.asReadonly(),
    totalCount: signal(0).asReadonly(),
    filters: signal({ status: null, priority: null, assignee: null, search: '' }).asReadonly(),
    error: signal(undefined).asReadonly(),
    users: signal([]).asReadonly(),
    setFilters: vi.fn(),
    resetFilters: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    tasksSignal.set([]);
    isLoadingSignal.set(true);

    await TestBed.configureTestingModule({
      imports: [TasksComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' }), DialogService],
    })
      .overrideComponent(TasksComponent, {
        set: {
          providers: [
            { provide: TaskService, useValue: mockTaskService },
            ConfirmationService,
            MessageService,
            DialogService,
          ],
        },
      })
      .compileComponents();

    const fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('component creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('task filtering by status', () => {
    it('should expose only todo tasks in todoTasks signal', () => {
      tasksSignal.set([
        makeTask({ id: '1', status: TaskStatusEnum.Todo }),
        makeTask({ id: '2', status: TaskStatusEnum.InProgress }),
        makeTask({ id: '3', status: TaskStatusEnum.Done }),
      ]);

      expect(component.todoTasks().length).toBe(1);
      expect(component.todoTasks()[0].status).toBe(TaskStatusEnum.Todo);
    });

    it('should expose only in-progress tasks in inProgressTasks signal', () => {
      tasksSignal.set([
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
      tasksSignal.set([
        makeTask({ id: '1', status: TaskStatusEnum.Done }),
        makeTask({ id: '2', status: TaskStatusEnum.Done }),
        makeTask({ id: '3', status: TaskStatusEnum.Todo }),
      ]);

      expect(component.doneTasks().length).toBe(2);
      expect(component.doneTasks().every((t) => t.status === TaskStatusEnum.Done)).toBe(true);
    });

    it('should return empty arrays when no tasks match a status', () => {
      tasksSignal.set([makeTask({ id: '1', status: TaskStatusEnum.Todo })]);

      expect(component.inProgressTasks()).toEqual([]);
      expect(component.doneTasks()).toEqual([]);
    });
  });

  describe('isLoading signal', () => {
    it('should be true while tasks are loading', () => {
      expect(component.isLoading()).toBe(true);
    });

    it('should be false after tasks are loaded', () => {
      isLoadingSignal.set(false);
      expect(component.isLoading()).toBe(false);
    });
  });
});
