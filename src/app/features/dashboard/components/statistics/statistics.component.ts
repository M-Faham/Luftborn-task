import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { StatsCardComponent } from '../../../../shared/components';
import { Statistic } from '../../../../shared';

@Component({
  selector: 'lb-statistics',
  imports: [StatsCardComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StatisticsService],
})
export class StatisticsComponent {
  readonly statistics: Signal<Statistic[]>;
  readonly isLoading: Signal<boolean>;

  private readonly statisticsService = inject(StatisticsService);
  constructor() {
    this.statistics = this.statisticsService.statistics;
    this.isLoading = this.statisticsService.isLoading;
  }
}
