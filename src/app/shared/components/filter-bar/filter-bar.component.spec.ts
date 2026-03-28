import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { TaskPriorityEnum, TaskStatusEnum } from '../../enums';
import { Assignee } from '../../models';
import { FilterBarComponent } from './filter-bar.component';

const MOCK_USERS: Assignee[] = [
  { id: 'user-001', name: 'John Doe', avatar: 'JD', email: 'john@company.com' },
  { id: 'user-002', name: 'Sarah Smith', avatar: 'SS', email: 'sarah@company.com' },
];

@Component({
  imports: [FilterBarComponent],
  template: `<lb-filter-bar
    [activeStatus]="status"
    [activePriority]="priority"
    [activeAssignee]="assignee"
    [users]="users"
  />`,
})
class TestHostComponent {
  status: TaskStatusEnum | null = null;
  priority: TaskPriorityEnum | null = null;
  assignee: string | null = null;
  users: Assignee[] = MOCK_USERS;
  bar = viewChild.required(FilterBarComponent);
}

describe('FilterBarComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(host.bar()).toBeTruthy();
  });

  describe('status tabs', () => {
    it('should have 4 status tabs (All + 3 statuses)', () => {
      expect(host.bar().statusTabs).toHaveLength(4);
    });

    it('should emit statusChange with null when "All" tab is clicked', () => {
      const spy = vi.fn();
      host.bar().statusChange.subscribe(spy);

      host.bar().onStatusClick(null);

      expect(spy).toHaveBeenCalledWith(null);
    });

    it('should emit statusChange with the selected status', () => {
      const spy = vi.fn();
      host.bar().statusChange.subscribe(spy);

      host.bar().onStatusClick(TaskStatusEnum.Done);

      expect(spy).toHaveBeenCalledWith(TaskStatusEnum.Done);
    });

    it('should render active class on the matching tab', () => {
      host.status = TaskStatusEnum.InProgress;
      fixture.detectChanges();

      const tabs = fixture.nativeElement.querySelectorAll('.filter-bar__tab');
      const activeTab = fixture.nativeElement.querySelector('.filter-bar__tab--active');
      expect(activeTab).toBeTruthy();
      // "All" (index 0) should NOT be active; "In Progress" (index 2) should be
      expect(tabs[0].classList.contains('filter-bar__tab--active')).toBe(false);
      expect(tabs[2].classList.contains('filter-bar__tab--active')).toBe(true);
    });

    it('should mark "All" as active when activeStatus is null', () => {
      host.status = null;
      fixture.detectChanges();

      const tabs = fixture.nativeElement.querySelectorAll('.filter-bar__tab');
      expect(tabs[0].classList.contains('filter-bar__tab--active')).toBe(true);
    });
  });

  describe('priority dropdown', () => {
    it('should have 4 priority options (All + 3 priorities)', () => {
      expect(host.bar().priorityOptions).toHaveLength(4);
    });

    it('should emit priorityChange when a priority is selected', () => {
      const spy = vi.fn();
      host.bar().priorityChange.subscribe(spy);

      host.bar().onPriorityChange(TaskPriorityEnum.High);

      expect(spy).toHaveBeenCalledWith(TaskPriorityEnum.High);
    });

    it('should emit priorityChange with null to clear the filter', () => {
      const spy = vi.fn();
      host.bar().priorityChange.subscribe(spy);

      host.bar().onPriorityChange(null);

      expect(spy).toHaveBeenCalledWith(null);
    });
  });

  describe('assignee dropdown', () => {
    it('should prepend an "All" option to users list', () => {
      expect(host.bar().assigneeOptions()).toHaveLength(MOCK_USERS.length + 1);
      expect(host.bar().assigneeOptions()[0].id).toBe('');
    });

    it('should emit assigneeChange with user id', () => {
      const spy = vi.fn();
      host.bar().assigneeChange.subscribe(spy);

      host.bar().onAssigneeChange(MOCK_USERS[0]);

      expect(spy).toHaveBeenCalledWith('user-001');
    });

    it('should emit assigneeChange with null when "All" is selected', () => {
      const spy = vi.fn();
      host.bar().assigneeChange.subscribe(spy);

      host.bar().onAssigneeChange({ id: '', name: '', avatar: '', email: '' });

      expect(spy).toHaveBeenCalledWith(null);
    });

    it('should return "All" option when activeAssignee is null', () => {
      host.assignee = null;
      fixture.detectChanges();

      expect(host.bar().selectedAssignee().id).toBe('');
    });

    it('should return the matching user when activeAssignee is set', () => {
      host.assignee = 'user-002';
      fixture.detectChanges();

      expect(host.bar().selectedAssignee().name).toBe('Sarah Smith');
    });
  });

  describe('new task button', () => {
    it('should emit newTask when clicked', () => {
      const spy = vi.fn();
      host.bar().newTask.subscribe(spy);

      host.bar().onNewTask();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
