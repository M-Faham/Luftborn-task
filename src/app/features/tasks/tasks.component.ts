import { Component } from '@angular/core';
import { TasksBoardComponent } from '../../shared/components/tasks-board/tasks-board.component';

@Component({
  selector: 'lb-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  imports: [TasksBoardComponent],
})
export class TasksPageComponent {}
