import React, { useEffect, useMemo, useState } from 'react';

export default function TaskTracker() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('focus_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('focus_dark') === 'true');

  useEffect(() => {
    localStorage.setItem('focus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('focus_dark', String(darkMode));
  }, [darkMode]);

  const addTask = () => {
    if (!input.trim()) return;

    setTasks(prev => [
      ...prev,
      {
        id: Date.now(),
        text: input.trim(),
        done: false,
        priority,
        category,
        dueDate,
        createdAt: new Date().toISOString()
      }
    ]);

    setInput('');
    setDueDate('');
    setPriority('medium');
  };

  const toggleTask = id => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = id => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.done));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tasks.filter(task => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'done' && task.done) ||
        (filter === 'active' && !task.done);

      const matchesSearch =
        !q ||
        task.text.toLowerCase().includes(q) ||
        task.category.toLowerCase().includes(q) ||
        task.priority.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const active = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const highPriority = tasks.filter(t => !t.done && t.priority === 'high').length;

  const today = new Date().toISOString().split('T')[0];

  const formatDate = date => {
    if (!date) return 'No deadline';
    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #f4f5f7;
          font-family: 'DM Sans', sans-serif;
          color: #17181c;
          transition: background .3s ease;
        }

        button, input, select { font-family: inherit; }

        .app {
          min-height: 100vh;
          max-width: 760px;
          margin: 0 auto;
          padding: 34px 20px 50px;
          transition: color .3s ease;
        }

        .app.dark {
          color: #f4f4f5;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          animation: fadeInDown .55s ease-out;
        }

        .header-top {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .icon-badge {
          width: 48px;
          height: 48px;
          border-radius: 15px;
          background: #17181c;
          color: white;
          display: grid;
          place-items: center;
          font-size: 21px;
          font-weight: 700;
          box-shadow: 0 8px 22px rgba(0,0,0,.14);
        }

        .dark .icon-badge { background: white; color: #17181c; }

        h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 31px;
          letter-spacing: -1px;
          font-weight: 700;
        }

        .subtitle {
          font-size: 13px;
          color: #777b84;
          margin-top: 3px;
        }

        .dark .subtitle { color: #a1a1aa; }

        .theme-btn {
          border: 1px solid #e1e3e7;
          background: white;
          color: #3b3d43;
          border-radius: 11px;
          padding: 10px 13px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: .2s ease;
        }

        .theme-btn:hover { transform: translateY(-2px); }

        .dark .theme-btn {
          background: #202126;
          border-color: #34353c;
          color: #eee;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e4e5e8;
          border-radius: 15px;
          padding: 15px;
          transition: .25s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,.06);
        }

        .dark .stat-card {
          background: #1d1e22;
          border-color: #303137;
        }

        .stat-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .7px;
          color: #858891;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .stat-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 23px;
          font-weight: 700;
        }

        .progress-wrap {
          background: white;
          border: 1px solid #e4e5e8;
          border-radius: 15px;
          padding: 14px 16px;
          margin-bottom: 18px;
        }

        .dark .progress-wrap {
          background: #1d1e22;
          border-color: #303137;
        }

        .progress-top {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #777b84;
          margin-bottom: 9px;
        }

        .progress-bar {
          height: 7px;
          border-radius: 99px;
          background: #eceef1;
          overflow: hidden;
        }

        .dark .progress-bar { background: #303137; }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #17181c;
          transition: width .4s ease;
        }

        .dark .progress-fill { background: white; }

        .input-section {
          background: white;
          border: 1px solid #e4e5e8;
          border-radius: 17px;
          padding: 12px;
          margin-bottom: 14px;
        }

        .dark .input-section {
          background: #1d1e22;
          border-color: #303137;
        }

        .main-input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          padding: 8px 8px 12px;
          font-size: 15px;
          color: inherit;
        }

        .main-input::placeholder { color: #a3a5ac; }

        .input-tools {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .select, .date-input {
          border: 1px solid #e1e3e7;
          background: #f8f9fa;
          border-radius: 9px;
          padding: 8px 10px;
          font-size: 12px;
          color: #44464d;
          outline: none;
        }

        .dark .select, .dark .date-input {
          background: #27282d;
          border-color: #393a41;
          color: #eee;
        }

        .add-btn {
          margin-left: auto;
          border: none;
          background: #17181c;
          color: white;
          border-radius: 10px;
          padding: 9px 17px;
          cursor: pointer;
          font-weight: 700;
          font-size: 12px;
          transition: .2s ease;
        }

        .add-btn:hover { transform: translateY(-2px); }

        .dark .add-btn { background: white; color: #17181c; }

        .search {
          width: 100%;
          border: 1px solid #e1e3e7;
          border-radius: 11px;
          padding: 11px 13px;
          background: white;
          color: #17181c;
          outline: none;
          margin-bottom: 12px;
          font-size: 13px;
        }

        .dark .search {
          background: #1d1e22;
          border-color: #303137;
          color: white;
        }

        .filters {
          display: flex;
          gap: 7px;
          margin-bottom: 15px;
        }

        .filter-btn {
          flex: 1;
          padding: 9px;
          border: 1px solid #e1e3e7;
          border-radius: 10px;
          background: white;
          color: #6d7078;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: .2s ease;
        }

        .filter-btn.active {
          background: #17181c;
          color: white;
          border-color: #17181c;
        }

        .dark .filter-btn {
          background: #1d1e22;
          border-color: #303137;
          color: #a7a7ae;
        }

        .dark .filter-btn.active {
          background: white;
          color: #17181c;
          border-color: white;
        }

        .task-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .result-count {
          font-size: 12px;
          color: #8a8d95;
        }

        .clear-btn {
          border: none;
          background: transparent;
          color: #d14b4b;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .tasks-container {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .task-item {
          background: white;
          border: 1px solid #e4e5e8;
          border-radius: 14px;
          padding: 13px 14px;
          display: flex;
          align-items: center;
          gap: 11px;
          transition: .22s ease;
          animation: slideIn .3s ease-out both;
        }

        .task-item:hover {
          transform: translateX(2px);
          box-shadow: 0 7px 20px rgba(0,0,0,.05);
        }

        .dark .task-item {
          background: #1d1e22;
          border-color: #303137;
        }

        .task-item.done {
          opacity: .58;
        }

        .checkbox {
          width: 18px;
          height: 18px;
          accent-color: #17181c;
          cursor: pointer;
          flex-shrink: 0;
        }

        .task-content { flex: 1; min-width: 0; }

        .task-text {
          font-size: 13px;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .task-item.done .task-text { text-decoration: line-through; }

        .task-meta {
          display: flex;
          gap: 6px;
          margin-top: 6px;
          flex-wrap: wrap;
        }

        .tag {
          font-size: 10px;
          padding: 4px 7px;
          border-radius: 6px;
          background: #f0f1f3;
          color: #666971;
          font-weight: 700;
        }

        .dark .tag { background: #292a30; color: #aaa; }

        .priority-high { background: #fff0f0; color: #c43f3f; }
        .priority-low { background: #eef8f1; color: #3f8755; }

        .dark .priority-high { background: #3a2424; color: #ef7777; }
        .dark .priority-low { background: #223328; color: #7bc08e; }

        .overdue { color: #c43f3f; }

        .delete-btn {
          border: none;
          background: transparent;
          color: #a2a4aa;
          cursor: pointer;
          font-size: 17px;
          padding: 5px;
          opacity: 0;
          transition: .2s ease;
        }

        .task-item:hover .delete-btn { opacity: 1; }
        .delete-btn:hover { color: #d14b4b; }

        .empty-state {
          text-align: center;
          padding: 50px 20px;
          color: #92959d;
        }

        .empty-icon {
          font-size: 34px;
          margin-bottom: 9px;
        }

        .empty-text { font-size: 13px; }

        @media (max-width: 600px) {
          .app { padding: 25px 14px 40px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .input-tools { align-items: stretch; }
          .add-btn { width: 100%; margin-left: 0; }
          .select, .date-input { flex: 1; }
          .header { margin-bottom: 22px; }
          .delete-btn { opacity: 1; }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(7px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className="header">
        <div className="header-top">
          <div className="icon-badge">✓</div>
          <div>
            <h1>Focus</h1>
            <p className="subtitle">Simple tasks. Clear progress. Better focus.</p>
          </div>
        </div>

        <button className="theme-btn" onClick={() => setDarkMode(v => !v)}>
          {darkMode ? '☀ Light' : '☾ Dark'}
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active</div>
          <div className="stat-value">{active}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Done</div>
          <div className="stat-value">{completed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">High priority</div>
          <div className="stat-value">{highPriority}</div>
        </div>
      </div>

      <div className="progress-wrap">
        <div className="progress-top">
          <span>Overall progress</span>
          <strong>{percent}%</strong>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <section className="input-section">
        <input
          className="main-input"
          type="text"
          placeholder="What needs to be done?"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
        />

        <div className="input-tools">
          <select className="select" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>

          <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
            <option>Personal</option>
            <option>College</option>
            <option>Work</option>
            <option>Project</option>
            <option>Other</option>
          </select>

          <input
            className="date-input"
            type="date"
            min={today}
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />

          <button className="add-btn" onClick={addTask}>+ Add task</button>
        </div>
      </section>

      <input
        className="search"
        type="search"
        placeholder="Search tasks, categories or priorities..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="filters">
        {['all', 'active', 'done'].map(item => (
          <button
            key={item}
            className={`filter-btn ${filter === item ? 'active' : ''}`}
            onClick={() => setFilter(item)}
          >
            {item === 'all' ? 'All' : item === 'active' ? 'Active' : 'Completed'}
          </button>
        ))}
      </div>

      <div className="task-toolbar">
        <span className="result-count">{filtered.length} task{filtered.length === 1 ? '' : 's'}</span>
        {completed > 0 && (
          <button className="clear-btn" onClick={clearCompleted}>Clear completed</button>
        )}
      </div>

      <div className="tasks-container">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{search ? '⌕' : filter === 'done' ? '✓' : '✦'}</div>
            <div className="empty-text">
              {search
                ? 'No tasks match your search'
                : filter === 'done'
                  ? 'No completed tasks yet'
                  : filter === 'active'
                    ? 'You are all caught up'
                    : 'Add your first task to get started'}
            </div>
          </div>
        ) : (
          filtered.map((task, idx) => {
            const isOverdue = task.dueDate && task.dueDate < today && !task.done;

            return (
              <div
                key={task.id}
                className={`task-item ${task.done ? 'done' : ''}`}
                style={{ animationDelay: `${idx * 0.035}s` }}
              >
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  aria-label={`Complete ${task.text}`}
                />

                <div className="task-content">
                  <div className="task-text">{task.text}</div>
                  <div className="task-meta">
                    <span className={`tag ${task.priority === 'high' ? 'priority-high' : task.priority === 'low' ? 'priority-low' : ''}`}>
                      {task.priority}
                    </span>
                    <span className="tag">{task.category}</span>
                    {task.dueDate && (
                      <span className={`tag ${isOverdue ? 'overdue' : ''}`}>
                        {isOverdue ? 'Overdue · ' : 'Due · '}{formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.text}`}
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
