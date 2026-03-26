import { TaskStatusEnum } from '../enums/task-status.enum';
import { TaskPriorityEnum } from '../enums/task-priority.enum';
import { Assignee } from './assignee.model';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  dueDate: string;
  isOverdue?: boolean;
  completedAt?: string;
  assignee: Assignee;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
