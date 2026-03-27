import { DueDatePipe } from './due-date.pipe';
import { Task } from '../models';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { TaskPriorityEnum } from '../enums/task-priority.enum';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Test Task',
    description: 'A description',
    status: TaskStatusEnum.Todo,
    priority: TaskPriorityEnum.Medium,
    dueDate: new Date().toISOString(),
    isOverdue: false,
    assignee: { id: 'u1', name: 'john', avatar: 'JD', email: 'john@example.com' },
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

describe('DueDatePipe', () => {
  let pipe: DueDatePipe;

  beforeEach(() => {
    pipe = new DueDatePipe();
  });

  describe('done status', () => {
    it('should return done type', () => {
      const result = pipe.transform(
        makeTask({ status: TaskStatusEnum.Done, completedAt: new Date().toISOString() }),
      );
      expect(result.type).toBe('done');
    });

    it('should return completed_today when completedAt is today', () => {
      const result = pipe.transform(
        makeTask({ status: TaskStatusEnum.Done, completedAt: new Date().toISOString() }),
      );
      expect(result.labelKey).toBe('due_date.completed_today');
    });

    it('should return completed_yesterday when completedAt is yesterday', () => {
      const result = pipe.transform(
        makeTask({ status: TaskStatusEnum.Done, completedAt: daysFromNow(-1) }),
      );
      expect(result.labelKey).toBe('due_date.completed_yesterday');
    });

    it('should return completed_days_ago with count when completedAt is older', () => {
      const result = pipe.transform(
        makeTask({ status: TaskStatusEnum.Done, completedAt: daysFromNow(-5) }),
      );
      expect(result.labelKey).toBe('due_date.completed_days_ago');
      expect(result.labelParams?.['count']).toBe(5);
    });
  });

  describe('overdue status', () => {
    it('should return overdue type', () => {
      const result = pipe.transform(makeTask({ dueDate: daysFromNow(-3) }));
      expect(result.type).toBe('overdue');
    });

    it('should return overdue_by_one_day when overdue by 1 day', () => {
      const result = pipe.transform(makeTask({ dueDate: daysFromNow(-1) }));
      expect(result.labelKey).toBe('due_date.overdue_by_one_day');
    });

    it('should return overdue_by_days with count when overdue by multiple days', () => {
      const result = pipe.transform(makeTask({ dueDate: daysFromNow(-4) }));
      expect(result.labelKey).toBe('due_date.overdue_by_days');
      expect(result.labelParams?.['count']).toBe(4);
    });
  });

  describe('upcoming due date', () => {
    it('should return due type', () => {
      const result = pipe.transform(makeTask({ dueDate: daysFromNow(3) }));
      expect(result.type).toBe('due');
    });

    it('should return due_today when due date is today', () => {
      const result = pipe.transform(makeTask({ dueDate: new Date().toISOString() }));
      expect(result.labelKey).toBe('due_date.due_today');
    });

    it('should return due_in_one_day when due tomorrow', () => {
      const result = pipe.transform(makeTask({ dueDate: daysFromNow(1) }));
      expect(result.labelKey).toBe('due_date.due_in_one_day');
    });

    it('should return due_in_days with count when due in less than a week', () => {
      const result = pipe.transform(makeTask({ dueDate: daysFromNow(4) }));
      expect(result.labelKey).toBe('due_date.due_in_days');
      expect(result.labelParams?.['count']).toBe(4);
    });

    it('should return due_in_one_week when due in 7–13 days', () => {
      const result = pipe.transform(makeTask({ dueDate: daysFromNow(10) }));
      expect(result.labelKey).toBe('due_date.due_in_one_week');
    });

    it('should return due_in_weeks with count when due in 2+ weeks', () => {
      const result = pipe.transform(makeTask({ dueDate: daysFromNow(21) }));
      expect(result.labelKey).toBe('due_date.due_in_weeks');
      expect(result.labelParams?.['count']).toBe(3);
    });
  });
});
