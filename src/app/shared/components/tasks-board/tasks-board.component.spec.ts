import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of, Subject } from 'rxjs';
import { TaskService } from '../../../features/dashboard/services/task.service';
import { TaskPriorityEnum, TaskStatusEnum } from '../../enums';
import { Task } from '../../models';
import { TasksBoardComponent } from './tasks-board.component';

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
  let component: TasksBoardComponent;
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

  let dialogService: DialogService;
  let confirmationService: ConfirmationService;
  let messageService: MessageService;

  beforeEach(async () => {
    tasksSignal.set([]);
    isLoadingSignal.set(true);
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [TasksBoardComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' }), DialogService],
    })
      .overrideComponent(TasksBoardComponent, {
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

    const fixture = TestBed.createComponent(TasksBoardComponent);
    component = fixture.componentInstance;

    // Get injected services from the component injector
    const injector = fixture.debugElement.injector;
    dialogService = injector.get(DialogService);
    confirmationService = injector.get(ConfirmationService);
    messageService = injector.get(MessageService);

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

  describe('filter bar handlers', () => {
    it('onStatusFilter should set filterStatus', () => {
      component.onStatusFilter(TaskStatusEnum.InProgress);
      expect(component.filterStatus()).toBe(TaskStatusEnum.InProgress);
    });

    it('onStatusFilter with null should show all columns', () => {
      component.onStatusFilter(TaskStatusEnum.Done);
      component.onStatusFilter(null);
      expect(component.filterStatus()).toBeNull();
    });

    it('onPriorityFilter should delegate to taskService.setFilters', () => {
      component.onPriorityFilter(TaskPriorityEnum.High);
      expect(mockTaskService.setFilters).toHaveBeenCalledWith({
        priority: TaskPriorityEnum.High,
      });
    });

    it('onAssigneeFilter should delegate to taskService.setFilters', () => {
      component.onAssigneeFilter('user-1');
      expect(mockTaskService.setFilters).toHaveBeenCalledWith({ assignee: 'user-1' });
    });
  });

  describe('column visibility', () => {
    it('should show all columns when filterStatus is null', () => {
      component.onStatusFilter(null);
      expect(component['showTodo']()).toBe(true);
      expect(component['showInProgress']()).toBe(true);
      expect(component['showDone']()).toBe(true);
    });

    it('should show only todo column when filterStatus is Todo', () => {
      component.onStatusFilter(TaskStatusEnum.Todo);
      expect(component['showTodo']()).toBe(true);
      expect(component['showInProgress']()).toBe(false);
      expect(component['showDone']()).toBe(false);
    });

    it('should show only in-progress column when filterStatus is InProgress', () => {
      component.onStatusFilter(TaskStatusEnum.InProgress);
      expect(component['showTodo']()).toBe(false);
      expect(component['showInProgress']()).toBe(true);
      expect(component['showDone']()).toBe(false);
    });
  });

  describe('onCreateTask', () => {
    it('should open dialog and create task on close with changes', () => {
      const closeSubject = new Subject<any>();
      const mockRef = { onClose: closeSubject.asObservable() } as unknown as DynamicDialogRef;
      vi.spyOn(dialogService, 'open').mockReturnValue(mockRef);
      mockTaskService.create.mockReturnValue(of(makeTask()));

      component.onCreateTask();

      expect(dialogService.open).toHaveBeenCalledTimes(1);

      closeSubject.next({ changes: { title: 'New Task' } });
      closeSubject.complete();

      expect(mockTaskService.create).toHaveBeenCalledWith({ title: 'New Task' });
    });

    it('should not create task when dialog is closed without changes', () => {
      const closeSubject = new Subject<any>();
      const mockRef = { onClose: closeSubject.asObservable() } as unknown as DynamicDialogRef;
      vi.spyOn(dialogService, 'open').mockReturnValue(mockRef);

      component.onCreateTask();
      closeSubject.next(undefined);
      closeSubject.complete();

      expect(mockTaskService.create).not.toHaveBeenCalled();
    });
  });

  describe('onDeleteTask', () => {
    it('should call confirmationService.confirm', () => {
      const spy = vi.spyOn(confirmationService, 'confirm');
      const task = makeTask();
      component.onDeleteTask(task);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should delete task when accept callback is invoked', () => {
      mockTaskService.delete.mockReturnValue(of(undefined));
      const spy = vi.spyOn(confirmationService, 'confirm');
      const task = makeTask({ id: 'del-1' });

      component.onDeleteTask(task);

      const confirmCall = spy.mock.calls[0][0];
      confirmCall.accept!();

      expect(mockTaskService.delete).toHaveBeenCalledWith('del-1');
    });
  });

  describe('onUpdateTask', () => {
    it('should open dialog with task data and update on close', () => {
      const closeSubject = new Subject<any>();
      const mockRef = { onClose: closeSubject.asObservable() } as unknown as DynamicDialogRef;
      vi.spyOn(dialogService, 'open').mockReturnValue(mockRef);
      mockTaskService.update.mockReturnValue(of(makeTask()));

      const task = makeTask({ id: 'upd-1' });
      component.onUpdateTask(task);

      expect(dialogService.open).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ data: { task } }),
      );

      closeSubject.next({ changes: { title: 'Updated' } });
      closeSubject.complete();

      expect(mockTaskService.update).toHaveBeenCalledWith('upd-1', { title: 'Updated' });
    });

    it('should not update when dialog is dismissed', () => {
      const closeSubject = new Subject<any>();
      const mockRef = { onClose: closeSubject.asObservable() } as unknown as DynamicDialogRef;
      vi.spyOn(dialogService, 'open').mockReturnValue(mockRef);

      component.onUpdateTask(makeTask());
      closeSubject.next(undefined);
      closeSubject.complete();

      expect(mockTaskService.update).not.toHaveBeenCalled();
    });
  });

  describe('onMoveForward', () => {
    it('should move Todo task to InProgress', () => {
      mockTaskService.update.mockReturnValue(of(makeTask()));
      component.onMoveForward(makeTask({ id: 'mv-1', status: TaskStatusEnum.Todo }));

      expect(mockTaskService.update).toHaveBeenCalledWith('mv-1', {
        status: TaskStatusEnum.InProgress,
      });
    });

    it('should move InProgress task to Done', () => {
      mockTaskService.update.mockReturnValue(of(makeTask()));
      component.onMoveForward(makeTask({ id: 'mv-2', status: TaskStatusEnum.InProgress }));

      expect(mockTaskService.update).toHaveBeenCalledWith('mv-2', {
        status: TaskStatusEnum.Done,
      });
    });

    it('should not move Done task forward', () => {
      component.onMoveForward(makeTask({ status: TaskStatusEnum.Done }));
      expect(mockTaskService.update).not.toHaveBeenCalled();
    });
  });

  describe('onMoveBackward', () => {
    it('should move Done task to InProgress', () => {
      mockTaskService.update.mockReturnValue(of(makeTask()));
      component.onMoveBackward(makeTask({ id: 'mv-3', status: TaskStatusEnum.Done }));

      expect(mockTaskService.update).toHaveBeenCalledWith('mv-3', {
        status: TaskStatusEnum.InProgress,
      });
    });

    it('should move InProgress task to Todo', () => {
      mockTaskService.update.mockReturnValue(of(makeTask()));
      component.onMoveBackward(makeTask({ id: 'mv-4', status: TaskStatusEnum.InProgress }));

      expect(mockTaskService.update).toHaveBeenCalledWith('mv-4', {
        status: TaskStatusEnum.Todo,
      });
    });

    it('should not move Todo task backward', () => {
      component.onMoveBackward(makeTask({ status: TaskStatusEnum.Todo }));
      expect(mockTaskService.update).not.toHaveBeenCalled();
    });
  });
});
