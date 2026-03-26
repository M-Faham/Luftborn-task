import { StatisticsResponse } from '../../app/shared/models';
import { ChangeTypeEnum } from '../../app/shared/enums';

export const MOCK_STATISTICS: StatisticsResponse = {
  statistics: [
    {
      id: 'stat-001',
      title: 'Total Tasks',
      icon: '📊',
      value: 156,
      change: '+12',
      changeLabel: 'this week',
      changeType: ChangeTypeEnum.Positive,
      color: '#1976D2',
    },
    {
      id: 'stat-002',
      title: 'Completed',
      icon: '✅',
      value: 89,
      change: '+8',
      changeLabel: 'today',
      changeType: ChangeTypeEnum.Positive,
      color: '#388E3C',
    },
    {
      id: 'stat-003',
      title: 'In Progress',
      icon: '🔄',
      value: 42,
      change: '0',
      changeLabel: 'Same as yesterday',
      changeType: ChangeTypeEnum.Neutral,
      color: '#FF6F00',
    },
    {
      id: 'stat-004',
      title: 'Overdue',
      icon: '⚠️',
      value: 25,
      change: '+3',
      changeLabel: 'today',
      changeType: ChangeTypeEnum.Negative,
      color: '#D32F2F',
    },
  ],
  lastUpdated: '2026-03-25T14:46:07.831Z',
};
