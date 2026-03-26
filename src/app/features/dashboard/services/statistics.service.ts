import { computed, Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { StatisticsResponse } from '../../../shared/models';

@Injectable()
export class StatisticsService {
  readonly baseUrl = '/api/statistics';

  readonly statisticsResource = httpResource<StatisticsResponse>(() => this.baseUrl);

  readonly statistics = computed(() => this.statisticsResource.value()?.statistics ?? []);

  readonly isLoading = computed(() => this.statisticsResource.isLoading());

  readonly error = this.statisticsResource.error;

  reload(): void {
    this.statisticsResource.reload();
  }
}
