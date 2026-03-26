import { http, HttpResponse } from 'msw';
import { MOCK_TASKS } from './data/tasks';
import { MOCK_STATISTICS } from './data/statistics';
import { Task } from '../app/shared/models';
import { TaskStatusEnum, TaskPriorityEnum } from '../app/shared/enums';

// In-memory store so POST/PATCH mutations persist during the session
let tasks = [...MOCK_TASKS.tasks];

export const handlers = [
  // GET /api/tasks — list all tasks
  http.get('/api/tasks', () => {
    return HttpResponse.json({
      tasks,
      meta: {
        totalCount: tasks.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  }),

  // GET /api/tasks/:id — single task
  http.get('/api/tasks/:id', ({ params }) => {
    const task = tasks.find((t) => t.id === params['id']);
    if (!task) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return HttpResponse.json(task);
  }),

  // POST /api/tasks — create task
  http.post('/api/tasks', async ({ request }) => {
    const body = (await request.json()) as Partial<Task>;
    const newTask: Task = {
      id: String(Date.now()),
      title: body.title ?? 'Untitled',
      description: body.description ?? '',
      status: body.status ?? TaskStatusEnum.Todo,
      priority: body.priority ?? TaskPriorityEnum.Medium,
      dueDate: body.dueDate ?? new Date().toISOString(),
      isOverdue: false,
      completedAt: '',
      assignee: body.assignee ?? {
        id: 'u1',
        name: 'Alice Johnson',
        avatar: '',
        email: 'alice@example.com',
      },
      tags: body.tags ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks = [...tasks, newTask];
    return HttpResponse.json(newTask, { status: 201 });
  }),

  // PATCH /api/tasks/:id — update task
  http.patch('/api/tasks/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<Task>;
    const index = tasks.findIndex((t) => t.id === params['id']);
    if (index === -1) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    tasks[index] = { ...tasks[index], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(tasks[index]);
  }),

  // DELETE /api/tasks/:id
  http.delete('/api/tasks/:id', ({ params }) => {
    const index = tasks.findIndex((t) => t.id === params['id']);
    if (index === -1) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    tasks = tasks.filter((t) => t.id !== params['id']);
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/statistics
  http.get('/api/statistics', () => {
    return HttpResponse.json(MOCK_STATISTICS);
  }),
];
