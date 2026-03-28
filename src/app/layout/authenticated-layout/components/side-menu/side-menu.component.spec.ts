import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { SideMenuComponent } from './side-menu.component';
import { NewTaskService } from '../../../../core/services/new-task.service';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let newTaskService: NewTaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuComponent],
      providers: [provideRouter([]), provideTranslateService({ fallbackLang: 'en', lang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    newTaskService = TestBed.inject(NewTaskService);
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
  });
});
