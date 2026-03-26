import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { TasksListComponent } from './tasks-list.component';
import { Task } from '../../models';
import { TaskStatusEnum } from '../../enums/task-status.enum';
import { TaskPriorityEnum } from '../../enums/task-priority.enum';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Test Task',
    description: 'A description',
    status: TaskStatusEnum.Todo,
    priority: TaskPriorityEnum.Medium,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isOverdue: false,
    assignee: { id: 'u1', name: 'alice', avatar: 'AL', email: 'alice@example.com' },
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('TasksListComponent', () => {
  let fixture: ComponentFixture<TasksListComponent>;
  let component: TasksListComponent;

  async function createComponent(tasks: Task[], status: TaskStatusEnum): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [TasksListComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksListComponent);
    fixture.componentRef.setInput('tasks', tasks);
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('component creation', () => {
    it('should create', async () => {
      await createComponent([], TaskStatusEnum.Todo);
      expect(component).toBeTruthy();
    });
  });

  describe('task count display', () => {
    it('should display the count of tasks', async () => {
      const tasks = [makeTask(), makeTask({ id: 'task-2' })];
      await createComponent(tasks, TaskStatusEnum.Todo);
      const countEl: HTMLElement = fixture.nativeElement.querySelector('.tasks_count');
      expect(countEl?.textContent?.trim()).toBe('2');
    });

    it('should display 0 when no tasks are provided', async () => {
      await createComponent([], TaskStatusEnum.Todo);
      const countEl: HTMLElement = fixture.nativeElement.querySelector('.tasks_count');
      expect(countEl?.textContent?.trim()).toBe('0');
    });
  });

  describe('task card rendering', () => {
    it('should render a task card for each task', async () => {
      const tasks = [makeTask(), makeTask({ id: 'task-2' }), makeTask({ id: 'task-3' })];
      await createComponent(tasks, TaskStatusEnum.Todo);
      const cards = fixture.nativeElement.querySelectorAll('lb-task-card');
      expect(cards.length).toBe(3);
    });

    it('should show empty state when no tasks are provided', async () => {
      await createComponent([], TaskStatusEnum.Todo);
      const cards = fixture.nativeElement.querySelectorAll('lb-task-card');
      expect(cards.length).toBe(0);
    });

    it('should show "No tasks found." when tasks array is empty', async () => {
      await createComponent([], TaskStatusEnum.Todo);
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('No tasks found.');
    });
  });

  describe('inputs', () => {
    it('should accept tasks input', async () => {
      const tasks = [makeTask()];
      await createComponent(tasks, TaskStatusEnum.InProgress);
      expect(component.tasks()).toEqual(tasks);
    });

    it('should accept status input', async () => {
      await createComponent([], TaskStatusEnum.Done);
      expect(component.status()).toBe(TaskStatusEnum.Done);
    });
  });
});
