import { Task } from '../models';
import { TaskStatusEnum } from '../enums/task-status.enum';

export interface DueDateInfo {
  type: 'done' | 'overdue' | 'due';
  labelKey: string;
  labelParams?: Record<string, number>;
}

function daysBetween(from: Date, to: Date): number {
  const a = new Date(from);
  const b = new Date(to);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

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
