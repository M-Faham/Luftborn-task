import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { TasksPageComponent } from './tasks.component';
import { TasksBoardComponent } from '../../shared/components/tasks-board/tasks-board.component';

/** Stub to avoid spinning up the full TasksBoardComponent tree in a page-level test. */
@Component({ selector: 'lb-tasks-board', template: '', standalone: true })
class TasksBoardStubComponent {}

describe('TasksPageComponent', () => {
  let component: TasksPageComponent;
  let fixture: ComponentFixture<TasksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksPageComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    })
      .overrideComponent(TasksPageComponent, {
        remove: { imports: [TasksBoardComponent] },
        add: { imports: [TasksBoardStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TasksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render lb-tasks-board', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('lb-tasks-board')).toBeTruthy();
  });
});
