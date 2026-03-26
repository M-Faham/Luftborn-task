import { TaskPriorityEnum, TaskStatusEnum } from '../../../../shared';

export interface TaskFilters {
  status: TaskStatusEnum | null;
  priority: TaskPriorityEnum | null;
  /** Assignee ID */
  assignee: string | null;
  search: string;
}
