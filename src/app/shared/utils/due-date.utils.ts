import { TaskStatusEnum } from '../enums/task-status.enum';
import { Task } from '../models';

export interface DueDateInfo {
  type: 'done' | 'overdue' | 'due';
  labelKey: string;
  labelParams?: Record<string, number>;
}

export function getDueDateInfo(task: Task): DueDateInfo {
  if (task.status === TaskStatusEnum.Done) {
    return completedLabel(task.completedAt!);
  }

  const diff = daysBetween(new Date(), new Date(task.dueDate));
  return diff < 0 ? overdueLabel(-diff) : upcomingLabel(diff);
}

function daysBetween(from: Date, to: Date): number {
  const a = new Date(from);
  const b = new Date(to);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function completedLabel(completedAt: string): DueDateInfo {
  const diff = daysBetween(new Date(completedAt), new Date());
  if (diff === 0) return { type: 'done', labelKey: 'due_date.completed_today' };
  if (diff === 1) return { type: 'done', labelKey: 'due_date.completed_yesterday' };
  return { type: 'done', labelKey: 'due_date.completed_days_ago', labelParams: { count: diff } };
}

function overdueLabel(days: number): DueDateInfo {
  if (days <= 1) return { type: 'overdue', labelKey: 'due_date.overdue_by_one_day' };
  return { type: 'overdue', labelKey: 'due_date.overdue_by_days', labelParams: { count: days } };
}

function upcomingLabel(diff: number): DueDateInfo {
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
