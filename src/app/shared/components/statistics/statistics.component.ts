import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';
import { StatisticsService } from '../../../features/dashboard/services/statistics.service';
import { Statistic } from '../../models';
import { StatsCardComponent } from '../stats-card/stats-card.component';

@Component({
  selector: 'lb-statistics',
  imports: [StatsCardComponent, Skeleton],
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
