import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Skeleton } from 'primeng/skeleton';
import { TaskStatusEnum } from '../../enums';
import { Task } from '../../models';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'lb-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
  imports: [TaskCardComponent, TranslatePipe, Skeleton],
})
export class TasksListComponent {
  tasks = input.required<Task[]>();
  status = input.required<TaskStatusEnum>();
  isLoading = input.required<boolean>();

  delete = output<Task>();
  update = output<Task>();
  moveForward = output<Task>();
  moveBackward = output<Task>();
}
