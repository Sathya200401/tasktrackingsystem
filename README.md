# Employee Task Tracker

Modern full-stack tool for managing employees and their work streams with a Jira-style board, rich dashboards, and a MongoDB-powered API.

## Tech Stack

| Layer     | Tech                                                                 |
|-----------|----------------------------------------------------------------------|
| Frontend  | Vite + React 19, TypeScript, React Router, MUI 7, React Query, Axios, Recharts |
| Backend   | Node.js 20, Express 5, TypeScript, Mongoose, express-validator       |
| Database  | MongoDB 7 (local instance or Atlas)                                  |

## Architecture

- **Backend (`/backend`)** exposes REST endpoints under `/api`, handles validation, aggregates dashboard metrics, and persists data in MongoDB via Mongoose models (`Employee` ↔ `Task`).
- **Frontend (`/frontend`)** consumes the API, offering:
  - Jira-like Kanban board with swimlane columns, inline status & priority editing, filtering, milestone/estimate capture, and task creation modal.
  - Dashboard with KPI cards, status/priority breakdown, recent activity feed, and team load visualization.
  - Employee directory with productivity stats and an “Add employee” workflow for people teams.

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
cp env.example .env          # update with your Mongo URI if needed
npm install
npm run dev                  # starts http://localhost:5000
```

To seed sample employees and tasks:
```bash
npm run seed
```

### Quick-install (requirements.txt)
If you want to install all dependencies from the root, run the install script that installs both backend and frontend dependencies. There are two options depending on your platform:

PowerShell (Windows):
```powershell
.\install-dependencies.ps1
```
macOS / Linux:
```bash
./install-dependencies.sh
```
Alternatively, open two terminals and run `npm install` in both the `backend` and `frontend` folders.

### 2. Frontend Setup
```bash
cd frontend
cp env.example .env          # defaults to http://localhost:5000
npm install
npm run dev                  # starts http://localhost:5173
```

### 3. Running both
- Start MongoDB (e.g., `docker run -d -p 27017:27017 mongo:7`).
- Run backend + frontend dev servers (separate terminals) and open the frontend URL. The UI communicates with the API via the configured `VITE_API_BASE_URL`.

### Authentication
- **Admin (full CRUD)** – email `admin@nexus.io`, password `aimadmin@123`.
- **View-only users** – sign up via `/signup`; every other account is issued the `viewer` role automatically and can only consume data.
- JWTs are stored in `localStorage` on the client and attached to `Authorization: Bearer <token>` for protected endpoints.

## Environment Variables

### Backend (`backend/.env`)
| Key            | Description                             |
|----------------|-----------------------------------------|
| `PORT`         | API port (default `5000`)               |
| `MONGODB_URI`  | Mongo connection string                 |
| `CLIENT_ORIGIN`| Comma-separated list of allowed origins |
| `JWT_SECRET`   | Secret used to sign auth tokens         |
| `JWT_EXPIRES_IN`| Token lifetime (e.g., `2d`)            |

### Frontend (`frontend/.env`)
| Key                  | Description                                 |
|----------------------|---------------------------------------------|
| `VITE_API_BASE_URL`  | Base URL for the backend (default `:5000`)  |

## API Reference

| Method | Endpoint              | Description                                  |
|--------|-----------------------|----------------------------------------------|
| POST   | `/api/auth/signup`    | Create viewer account & issue JWT            |
| POST   | `/api/auth/login`     | Log in (special credentials promote Admin)   |
| GET    | `/api/employees`      | List employees + workload stats              |
| GET    | `/api/employees/:id`  | Single employee with assigned tasks          |
| POST   | `/api/employees`      | **Admin** Create employee                    |
| PUT    | `/api/employees/:id`  | **Admin** Update employee                    |
| DELETE | `/api/employees/:id`  | **Admin** Delete employee (no assigned tasks)|
| GET    | `/api/tasks`          | List tasks (filter by status, employee, etc) |
| GET    | `/api/tasks/:id`      | Fetch single task                            |
| POST   | `/api/tasks`          | **Admin** Create task                        |
| PUT    | `/api/tasks/:id`      | **Admin** Update task status/priority        |
| DELETE | `/api/tasks/:id`      | **Admin** Remove task                        |
| GET    | `/api/dashboard`      | KPI metrics, status mix, recent activity     |

All responses follow `{ success, data }` or `{ success:false, message }`.

## Database Schema

### Employee
```json
{
  "name": "string",
  "title": "string",
  "department": "string",
  "email": "string (unique)",
  "avatarUrl": "string",
  "location": "string",
  "phone": "string",
  "skills": ["string"],
  "allocation": "number (0-100)",
  "startDate": "Date",
  "role": "admin | member"
}
```

### Task
```json
{
  "title": "string",
  "description": "string",
  "status": "todo | in_progress | in_review | testing | need_review | done",
  "priority": "low | medium | high | critical",
  "dueDate": "Date",
  "tags": ["string"],
  "milestone": "string",
  "estimatedHours": "number",
  "linkedDocs": ["string"],
  "assignedTo": "Employee ObjectId"
}
```

Relationships are enforced via Mongoose refs and validated in route handlers. `backend/src/data/seed.ts` contains sample records.

## UI Highlights (Jira-style Task HQ)

- **Mission Control Dashboard** – KPI cards, workload distribution, and real-time activity feed.
- **Kanban Task Board** – four swimlanes (Backlog → Done) with inline status/priority editing, milestone & estimate capture, drag-and-drop for admins, and a modern modal for new tasks.
 - **Kanban Task Board** – four swimlanes (Backlog → Done) with inline status/priority editing, milestone & estimate capture, drag-and-drop for admins, and a modern modal for new tasks. Empty columns now display a light placeholder without in-column Add buttons to reduce clutter; a central ‘Add Task’ control is recommended.
- **Employee Ops Center** – table showing ownership, skills, allocations, and completion rates, plus a first-class “Add employee” workflow.
 - **Employee Ops Center** – table showing ownership, skills, allocations, and completion rates, plus a first-class “Add employee” workflow. The table shows a friendly empty state when no employees are present.
- **Authentication & RBAC** – admin-only create/update/delete endpoints guarded by JWT; everyone else automatically receives view-only access. Use `admin@nexus.io` / `aimadmin@123` for full control.
- Responsive, themeable interface powered by Material UI 7 with Inter typography.

## Assumptions & Limitations
- Auth tokens are stateless JWTs without refresh/rotation; rotate the secret regularly in production.
- Passwords for viewer accounts are hashed with bcrypt, but there is no email verification/forgot password flow yet.
- App expects a reachable MongoDB instance; Atlas connection strings work out of the box.
- Backend tests exist. Run them from the `backend` folder:
```
cd backend
npm run test
```
Frontend currently has no unit tests; add tests as a recommended next step.

## Recommended Next Steps
1. Add refresh tokens + password reset to harden auth even further.
2. Introduce drag-and-drop swimlane reordering persistence (ordering within a column).
3. Add automated tests (Jest + React Testing Library, supertest for API).
4. Containerize with Docker Compose for one-command spin-up.

## What's New (UI & UX Enhancements)

This project includes multiple notable UI/UX improvements implemented on the frontend. They are safe, incremental changes meant to improve clarity and visibility for both users and reviewers.

- Interactive Status Distribution (pie chart)
  - The status distribution in the Dashboard is now a clickable pie chart built with `recharts`. Clicking a slice filters the "Recent Activity" list by that status.
  - Files: `frontend/src/components/dashboard/StatusDistribution.tsx`, wired in: `frontend/src/pages/DashboardPage.tsx`.

- Team Load visualization (bar chart)
  - Team load is now displayed with a vertical stacked bar chart using `recharts` showing total tasks vs completed tasks for top employees, while preserving a compact progress list beneath it.
  - Files: `frontend/src/components/dashboard/TeamLoad.tsx`.

- Timeline & Burndown chart
  - The dashboard includes a brushable area chart showing cumulative created/completed tasks and a burndown-like 'remaining' series.
  - Files: `frontend/src/components/dashboard/TimelineChart.tsx`.

- Empty States & Reduced CTA clutter
  - A reusable `EmptyState` component was added and used on empty task swimlanes and empty employee table views; in-column Add buttons in empty task cards have been removed to reduce visual noise.
  - Files: `frontend/src/components/common/EmptyState.tsx`, `frontend/src/components/tasks/TaskBoard.tsx`, `frontend/src/components/employees/EmployeesTable.tsx`.

- Dialog accessibility improvements
  - All major dialogs were updated with `aria-labelledby` and first-input `autoFocus` to give sensible focus and screen reader labels.
  - Files: `frontend/src/components/tasks/NewTaskDialog.tsx`, `frontend/src/components/tasks/EditTaskDialog.tsx`, `frontend/src/components/employees/NewEmployeeDialog.tsx`, `frontend/src/components/employees/EditEmployeeDialog.tsx`.

- Toast improvements
  - Toasts now dedupe identical message+type entries and support persistent messages (duration=0) that require manual dismissal.
  - File: `frontend/src/context/ToastContext.tsx`.

- Task Card polishing
  - `TaskCard` has improved drag affordance and hover elevation to better communicate interactivity on draggable cards.
  - File: `frontend/src/components/tasks/TaskCard.tsx`.

Developer notes
- Recharts has been added as a runtime dependency for frontend charts (`recharts` in `frontend/package.json`).
- The Timeline chart uses client-side aggregation from the `recentActivities` list. For long date ranges or large datasets, consider adding a dedicated server endpoint that returns aggregated time-series data.



