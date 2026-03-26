import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TopBarComponent } from './top-bar.component';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let translateService: { use: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    translateService = { use: vi.fn() };

    TestBed.configureTestingModule({
      providers: [TopBarComponent, { provide: TranslateService, useValue: translateService }],
    });

    component = TestBed.inject(TopBarComponent);
  });

  describe('initial state', () => {
    it('should default currentLang to "en"', () => {
      expect(component.currentLang()).toBe('en');
    });
  });

  describe('toggleLanguage', () => {
    it('should switch from "en" to "ar"', () => {
      component.toggleLanguage();

      expect(component.currentLang()).toBe('ar');
      expect(translateService.use).toHaveBeenCalledWith('ar');
      expect(document.documentElement.dir).toBe('rtl');
      expect(document.documentElement.lang).toBe('ar');
    });

    it('should switch from "ar" back to "en"', () => {
      component.toggleLanguage();
      component.toggleLanguage();

      expect(component.currentLang()).toBe('en');
      expect(translateService.use).toHaveBeenCalledWith('en');
      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang).toBe('en');
    });

    it('should call translate.use on each toggle', () => {
      component.toggleLanguage();
      expect(translateService.use).toHaveBeenCalledTimes(1);

      component.toggleLanguage();
      expect(translateService.use).toHaveBeenCalledTimes(2);
    });
  });
});
