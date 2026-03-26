import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';
import { TopBarComponent } from './top-bar.component';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarComponent],
      providers: [provideTranslateService({ fallbackLang: 'en', lang: 'en' })],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    TestBed.resetTestingModule();
  });

  describe('component creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('currentLang signal', () => {
    it('should default to "en"', () => {
      expect(component.currentLang()).toBe('en');
    });
  });

  describe('toggleLanguage()', () => {
    it('should switch currentLang from "en" to "ar"', () => {
      component.toggleLanguage();
      expect(component.currentLang()).toBe('ar');
    });

    it('should switch currentLang back to "en" on second call', () => {
      component.toggleLanguage();
      component.toggleLanguage();
      expect(component.currentLang()).toBe('en');
    });

    it('should call translate.use() with the new language', () => {
      vi.spyOn(translateService, 'use');
      component.toggleLanguage();
      expect(translateService.use).toHaveBeenCalledWith('ar');
    });

    it('should set document dir to "rtl" when switching to "ar"', () => {
      component.toggleLanguage();
      expect(document.documentElement.dir).toBe('rtl');
    });

    it('should set document dir to "ltr" when switching back to "en"', () => {
      component.toggleLanguage();
      component.toggleLanguage();
      expect(document.documentElement.dir).toBe('ltr');
    });

    it('should set document lang attribute to the new language', () => {
      component.toggleLanguage();
      expect(document.documentElement.lang).toBe('ar');
    });
  });

  describe('template rendering', () => {
    it('should render the app name "Task Manager"', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.top-bar__app-name')?.textContent?.trim()).toBe('Task Manager');
    });

    it('should render the search input with correct placeholder', () => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector('.top-bar__search-input');
      expect(input).toBeTruthy();
      expect(input.placeholder).toBe('Search tasks...');
    });

    it('should render the search input as readonly', () => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector('.top-bar__search-input');
      expect(input.readOnly).toBe(true);
    });

    it('should render the bell button with aria-label "Notifications"', () => {
      const bell: HTMLElement = fixture.nativeElement.querySelector('.top-bar__bell');
      expect(bell).toBeTruthy();
      expect(bell.getAttribute('aria-label')).toBe('Notifications');
    });

    it('should render the avatar with initials "JD"', () => {
      const avatar: HTMLElement = fixture.nativeElement.querySelector('.top-bar__avatar');
      expect(avatar?.textContent?.trim()).toBe('JD');
    });

    it('should render the lang button showing "AR" when current lang is "en"', () => {
      const btn: HTMLElement = fixture.nativeElement.querySelector('.top-bar__lang-btn');
      expect(btn?.textContent?.trim()).toBe('AR');
    });

    it('should render the lang button showing "EN" after switching to "ar"', () => {
      component.toggleLanguage();
      fixture.detectChanges();
      const btn: HTMLElement = fixture.nativeElement.querySelector('.top-bar__lang-btn');
      expect(btn?.textContent?.trim()).toBe('EN');
    });

    it('should update lang button title to "Switch to English" after switching to "ar"', () => {
      component.toggleLanguage();
      fixture.detectChanges();
      const btn: HTMLElement = fixture.nativeElement.querySelector('.top-bar__lang-btn');
      expect(btn?.getAttribute('title')).toBe('Switch to English');
    });

    it('should render the logo element', () => {
      const logo: HTMLElement = fixture.nativeElement.querySelector('.top-bar__logo');
      expect(logo).toBeTruthy();
    });
  });
});
