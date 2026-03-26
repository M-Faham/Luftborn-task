import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { TaskCardComponent } from './task-card.component';
import { Task } from '../../models';
import { TaskStatusEnum } from '../../enums/task-status.enum';
import { TaskPriorityEnum } from '../../enums/task-priority.enum';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Test Task',
    description: 'A description',
    status: TaskStatusEnum.Todo,
    priority: TaskPriorityEnum.Medium,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isOverdue: false,
    assignee: { id: 'u1', name: 'john', avatar: 'JD', email: 'john@example.com' },
    tags: ['frontend'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('TaskCardComponent', () => {
  let fixture: ComponentFixture<TaskCardComponent>;
  let component: TaskCardComponent;

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  async function createComponent(task: Task): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    fixture.componentRef.setInput('task', task);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }

  describe('component creation', () => {
    it('should create', async () => {
      await createComponent(makeTask());
      expect(component).toBeTruthy();
    });
  });

  describe('cardClasses computed signal', () => {
    it('should include priority class', async () => {
      await createComponent(makeTask({ priority: TaskPriorityEnum.High }));
      expect(component.cardClasses()).toEqual(expect.objectContaining({ 'priority-high': true }));
    });

    it('should set is-overdue to true when task is overdue', async () => {
      await createComponent(makeTask({ isOverdue: true }));
      expect(component.cardClasses()['is-overdue']).toBe(true);
    });

    it('should set is-overdue to false when task is not overdue', async () => {
      await createComponent(makeTask({ isOverdue: false }));
      expect(component.cardClasses()['is-overdue']).toBe(false);
    });
  });

  describe('template rendering', () => {
    it('should render the task title', async () => {
      await createComponent(makeTask({ title: 'My Task Title' }));
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.card-title')?.textContent?.trim()).toBe('My Task Title');
    });

    it('should render the task description', async () => {
      await createComponent(makeTask({ description: 'My description' }));
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.card-description')?.textContent?.trim()).toBe('My description');
    });

    it('should apply the priority class to the card', async () => {
      await createComponent(makeTask({ priority: TaskPriorityEnum.Low }));
      const card: HTMLElement = fixture.nativeElement.querySelector('.task-card');
      expect(card.classList).toContain('priority-low');
    });

    it('should apply is-overdue class when task is overdue', async () => {
      await createComponent(makeTask({ isOverdue: true }));
      const card: HTMLElement = fixture.nativeElement.querySelector('.task-card');
      expect(card.classList).toContain('is-overdue');
    });

    it('should not apply is-overdue class when task is not overdue', async () => {
      await createComponent(makeTask({ isOverdue: false }));
      const card: HTMLElement = fixture.nativeElement.querySelector('.task-card');
      expect(card.classList).not.toContain('is-overdue');
    });

    it('should render the priority badge with correct class', async () => {
      await createComponent(makeTask({ priority: TaskPriorityEnum.High }));
      const badge: HTMLElement = fixture.nativeElement.querySelector('.priority-badge');
      expect(badge).toBeTruthy();
      expect(badge.classList).toContain('badge-high');
    });

    it('should render the first tag when tags are present', async () => {
      await createComponent(makeTask({ tags: ['bug', 'urgent'] }));
      const tag: HTMLElement = fixture.nativeElement.querySelector('.card-tag');
      expect(tag?.textContent?.trim()).toBe('bug');
    });

    it('should not render a tag element when tags array is empty', async () => {
      await createComponent(makeTask({ tags: [] }));
      const tag = fixture.nativeElement.querySelector('.card-tag');
      expect(tag).toBeNull();
    });

    it('should render the assignee name', async () => {
      await createComponent(
        makeTask({
          assignee: { id: 'u2', name: 'alice', avatar: 'AL', email: 'alice@example.com' },
        }),
      );
      const assignee: HTMLElement = fixture.nativeElement.querySelector('.assignee-name');
      expect(assignee?.textContent?.trim()).toBe('@alice');
    });

    it('should render the avatar initials when avatar is set', async () => {
      await createComponent(
        makeTask({
          assignee: { id: 'u2', name: 'alice', avatar: 'AL', email: 'alice@example.com' },
        }),
      );
      const avatar: HTMLElement = fixture.nativeElement.querySelector('.avatar-initials');
      expect(avatar?.textContent?.trim()).toBe('AL');
    });

    it('should not render avatar element when avatar is empty', async () => {
      await createComponent(
        makeTask({ assignee: { id: 'u2', name: 'alice', avatar: '', email: 'alice@example.com' } }),
      );
      const avatar = fixture.nativeElement.querySelector('.avatar-initials');
      expect(avatar).toBeNull();
    });
  });

  describe('due date icon rendering', () => {
    it('should show overdue icon when task is overdue', async () => {
      await createComponent(
        makeTask({
          isOverdue: true,
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      );
      const status: HTMLElement = fixture.nativeElement.querySelector('.card-status');
      expect(status?.textContent).toContain('⚠');
    });

    it('should show done icon when task is completed', async () => {
      await createComponent(
        makeTask({
          status: TaskStatusEnum.Done,
          completedAt: new Date().toISOString(),
        }),
      );
      const status: HTMLElement = fixture.nativeElement.querySelector('.card-status');
      expect(status?.textContent).toContain('✅');
    });

    it('should show calendar icon for upcoming tasks', async () => {
      await createComponent(
        makeTask({
          status: TaskStatusEnum.Todo,
          isOverdue: false,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      );
      const status: HTMLElement = fixture.nativeElement.querySelector('.card-status');
      expect(status?.textContent).toContain('📅');
    });
  });
});
