import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TaskFormComponent, TaskFormData, TaskFormResult } from './task-form.component';
import { Task, Assignee } from '../../models';
import { TaskPriorityEnum, TaskStatusEnum } from '../../enums';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MOCK_USERS: Assignee[] = [
  { id: 'user-001', name: 'John Doe', avatar: 'JD', email: 'john@company.com' },
  { id: 'user-002', name: 'Sarah Smith', avatar: 'SS', email: 'sarah@company.com' },
];

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Existing Task',
    description: 'Description',
    status: TaskStatusEnum.InProgress,
    priority: TaskPriorityEnum.High,
    dueDate: '2026-06-15',
    assignee: MOCK_USERS[0],
    tags: ['frontend', 'urgent'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let httpMock: HttpTestingController;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  function setup(data: TaskFormData = {}): void {
    dialogRef = { close: vi.fn() };

    TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: DynamicDialogRef, useValue: dialogRef },
        { provide: DynamicDialogConfig, useValue: { data } },
      ],
    });

    const fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // triggers ngOnInit
  }

  function flushUsers(): void {
    httpMock.expectOne('/api/users').flush(MOCK_USERS);
  }

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  // ─── Create mode ──────────────────────────────────────────────────────

  describe('create mode (no task data)', () => {
    beforeEach(() => {
      setup();
      flushUsers();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should set isEdit to false', () => {
      expect(component.isEdit).toBe(false);
    });

    it('should initialize form with default values', () => {
      const val = component.form.getRawValue();
      expect(val.title).toBe('');
      expect(val.description).toBe('');
      expect(val.priority).toBe(TaskPriorityEnum.Medium);
      expect(val.status).toBe(TaskStatusEnum.Todo);
      expect(val.assignee).toBeNull();
      expect(val.dueDate).toBeNull();
      expect(val.tags).toBe('');
    });

    it('should mark form as invalid when required fields are empty', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should fetch users from /api/users on init', () => {
      expect(component.users()).toEqual(MOCK_USERS);
    });
  });

  // ─── Edit mode ────────────────────────────────────────────────────────

  describe('edit mode (task provided)', () => {
    const existingTask = makeTask();

    beforeEach(() => {
      setup({ task: existingTask });
      flushUsers();
    });

    it('should set isEdit to true', () => {
      expect(component.isEdit).toBe(true);
    });

    it('should populate form with existing task values', () => {
      const val = component.form.getRawValue();
      expect(val.title).toBe(existingTask.title);
      expect(val.description).toBe(existingTask.description);
      expect(val.priority).toBe(existingTask.priority);
      expect(val.status).toBe(existingTask.status);
      expect(val.assignee).toEqual(existingTask.assignee);
      expect(val.tags).toBe('frontend, urgent');
    });

    it('should convert dueDate string to Date object', () => {
      const val = component.form.getRawValue();
      expect(val.dueDate).toBeInstanceOf(Date);
    });
  });

  // ─── Validation ───────────────────────────────────────────────────────

  describe('form validation', () => {
    beforeEach(() => {
      setup();
      flushUsers();
    });

    it('should require title', () => {
      expect(component.form.get('title')!.hasError('required')).toBe(true);
    });

    it('should require priority', () => {
      component.form.patchValue({ priority: null });
      expect(component.form.get('priority')!.hasError('required')).toBe(true);
    });

    it('should require assignee', () => {
      expect(component.form.get('assignee')!.hasError('required')).toBe(true);
    });

    it('should require dueDate', () => {
      expect(component.form.get('dueDate')!.hasError('required')).toBe(true);
    });

    it('should not require description', () => {
      expect(component.form.get('description')!.valid).toBe(true);
    });

    it('should not require tags', () => {
      expect(component.form.get('tags')!.valid).toBe(true);
    });
  });

  // ─── onSubmit ─────────────────────────────────────────────────────────

  describe('onSubmit', () => {
    beforeEach(() => {
      setup();
      flushUsers();
    });

    it('should not close the dialog when form is invalid', () => {
      component.onSubmit();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.onSubmit();
      expect(component.form.get('title')!.touched).toBe(true);
      expect(component.form.get('assignee')!.touched).toBe(true);
      expect(component.form.get('dueDate')!.touched).toBe(true);
    });

    it('should close the dialog with changes when form is valid', () => {
      const dueDate = new Date('2026-08-01');
      component.form.patchValue({
        title: 'New Task',
        description: 'Desc',
        priority: TaskPriorityEnum.Low,
        status: TaskStatusEnum.Todo,
        assignee: MOCK_USERS[1],
        dueDate,
        tags: 'ui, bug',
      });

      component.onSubmit();

      expect(dialogRef.close).toHaveBeenCalledWith({
        changes: {
          title: 'New Task',
          description: 'Desc',
          priority: TaskPriorityEnum.Low,
          status: TaskStatusEnum.Todo,
          assignee: MOCK_USERS[1],
          dueDate: '2026-08-01',
          tags: ['ui', 'bug'],
        },
      } satisfies TaskFormResult);
    });

    it('should split and trim tags correctly', () => {
      component.form.patchValue({
        title: 'T',
        assignee: MOCK_USERS[0],
        dueDate: new Date('2026-08-01'),
        tags: ' a , b ,, c ',
      });

      component.onSubmit();

      const result = dialogRef.close.mock.calls[0][0] as TaskFormResult;
      expect(result.changes.tags).toEqual(['a', 'b', 'c']);
    });

    it('should return empty tags array when tags field is empty', () => {
      component.form.patchValue({
        title: 'T',
        assignee: MOCK_USERS[0],
        dueDate: new Date('2026-08-01'),
        tags: '',
      });

      component.onSubmit();

      const result = dialogRef.close.mock.calls[0][0] as TaskFormResult;
      expect(result.changes.tags).toEqual([]);
    });
  });

  // ─── onCancel ─────────────────────────────────────────────────────────

  describe('onCancel', () => {
    beforeEach(() => {
      setup();
      flushUsers();
    });

    it('should close the dialog without data', () => {
      component.onCancel();
      expect(dialogRef.close).toHaveBeenCalledWith();
    });
  });

  // ─── Options ──────────────────────────────────────────────────────────

  describe('dropdown options', () => {
    beforeEach(() => {
      setup();
      flushUsers();
    });

    it('should have 3 status options', () => {
      expect(component.statusOptions).toHaveLength(3);
    });

    it('should have 3 priority options', () => {
      expect(component.priorityOptions).toHaveLength(3);
    });
  });
});
