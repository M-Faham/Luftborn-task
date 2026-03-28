import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuService } from '../../../../core/services/menu.service';
import { SearchService } from '../../../../core/services/search.service';

@Component({
  selector: 'lb-top-bar',

  imports: [CommonModule, InputTextModule, AvatarModule, ButtonModule, TranslatePipe],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  currentLang = signal<string>('en');
  readonly menuService = inject(MenuService);

  private readonly translate = inject(TranslateService);
  private readonly searchService = inject(SearchService);

  toggleMenu(): void {
    this.menuService.toggle();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.search(value);
  }

  toggleLanguage() {
    const next = this.currentLang() === 'en' ? 'ar' : 'en';
    this.translate.use(next);
    this.currentLang.set(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  }
}
