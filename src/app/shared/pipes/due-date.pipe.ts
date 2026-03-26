import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models';
import { DueDateInfo, getDueDateInfo } from '../utils/due-date.utils';

@Pipe({ name: 'dueDate', standalone: true })
export class DueDatePipe implements PipeTransform {
  transform(task: Task): DueDateInfo {
    return getDueDateInfo(task);
  }
}
