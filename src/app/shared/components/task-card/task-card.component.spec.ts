import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { TaskCardComponent } from './task-card.component';
import { Task } from '../../models';
import { TaskStatusEnum, TaskPriorityEnum } from '../../enums';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Test Task',
    description: 'Description',
    status: TaskStatusEnum.Todo,
    priority: TaskPriorityEnum.Medium,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isOverdue: false,
    assignee: { id: 'u1', name: 'Alice', avatar: 'AL', email: 'alice@example.com' },
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

@Component({
  imports: [TaskCardComponent],
  template: `<lb-task-card [task]="task" />`,
})
class TestHostComponent {
  task: Task = makeTask();
  card = viewChild.required(TaskCardComponent);
}

describe('TaskCardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  function initWith(overrides: Partial<Task> = {}): void {
    host.task = makeTask(overrides);
    fixture.detectChanges();
  }

  describe('cardClasses', () => {
    it('should include the priority class', () => {
      initWith({ priority: TaskPriorityEnum.High });

      const classes = host.card().cardClasses();
      expect(classes).toEqual(expect.objectContaining({ 'priority-high': true }));
    });

    it('should set is-overdue to true when task is overdue', () => {
      initWith({ isOverdue: true });

      const classes = host.card().cardClasses();
      expect(classes['is-overdue']).toBe(true);
    });

    it('should set is-overdue to false when task is not overdue', () => {
      initWith({ isOverdue: false });

      const classes = host.card().cardClasses();
      expect(classes['is-overdue']).toBe(false);
    });

    it('should apply priority-low class for low priority', () => {
      initWith({ priority: TaskPriorityEnum.Low });

      const classes = host.card().cardClasses();
      expect(classes['priority-low']).toBe(true);
    });

    it('should apply priority-medium class for medium priority', () => {
      initWith({ priority: TaskPriorityEnum.Medium });

      const classes = host.card().cardClasses();
      expect(classes['priority-medium']).toBe(true);
    });

    it('should apply priority-high class for high priority', () => {
      initWith({ priority: TaskPriorityEnum.High });

      const classes = host.card().cardClasses();
      expect(classes['priority-high']).toBe(true);
    });
  });
});
