import { http, HttpResponse } from 'msw';
import { TaskPriorityEnum, TaskStatusEnum } from '../app/shared/enums';
import { Task } from '../app/shared/models';
import { MOCK_STATISTICS } from './data/statistics';
import { MOCK_TASKS } from './data/tasks';
import { MOCK_USERS } from './data/users';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const READ_DELAY = 2000;
const WRITE_DELAY = 2000;

// in-memory store — mutations persist for the lifetime of the page
let tasks = [...MOCK_TASKS.tasks];

export const handlers = [
  http.get('/api/tasks', async () => {
    await delay(READ_DELAY);
    return HttpResponse.json({
      tasks,
      meta: {
        totalCount: tasks.length,
        lastUpdated: new Date().toISOString(),
      },
    });
  }),

  http.get('/api/tasks/:id', async ({ params }) => {
    await delay(READ_DELAY);
    const task = tasks.find((t) => t.id === params['id']);
    if (!task) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return HttpResponse.json(task);
  }),

  http.post('/api/tasks', async ({ request }) => {
    await delay(WRITE_DELAY);
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

  http.patch('/api/tasks/:id', async ({ params, request }) => {
    await delay(WRITE_DELAY);
    const body = (await request.json()) as Partial<Task>;
    const index = tasks.findIndex((t) => t.id === params['id']);
    if (index === -1) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    tasks[index] = { ...tasks[index], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(tasks[index]);
  }),

  // DELETE /api/tasks/:id
  http.delete('/api/tasks/:id', async ({ params }) => {
    await delay(WRITE_DELAY);
    const index = tasks.findIndex((t) => t.id === params['id']);
    if (index === -1) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    tasks = tasks.filter((t) => t.id !== params['id']);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/statistics', async () => {
    await delay(READ_DELAY);
    return HttpResponse.json(MOCK_STATISTICS);
  }),

  http.get('/api/users', async () => {
    await delay(READ_DELAY);
    return HttpResponse.json(MOCK_USERS);
  }),
];
