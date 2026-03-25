import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'lb-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  imports: [ProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {}
