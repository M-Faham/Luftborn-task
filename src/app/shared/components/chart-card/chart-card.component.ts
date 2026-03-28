import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnChanges,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { Skeleton } from 'primeng/skeleton';
import { ChartDataset } from '../../../features/analytics/analytics.service';

Chart.register(...registerables);

const PALETTE = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

@Component({
  selector: 'lb-chart-card',
  standalone: true,
  imports: [TranslatePipe, Skeleton, NgClass],
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartCardComponent implements AfterViewInit, OnChanges, OnDestroy {
  title = input.required<string>();
  type = input.required<ChartType>();
  dataset = input.required<ChartDataset>();
  isLoading = input.required<boolean>();

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildChart(): void {
    const ctx = this.canvasRef().nativeElement.getContext('2d');
    if (!ctx) return;

    const { labels, data } = this.dataset();
    const isDoughnut = this.type() === 'doughnut';

    this.chart = new Chart(ctx, {
      type: this.type(),
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: isDoughnut ? PALETTE : PALETTE[4],
            borderColor: isDoughnut ? '#fff' : PALETTE[4],
            borderWidth: isDoughnut ? 2 : 0,
            borderRadius: isDoughnut ? 0 : 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: isDoughnut, position: 'bottom' },
          tooltip: { enabled: true },
        },
        scales: isDoughnut
          ? {}
          : {
              x: { grid: { display: false }, ticks: { color: '#6b7280' } },
              y: { grid: { color: '#f3f4f6' }, ticks: { color: '#6b7280', stepSize: 1 } },
            },
      },
    });
  }

  private updateChart(): void {
    if (!this.chart) return;
    const { labels, data } = this.dataset();
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }
}
