import { Task } from '../models';
import { TaskStatusEnum } from '../enums/task-status.enum';

export interface DueDateInfo {
  type: 'done' | 'overdue' | 'due';
  labelKey: string;
  labelParams?: Record<string, number>;
}

/**
 * Returns the number of whole calendar days from `from` to `to`.
 * Both dates are normalized to midnight so a task due "today at 23:59"
 * and one due "today at 00:01" both read as 0 days away.
 */
function daysBetween(from: Date, to: Date): number {
  const a = new Date(from);
  const b = new Date(to);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Resolves a human-readable due-date label for a task card.
 * Thresholds: same day → "today", 1 day, < 7 days → exact count,
 * < 14 days → "one week", otherwise → week count.
 * Completed tasks show how long ago they were finished instead.
 */
export function getDueDateInfo(task: Task): DueDateInfo {
  const today = new Date();

  if (task.status === TaskStatusEnum.Done) {
    const diff = daysBetween(new Date(task.completedAt!), today);
    if (diff === 0) return { type: 'done', labelKey: 'due_date.completed_today' };
    if (diff === 1) return { type: 'done', labelKey: 'due_date.completed_yesterday' };
    return { type: 'done', labelKey: 'due_date.completed_days_ago', labelParams: { count: diff } };
  }

  const dueDate = new Date(task.dueDate);

  const diff = daysBetween(today, dueDate);

  if (diff < 0) {
    const overdueDays = -diff;
    if (overdueDays <= 1) return { type: 'overdue', labelKey: 'due_date.overdue_by_one_day' };
    return {
      type: 'overdue',
      labelKey: 'due_date.overdue_by_days',
      labelParams: { count: overdueDays },
    };
  }

  if (diff === 0) return { type: 'due', labelKey: 'due_date.due_today' };
  if (diff === 1) return { type: 'due', labelKey: 'due_date.due_in_one_day' };
  if (diff < 7)
    return { type: 'due', labelKey: 'due_date.due_in_days', labelParams: { count: diff } };
  if (diff < 14) return { type: 'due', labelKey: 'due_date.due_in_one_week' };
  return {
    type: 'due',
    labelKey: 'due_date.due_in_weeks',
    labelParams: { count: Math.floor(diff / 7) },
  };
}
