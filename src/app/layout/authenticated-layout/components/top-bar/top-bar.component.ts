import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lb-top-bar',
  standalone: true,
  imports: [CommonModule, InputTextModule, AvatarModule, ButtonModule, TranslatePipe],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  currentLang = signal<string>('en');

  private readonly translate = inject(TranslateService);

  toggleLanguage() {
    const next = this.currentLang() === 'en' ? 'ar' : 'en';
    this.translate.use(next);
    this.currentLang.set(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  }
}
