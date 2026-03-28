import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

@Component({ template: '', standalone: true })
class EmptyComponent {}
import { provideTranslateService } from '@ngx-translate/core';
import { SideMenuComponent } from './side-menu.component';
import { MenuService } from '../../../../core/services/menu.service';
import { NewTaskService } from '../../../../core/services/new-task.service';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let newTaskService: NewTaskService;
  let menuService: MenuService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuComponent],
      providers: [
        provideRouter([{ path: '**', component: EmptyComponent }]),
        provideTranslateService({ fallbackLang: 'en', lang: 'en' }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    newTaskService = TestBed.inject(NewTaskService);
    menuService = TestBed.inject(MenuService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template rendering', () => {
    it('should render 6 nav links', () => {
      const links = fixture.nativeElement.querySelectorAll('.side-menu__item');
      expect(links.length).toBe(6);
    });

    it('should render icons for each menu item', () => {
      const icons = fixture.nativeElement.querySelectorAll('.side-menu__icon');
      expect(icons).toHaveLength(6);
      expect(icons[0].textContent.trim()).toBe('📊');
    });

    it('should render labels for each menu item', () => {
      const labels = fixture.nativeElement.querySelectorAll('.side-menu__label');
      expect(labels).toHaveLength(6);
    });

    it('should render the new task button', () => {
      const button = fixture.nativeElement.querySelector('.side-menu__new-task');
      expect(button).toBeTruthy();
    });
  });

  describe('new task button', () => {
    it('should call NewTaskService.requestNewTask when clicked', () => {
      const spy = vi.spyOn(newTaskService, 'requestNewTask');
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.side-menu__new-task');

      button.click();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should close the menu when new task is clicked', () => {
      const spy = vi.spyOn(menuService, 'close');
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.side-menu__new-task');

      button.click();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('MenuService integration', () => {
    it('should close menu when a nav link is clicked', () => {
      const spy = vi.spyOn(menuService, 'close');
      const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.side-menu__item');

      link.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should show backdrop when menu is open', () => {
      menuService.isOpen.set(true);
      fixture.detectChanges();

      const backdrop = fixture.nativeElement.querySelector('[aria-hidden="true"]');
      expect(backdrop).toBeTruthy();
    });

    it('should hide backdrop when menu is closed', () => {
      menuService.isOpen.set(false);
      fixture.detectChanges();

      const backdrop = fixture.nativeElement.querySelector('[aria-hidden="true"]');
      expect(backdrop).toBeFalsy();
    });
  });
});
