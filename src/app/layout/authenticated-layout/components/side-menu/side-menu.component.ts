import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NewTaskService } from '../../../../core/services/new-task.service';

@Component({
  selector: 'lb-side-menu',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  protected readonly menuItems = [
    { icon: '📊', label: 'sideMenu.dashboard', route: '/dashboard' },
    { icon: '✅', label: 'sideMenu.tasks', route: '/tasks' },
    { icon: '📅', label: 'sideMenu.calendar', route: '/calendar' },
    { icon: '📈', label: 'sideMenu.analytics', route: '/analytics' },
    { icon: '👥', label: 'sideMenu.team', route: '/team' },
    { icon: '⚙️', label: 'sideMenu.settings', route: '/settings' },
  ];

  private readonly newTaskService = inject(NewTaskService);

  onNewTask(): void {
    this.newTaskService.requestNewTask();
  }
}
