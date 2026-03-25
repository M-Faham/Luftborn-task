import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { LoaderComponent } from '../loader/loader.component';
@Component({
  selector: 'lb-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [DialogModule, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  isLoading = input.required<boolean>();
}
