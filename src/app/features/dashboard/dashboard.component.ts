import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { TasksComponent } from './components/tasks/tasks.component';

@Component({
  selector: 'lb-dashboard',

  imports: [StatisticsComponent, TasksComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
