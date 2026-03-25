import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'lb-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  imports: [LoaderComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashScreenComponent {}
