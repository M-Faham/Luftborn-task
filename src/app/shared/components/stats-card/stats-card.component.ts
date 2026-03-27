import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Statistic } from '../../models';
import { ChangeTypeEnum } from '../../enums';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lb-stats-card',
  imports: [NgClass, TranslatePipe],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardComponent {
  stat = input.required<Statistic>();

  changeClasses = computed(() => {
    const type = this.stat().changeType;
    return {
      'change--positive': type === ChangeTypeEnum.Positive,
      'change--negative': type === ChangeTypeEnum.Negative,
      'change--neutral': type === ChangeTypeEnum.Neutral,
    };
  });
}
