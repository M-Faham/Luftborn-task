import { Statistic } from './statistic.model';

export interface StatisticsResponse {
  statistics: Statistic[];
  lastUpdated: string;
}
