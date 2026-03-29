import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { Skeleton } from 'primeng/skeleton';
import { StatisticsService } from '../../../features/dashboard/services/statistics.service';
import { Statistic } from '../../models';
import { StatsCardComponent } from '../stats-card/stats-card.component';
@Component({
  selector: 'lb-statistics',
  imports: [StatsCardComponent, Skeleton, CarouselModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StatisticsService],
})
export class StatisticsComponent {
  readonly statistics: Signal<Statistic[]>;
  readonly isLoading: Signal<boolean>;

  readonly skeletonItems = [1, 2, 3, 4];

  readonly responsiveOptions = [
    { breakpoint: '1400px', numVisible: 4, numScroll: 1 },
    { breakpoint: '1200px', numVisible: 3, numScroll: 1 },
    { breakpoint: '990px', numVisible: 2, numScroll: 1 },
    { breakpoint: '640px', numVisible: 1, numScroll: 1 },
  ];

  private readonly statisticsService = inject(StatisticsService);
  constructor() {
    this.statistics = this.statisticsService.statistics;
    this.isLoading = this.statisticsService.isLoading;
  }
}
