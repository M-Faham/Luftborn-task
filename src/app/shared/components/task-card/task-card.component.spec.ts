import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MenuItemCommandEvent } from 'primeng/api';
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

    it('should set is-overdue to true when due date is in the past', () => {
      initWith({ dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() });

      const classes = host.card().cardClasses();
      expect(classes['is-overdue']).toBe(true);
    });

    it('should set is-overdue to false when due date is in the future', () => {
      initWith({ dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() });

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

  describe('speedDialItems', () => {
    it('should have four items', () => {
      initWith();

      expect(host.card().speedDialItems()).toHaveLength(4);
    });

    it('should disable move-forward when status is Done', () => {
      initWith({ status: TaskStatusEnum.Done });

      const items = host.card().speedDialItems();
      const moveForward = items.find((i) => i.icon === 'pi pi-arrow-right')!;
      expect(moveForward.disabled).toBe(true);
    });

    it('should enable move-forward when status is not Done', () => {
      initWith({ status: TaskStatusEnum.InProgress });

      const items = host.card().speedDialItems();
      const moveForward = items.find((i) => i.icon === 'pi pi-arrow-right')!;
      expect(moveForward.disabled).toBe(false);
    });

    it('should disable move-backward when status is Todo', () => {
      initWith({ status: TaskStatusEnum.Todo });

      const items = host.card().speedDialItems();
      const moveBackward = items.find((i) => i.icon === 'pi pi-arrow-left')!;
      expect(moveBackward.disabled).toBe(true);
    });

    it('should enable move-backward when status is not Todo', () => {
      initWith({ status: TaskStatusEnum.InProgress });

      const items = host.card().speedDialItems();
      const moveBackward = items.find((i) => i.icon === 'pi pi-arrow-left')!;
      expect(moveBackward.disabled).toBe(false);
    });

    it('should emit moveForward when move-forward command is invoked', () => {
      const task = makeTask({ status: TaskStatusEnum.Todo });
      initWith(task);

      const spy = vi.fn();
      host.card().moveForward.subscribe(spy);

      const moveForward = host
        .card()
        .speedDialItems()
        .find((i) => i.icon === 'pi pi-arrow-right')!;
      moveForward.command!({} as MenuItemCommandEvent);

      expect(spy).toHaveBeenCalledWith(task);
    });

    it('should emit update when update command is invoked', () => {
      const task = makeTask();
      initWith(task);

      const spy = vi.fn();
      host.card().update.subscribe(spy);

      const updateItem = host
        .card()
        .speedDialItems()
        .find((i) => i.icon === 'pi pi-pencil')!;
      updateItem.command!({} as MenuItemCommandEvent);

      expect(spy).toHaveBeenCalledWith(task);
    });

    it('should emit delete when delete command is invoked', () => {
      const task = makeTask();
      initWith(task);

      const spy = vi.fn();
      host.card().delete.subscribe(spy);

      const deleteItem = host
        .card()
        .speedDialItems()
        .find((i) => i.icon === 'pi pi-trash')!;
      deleteItem.command!({} as MenuItemCommandEvent);

      expect(spy).toHaveBeenCalledWith(task);
    });

    it('should emit moveBackward when move-backward command is invoked', () => {
      const task = makeTask({ status: TaskStatusEnum.InProgress });
      initWith(task);

      const spy = vi.fn();
      host.card().moveBackward.subscribe(spy);

      const moveBackward = host
        .card()
        .speedDialItems()
        .find((i) => i.icon === 'pi pi-arrow-left')!;
      moveBackward.command!({} as MenuItemCommandEvent);

      expect(spy).toHaveBeenCalledWith(task);
    });
  });

  describe('template rendering', () => {
    it('should render the task title', () => {
      initWith({ title: 'My Important Task' });

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.card-title')!.textContent).toContain('My Important Task');
    });

    it('should render the task description', () => {
      initWith({ description: 'Some details here' });

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.card-description')!.textContent).toContain('Some details here');
    });

    it('should render the assignee name', () => {
      initWith({ assignee: { id: 'u2', name: 'Bob', avatar: 'BO', email: 'bob@example.com' } });

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.assignee-name')!.textContent).toContain('Bob');
    });

    it('should render the assignee avatar', () => {
      initWith({ assignee: { id: 'u2', name: 'Bob', avatar: 'BO', email: 'bob@example.com' } });

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.avatar')!.textContent).toContain('BO');
    });

    it('should render the first tag when tags are present', () => {
      initWith({ tags: ['urgent', 'frontend'] });

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.card-tag')!.textContent).toContain('urgent');
    });

    it('should not render a tag when tags are empty', () => {
      initWith({ tags: [] });

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.card-tag')).toBeNull();
    });

    it('should apply ngClass with cardClasses on the task-card element', () => {
      initWith({
        priority: TaskPriorityEnum.High,
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      });

      const el: HTMLElement = fixture.nativeElement;
      const card = el.querySelector('.task-card')!;
      expect(card.classList.contains('priority-high')).toBe(true);
      expect(card.classList.contains('is-overdue')).toBe(true);
    });
  });
});
