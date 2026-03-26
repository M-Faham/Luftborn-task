import { ChangeTypeEnum } from '../enums/change-type.enum';

export interface Statistic {
  id: string;
  title: string;
  icon: string;
  value: number;
  change: string;
  changeLabel: string;
  changeType: ChangeTypeEnum;
  color: string;
}
