import { TaskStatus } from '../types/task-status.type';
import { TaskPriority } from '../types/task-priority.type';
import { Assignee } from './assignee.model';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  isOverdue: boolean;
  completedAt: string;
  assignee: Assignee;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
