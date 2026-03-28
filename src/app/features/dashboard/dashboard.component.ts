import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StatisticsComponent } from '../../shared/components/statistics/statistics.component';
import { TasksBoardComponent } from '../../shared/components/tasks-board/tasks-board.component';

@Component({
  selector: 'lb-dashboard',

  imports: [StatisticsComponent, TasksBoardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
