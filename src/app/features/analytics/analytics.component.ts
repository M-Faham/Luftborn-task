import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { StatisticsComponent } from '../../shared/components/statistics/statistics.component';
import { AnalyticsService, ChartDataset } from './analytics.service';
@Component({
  selector: 'lb-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  imports: [StatisticsComponent, ChartCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AnalyticsService],
})
export class AnalyticsComponent {
  readonly isLoading: Signal<boolean>;
  readonly byPriority: Signal<ChartDataset>;
  readonly byStatus: Signal<ChartDataset>;
  readonly byAssignee: Signal<ChartDataset>;

  private readonly analyticsService = inject(AnalyticsService);

  constructor() {
    this.isLoading = this.analyticsService.isLoading;
    this.byPriority = this.analyticsService.byPriority;
    this.byStatus = this.analyticsService.byStatus;
    this.byAssignee = this.analyticsService.byAssignee;
  }
}
