import { Component, input, output } from '@angular/core';
import { Task } from '../../models';
import { TaskStatusEnum } from '../../enums';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lb-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
  imports: [TaskCardComponent, TranslatePipe],
})
export class TasksListComponent {
  tasks = input.required<Task[]>();
  status = input.required<TaskStatusEnum>();

  delete = output<Task>();
}
