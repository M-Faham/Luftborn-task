import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { SideMenuComponent } from './side-menu.component';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuComponent],
      providers: [provideRouter([]), provideTranslateService({ fallbackLang: 'en', lang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('component creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('menuItems', () => {
    it('should have 6 menu items', () => {
      expect(component.menuItems).toHaveLength(6);
    });

    it('should have dashboard as the first item', () => {
      expect(component.menuItems[0]).toEqual({
        icon: '📊',
        label: 'sideMenu.dashboard',
        route: '/dashboard',
      });
    });

    it('should have settings as the last item', () => {
      expect(component.menuItems[5]).toEqual({
        icon: '⚙️',
        label: 'sideMenu.settings',
        route: '/settings',
      });
    });
  });

  describe('template rendering', () => {
    it('should render a nav link for each menu item', () => {
      const links = fixture.nativeElement.querySelectorAll('.side-menu__item');
      expect(links.length).toBe(6);
    });

    it('should render icons for each menu item', () => {
      const icons = fixture.nativeElement.querySelectorAll('.side-menu__icon');
      expect(icons[0].textContent.trim()).toBe('📊');
    });

    it('should render the new task button', () => {
      const button = fixture.nativeElement.querySelector('.side-menu__new-task');
      expect(button).toBeTruthy();
    });
  });
});
