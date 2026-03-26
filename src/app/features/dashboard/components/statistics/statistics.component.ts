import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'lb-statistics',

  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StatisticsService],
})
export class StatisticsComponent {}
