import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { Assignee, Task } from '../../models';
import { TaskPriorityEnum, TaskStatusEnum } from '../../enums';

export interface TaskFormData {
  task?: Task;
}

export interface TaskFormResult {
  changes: Partial<Task>;
}

@Component({
  selector: 'lb-task-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnInit {
  readonly form: FormGroup;

  readonly statusOptions = [
    { label: 'tasks.todo', value: TaskStatusEnum.Todo },
    { label: 'tasks.in_progress', value: TaskStatusEnum.InProgress },
    { label: 'tasks.done', value: TaskStatusEnum.Done },
  ];

  readonly isEdit: boolean;
  readonly task?: Task;

  readonly priorityOptions = [
    { label: 'tasks.high', value: TaskPriorityEnum.High },
    { label: 'tasks.medium', value: TaskPriorityEnum.Medium },
    { label: 'tasks.low', value: TaskPriorityEnum.Low },
  ];

  readonly users = signal<Assignee[]>([]);

  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig<TaskFormData>);

  constructor() {
    this.task = this.config.data?.task;
    this.isEdit = !!this.task;

    this.form = this.fb.nonNullable.group({
      title: ['', Validators.required],
      description: [''],
      priority: [TaskPriorityEnum.Medium, Validators.required],
      status: [TaskStatusEnum.Todo, Validators.required],
      assignee: [null as Assignee | null, Validators.required],
      dueDate: [null as Date | null, Validators.required],
      tags: [''],
    });
  }

  ngOnInit(): void {
    this.http.get<Assignee[]>('/api/users').subscribe((users) => this.users.set(users));

    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        priority: this.task.priority,
        status: this.task.status,
        assignee: this.task.assignee,
        dueDate: new Date(this.task.dueDate),
        tags: this.task.tags?.join(', ') ?? '',
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const changes: Partial<Task> = {
      title: raw.title,
      description: raw.description,
      priority: raw.priority,
      status: raw.status,
      assignee: raw.assignee,
      dueDate: raw.dueDate?.toISOString().split('T')[0] ?? '',
      tags: raw.tags
        ? raw.tags
            .split(',')
            .map((t: any) => t.trim())
            .filter(Boolean)
        : [],
    };

    this.ref.close({ changes } as TaskFormResult);
  }

  onCancel(): void {
    this.ref.close();
  }
}
