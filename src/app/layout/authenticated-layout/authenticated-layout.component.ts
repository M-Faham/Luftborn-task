import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';

@Component({
  selector: 'lb-authenticated-layout',

  imports: [RouterOutlet, TopBarComponent, SideMenuComponent],
  templateUrl: './authenticated-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedLayoutComponent {}
