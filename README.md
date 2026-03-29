# Task Management Dashboard

A production-ready task management app built with Angular 21, demonstrating modern Angular patterns, performance optimization, and enterprise-level practices.

**Live Demo:** https://m-faham.github.io/Luftborn-task

---

## Tech Stack

- **Angular 21.2** — Standalone components, Signals, httpResource, SSR
- **PrimeNG 21** — UI component library
- **Tailwind CSS 4** — Utility-first styling
- **Vitest** — Unit testing
- **MSW (Mock Service Worker)** — API mocking \*\*"AI Generated"
- **@ngx-translate** — i18n (English + Arabic/RTL)
- **Husky and Prettier** — Used husky as a precommit/prepush to check linting, errors, test results and test code coverage ubove 80%

---

## Features

- **Task board** — Kanban-style columns (Todo / In Progress / Done)
- **CRUD** — Create, edit, delete tasks via modal dialogs with confirmation
- **Filtering** — By status, priority, and assignee (all client-side)
- **Real-time search** — Wired to the top bar, filters by title and description
- **Statistics cards** — Total, completed, in-progress, overdue counts
- **Analytics page** — Charts (doughnut + bar) showing distribution by priority, status, and assignee using Chart.js
- **Responsive** — Mobile hamburger menu, adaptive layouts
- **i18n** — Full EN/AR support with RTL layout switching

---

## Architecture

### Patterns

- **Smart / Presentational components** — Smart components own services and state; presentational components communicate only via `input()`/`output()`
- **Signals everywhere** — No `BehaviorSubject`, no `async` pipe; state is managed with Angular signals and `computed()`
- **httpResource** — Declarative HTTP fetching that integrates natively with signals
- **Client-side filtering** — All filters (status, priority, assignee, search) applied in-memory via a `computed()` in `TaskService`, no query params sent to the mock API

### Folder structure

```
src/app/
├── core/           # Interceptors, global services (loading, search, menu)
├── features/       # Dashboard, Analytics, Tasks pages (lazy loaded)
├── layout/         # AuthenticatedLayout, TopBar, SideMenu
└── shared/         # Reusable components, models, pipes, enums
```

### Key services

| Service             | Responsibility                                             |
| ------------------- | ---------------------------------------------------------- |
| `TaskService`       | httpResource + client-side filtering + CRUD                |
| `StatisticsService` | httpResource for stats cards                               |
| `AnalyticsService`  | httpResource + computed chart datasets                     |
| `SearchService`     | Root-level signal bridging TopBar ↔ TaskService            |
| `NewTaskService`    | Root-level trigger bridging SideMenu ↔ TasksBoardComponent |
| `MenuService`       | Mobile sidebar open/close state                            |

### HTTP Interceptor chain

```
Request → CachingInterceptor → ErrorInterceptor → LoadingInterceptor → Mock Service Worker
```

- **CachingInterceptor** — 30s TTL in-memory cache for GET requests, auto-invalidated on mutations
- **ErrorInterceptor** — Shows PrimeNG toast on HTTP errors
- **LoadingInterceptor** — Tracks concurrent requests, drives global loading state
- **Mock Service Worker** — Mocked BE APIs that can be seen in the netword **"AI Generated"**

---

## Getting Started

```bash
npm install
npm start          # dev server at http://localhost:4200
npm test           # unit tests (Vitest)
npm run build      # production build
```

---

## Performance

- `OnPush` change detection on every component
- Lazy-loaded routes for Dashboard, Analytics, and Tasks
- HTTP response caching (30s TTL) via interceptor
- `trackBy` functions on all `@for` loops
- Mock Service Worker intercepts requests in the browser — no real network calls in development
- Tested with Lighthouse with score 90%

---

## Bonus

- **CI/CD** — GitHub Actions runs tests and deploys to GitHub Pages on push to `main`
- **i18n** — EN + AR with full RTL support, toggle in the top bar
- **SSR** — Angular SSR configured (`@angular/ssr` + Express)
