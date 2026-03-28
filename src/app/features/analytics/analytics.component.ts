import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StatisticsComponent } from '../../shared';

@Component({
  selector: 'lb-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  imports: [StatisticsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {}
