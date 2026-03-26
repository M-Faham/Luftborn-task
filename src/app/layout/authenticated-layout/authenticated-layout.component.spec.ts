import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { AuthenticatedLayoutComponent } from './authenticated-layout.component';

describe('AuthenticatedLayoutComponent', () => {
  let component: AuthenticatedLayoutComponent;
  let fixture: ComponentFixture<AuthenticatedLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedLayoutComponent],
      providers: [provideRouter([]), provideTranslateService({ fallbackLang: 'en', lang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticatedLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('component creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('template rendering', () => {
    it('should render the top bar', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('lb-top-bar')).toBeTruthy();
    });

    it('should render a main element with class "layout-content"', () => {
      const main: HTMLElement = fixture.nativeElement.querySelector('main.layout-content');
      expect(main).toBeTruthy();
    });

    it('should render a router-outlet inside main', () => {
      const outlet = fixture.nativeElement.querySelector('main router-outlet');
      expect(outlet).toBeTruthy();
    });
  });
});
