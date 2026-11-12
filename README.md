# Focus: Task Tracker

A clean, single-file React task manager with a built-in Pomodoro-style focus timer. Simple tasks, clear progress, better focus.

All data is stored in your browser's `localStorage`, so there is no backend, no account and no setup beyond React.

## Features

**Task management**
- Add, edit, complete and delete tasks
- Optional notes for extra context on each task
- Three priority levels: low, medium, high
- 12 categories: Personal, College, Work, Project, Health, Finance, Shopping, Travel, Home, Learning, Entertainment, Other
- Due dates, with automatic "Overdue" highlighting
- Bulk actions: **Mark all done** and **Clear completed**

**Finding things**
- Live search across task text, notes, category and priority
- Filter by All / Active / Completed
- Sort by newest, oldest, priority, due soon, or A–Z

**Focus session**
- 25-minute focus timer with start, pause and reset
- Optionally pick the task you're working on
- Completed sessions are counted and saved

**Dashboard**
- Stats for total, active, done, due today, overdue and sessions
- Overall progress bar showing percent complete

**Everything else**
- Light and dark mode, remembered between visits
- Responsive layout that works on mobile
- Styles are bundled inside the component, so there are no CSS files to manage

## Tech stack

- React (hooks: `useState`, `useEffect`, `useMemo`)
- Plain CSS, injected from within the component
- Browser `localStorage` for persistence

## Getting started

The repo contains a single component, `TaskTracker_Enhanced.jsx`, so you'll drop it into a React project.

1. Create a React app (Vite shown here):

   ```bash
   npm create vite@latest focus-app -- --template react
   cd focus-app
   npm install
   ```

2. Copy `TaskTracker_Enhanced.jsx` into `src/`.

3. Render it in `src/App.jsx`:

   ```jsx
   import TaskTracker from './TaskTracker_Enhanced';

   export default function App() {
     return <TaskTracker />;
   }
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

## Data and storage

The app saves four keys in `localStorage`:

| Key              | Contents                     |
| ---------------- | ---------------------------- |
| `focus_tasks`    | Your full task list (JSON)   |
| `focus_dark`     | Dark mode on or off          |
| `focus_sessions` | Completed focus session count |

Clearing your browser data will erase your tasks. Data is not synced between browsers or devices.

## Task shape

```js
{
  id: 1731400000000,
  text: "Finish assignment",
  notes: "Chapter 4 onwards",
  done: false,
  priority: "high",        // low | medium | high
  category: "College",
  dueDate: "2026-11-20",   // optional, YYYY-MM-DD
  createdAt: "2026-11-12T09:00:00.000Z"
}
```

## Customising

- **Categories:** edit the `categories` array at the top of the file.
- **Timer length:** change `25 * 60` (it appears in the initial state, the reset handler and the timer rollover).
- **Look and feel:** all styles live in the `<style>` block inside the component.

## Roadmap ideas

- Export and import tasks as JSON
- Recurring tasks
- Break timers between focus sessions
- Cloud sync

## License

Add a license of your choice (MIT is a common default for personal projects).
