import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { SplashScreenComponent } from './splash-screen.component';

describe('SplashScreenComponent', () => {
  let fixture: ComponentFixture<SplashScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplashScreenComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(SplashScreenComponent);
    fixture.detectChanges();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the splash screen container', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.splash-screen')).not.toBeNull();
  });

  it('should render lb-loader', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('lb-loader')).not.toBeNull();
  });

  it('should render the please wait text element', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.splash-screen p')).not.toBeNull();
  });
});
