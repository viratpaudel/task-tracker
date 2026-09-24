import React, { useEffect, useMemo, useState } from 'react';

const categories = ['Personal', 'College', 'Work', 'Project', 'Health', 'Finance', 'Shopping', 'Travel', 'Home', 'Learning', 'Entertainment', 'Other'];
const priorityRank = { high: 3, medium: 2, low: 1 };

export default function TaskTracker() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('focus_tasks') || '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState('all');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('focus_dark') === 'true');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [focusTaskId, setFocusTaskId] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessions, setSessions] = useState(() => Number(localStorage.getItem('focus_sessions') || 0));

  useEffect(() => localStorage.setItem('focus_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('focus_dark', String(darkMode)), [darkMode]);
  useEffect(() => localStorage.setItem('focus_sessions', String(sessions)), [sessions]);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft(value => {
        if (value <= 1) {
          setTimerRunning(false);
          setSessions(count => count + 1);
          return 25 * 60;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning]);

  const today = new Date().toISOString().split('T')[0];
  const resetForm = () => {
    setInput(''); setNotes(''); setDueDate(''); setPriority('medium');
    setCategory('Personal'); setEditingTaskId(null);
  };

  const saveTask = () => {
    if (!input.trim()) return;
    if (editingTaskId !== null) {
      setTasks(current => current.map(task => task.id === editingTaskId
        ? { ...task, text: input.trim(), notes: notes.trim(), priority, category, dueDate }
        : task));
    } else {
      setTasks(current => [...current, {
        id: Date.now(), text: input.trim(), notes: notes.trim(), done: false,
        priority, category, dueDate, createdAt: new Date().toISOString()
      }]);
    }
    resetForm();
  };

  const editTask = task => {
    setEditingTaskId(task.id); setInput(task.text); setNotes(task.notes || '');
    setPriority(task.priority || 'medium'); setCategory(task.category || 'Personal');
    setDueDate(task.dueDate || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const toggleTask = id => setTasks(current => current.map(task => task.id === id ? { ...task, done: !task.done } : task));
  const deleteTask = id => {
    setTasks(current => current.filter(task => task.id !== id));
    if (editingTaskId === id) resetForm();
    if (String(focusTaskId) === String(id)) setFocusTaskId('');
  };

  const sortedTasks = useMemo(() => [...tasks].sort((a, b) => {
    if (sortBy === 'priority') return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
    if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sortBy === 'alphabetical') return a.text.localeCompare(b.text);
    if (sortBy === 'dueSoon') {
      if (!a.dueDate) return 1; if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  }), [tasks, sortBy]);

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortedTasks.filter(task => {
      const stateMatch = filter === 'all' || (filter === 'active' && !task.done) || (filter === 'done' && task.done);
      const textMatch = !query || [task.text, task.notes, task.category, task.priority].some(value => (value || '').toLowerCase().includes(query));
      return stateMatch && textMatch;
    });
  }, [sortedTasks, filter, search]);

  const total = tasks.length;
  const completed = tasks.filter(task => task.done).length;
  const active = total - completed;
  const dueToday = tasks.filter(task => task.dueDate === today && !task.done).length;
  const overdue = tasks.filter(task => task.dueDate && task.dueDate < today && !task.done).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const focusTask = tasks.find(task => String(task.id) === String(focusTaskId));
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const formatDate = date => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <style>{`
        *{box-sizing:border-box} body{margin:0;background:#f4f5f7;font-family:Inter,system-ui,sans-serif;color:#17181c}.app{max-width:820px;min-height:100vh;margin:auto;padding:32px 18px 52px}.dark{background:#121316;color:#f4f4f5}.dark .card,.dark .input,.dark input,.dark select,.dark textarea{background:#1d1e22;border-color:#303137;color:#f4f4f5}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px}.brand{display:flex;gap:13px;align-items:center}.logo{width:47px;height:47px;border-radius:14px;background:#17181c;color:white;display:grid;place-items:center;font-size:22px;font-weight:800}.dark .logo{background:#fff;color:#17181c}h1{margin:0;font-size:31px;letter-spacing:-1px}.muted{color:#858891;font-size:13px;margin:3px 0 0}.button,.theme{border:1px solid #e0e2e6;border-radius:10px;padding:9px 13px;background:#fff;cursor:pointer;font-weight:700;font-size:12px}.theme{font-size:13px}.dark .button,.dark .theme{background:#202126;border-color:#34353c;color:#eee}.stats{display:grid;grid-template-columns:repeat(6,1fr);gap:9px;margin-bottom:15px}.card,.input{background:#fff;border:1px solid #e2e4e8;border-radius:15px}.stat{padding:13px}.stat b{display:block;font-size:22px;margin-top:4px}.label{font-size:10px;text-transform:uppercase;letter-spacing:.7px;color:#858891;font-weight:800}.progress{padding:14px 16px;margin-bottom:15px}.progress-top{display:flex;justify-content:space-between;font-size:12px;color:#777b84;margin-bottom:8px}.bar{height:7px;background:#eceef1;border-radius:20px;overflow:hidden}.fill{height:100%;background:#17181c;border-radius:inherit}.dark .fill{background:#fff}.input{padding:12px;margin-bottom:14px}.main-input{width:100%;border:0!important;background:transparent!important;padding:7px 6px 12px!important;font-size:15px!important;outline:0}.notes{width:100%;min-height:55px;resize:vertical;border:1px solid #e1e3e7;border-radius:9px;padding:10px;font-size:12px;margin-bottom:9px}.controls,.toolbar,.filters,.task-head,.actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.select,.date,.search{border:1px solid #e1e3e7;border-radius:9px;padding:9px 10px;background:#f8f9fa;font-size:12px}.actions{margin-left:auto}.primary{background:#17181c;color:#fff}.dark .primary{background:#fff;color:#17181c}.toolbar{margin-bottom:10px}.search{flex:1;min-width:180px}.filters{margin-bottom:14px}.filters .button{flex:1}.active-filter{background:#17181c;color:#fff}.dark .active-filter{background:#fff;color:#17181c}.task-head{justify-content:space-between;margin-bottom:10px}.task-list{display:flex;flex-direction:column;gap:9px}.task{display:flex;align-items:flex-start;gap:10px;padding:13px 14px}.task.done{opacity:.55}.check{width:18px;height:18px;margin-top:2px;accent-color:#17181c}.task-body{flex:1;min-width:0}.task-text{font-size:13px;overflow-wrap:anywhere}.done .task-text{text-decoration:line-through}.note{font-size:11px;color:#73767e;white-space:pre-wrap;margin-top:7px;line-height:1.5}.meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}.tag{font-size:10px;padding:4px 7px;border-radius:6px;background:#f0f1f3;color:#666971;font-weight:700}.high{background:#fff0f0;color:#c43f3f}.low{background:#eef8f1;color:#3f8755}.overdue{color:#c43f3f}.icon{border:0;background:transparent;cursor:pointer;font-size:17px;color:#999;padding:3px}.focus{padding:16px;margin-bottom:15px}.focus-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.timer{font-size:34px;font-weight:800;letter-spacing:2px;margin:6px 0}.focus-controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.focus select{flex:1;min-width:180px}.empty{text-align:center;padding:48px 15px;color:#92959d}.clear{border:0;background:transparent;color:#d14b4b;cursor:pointer;font-weight:700;font-size:12px}@media(max-width:650px){.stats{grid-template-columns:repeat(3,1fr)}.header{gap:12px}.actions{width:100%;margin-left:0}.controls>*{flex:1}.task-head{align-items:flex-start}.app{padding:24px 13px 40px}}
      `}</style>

      <header className="header">
        <div className="brand"><div className="logo">✓</div><div><h1>Focus</h1><p className="muted">Simple tasks. Clear progress. Better focus.</p></div></div>
        <button className="theme" onClick={() => setDarkMode(value => !value)}>{darkMode ? '☀ Light' : '☾ Dark'}</button>
      </header>

      <div className="stats">
        {[['Total', total], ['Active', active], ['Done', completed], ['Due today', dueToday], ['Overdue', overdue], ['Sessions', sessions]].map(([label, value]) => <div className="card stat" key={label}><span className="label">{label}</span><b>{value}</b></div>)}
      </div>
      <div className="card progress"><div className="progress-top"><span>Overall progress</span><strong>{percent}%</strong></div><div className="bar"><div className="fill" style={{ width: `${percent}%` }} /></div></div>

      <section className="card focus">
        <div className="focus-title"><div><strong>Focus session</strong><div className="muted">A 25-minute sprint for one task</div></div><strong>{sessions} completed</strong></div>
        <div className="focus-controls"><select className="select" value={focusTaskId} onChange={event => setFocusTaskId(event.target.value)}><option value="">Choose a task (optional)</option>{tasks.filter(task => !task.done).map(task => <option key={task.id} value={task.id}>{task.text}</option>)}</select><span className="timer">{minutes}:{seconds}</span><button className="button primary" onClick={() => setTimerRunning(value => !value)}>{timerRunning ? 'Pause' : 'Start'}</button><button className="button" onClick={() => { setTimerRunning(false); setSecondsLeft(25 * 60); }}>Reset</button></div>
        {focusTask && <div className="muted" style={{ marginTop: 8 }}>Working on: {focusTask.text}</div>}
      </section>

      <section className="input">
        <input className="main-input" placeholder={editingTaskId !== null ? 'Edit task details...' : 'What needs to be done?'} value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => event.key === 'Enter' && saveTask()} />
        <textarea className="notes" placeholder="Add a quick note or context..." value={notes} onChange={event => setNotes(event.target.value)} />
        <div className="controls"><select className="select" value={priority} onChange={event => setPriority(event.target.value)}><option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option></select><select className="select" value={category} onChange={event => setCategory(event.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select><input className="date" type="date" min={today} value={dueDate} onChange={event => setDueDate(event.target.value)} /><div className="actions">{editingTaskId !== null && <button className="button" onClick={resetForm}>Cancel</button>}<button className="button primary" onClick={saveTask}>{editingTaskId !== null ? 'Save changes' : '+ Add task'}</button></div></div>
      </section>

      <div className="toolbar"><input className="search" type="search" placeholder="Search tasks, notes, categories or priorities..." value={search} onChange={event => setSearch(event.target.value)} /><select className="select" value={sortBy} onChange={event => setSortBy(event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="priority">Priority</option><option value="dueSoon">Due soon</option><option value="alphabetical">A–Z</option></select></div>
      <div className="filters">{['all', 'active', 'done'].map(item => <button key={item} className={`button ${filter === item ? 'active-filter' : ''}`} onClick={() => setFilter(item)}>{item === 'all' ? 'All' : item === 'active' ? 'Active' : 'Completed'}</button>)}</div>
      <div className="task-head"><span className="muted">{visibleTasks.length} task{visibleTasks.length === 1 ? '' : 's'}</span><div className="actions">{total > 0 && <button className="button" onClick={() => setTasks(current => current.map(task => ({ ...task, done: true })))}>Mark all done</button>}{completed > 0 && <button className="clear" onClick={() => setTasks(current => current.filter(task => !task.done))}>Clear completed</button>}</div></div>

      <div className="task-list">{visibleTasks.length === 0 ? <div className="empty">{search ? 'No tasks match your search' : filter === 'done' ? 'No completed tasks yet' : filter === 'active' ? 'You are all caught up' : 'Add your first task to get started'}</div> : visibleTasks.map(task => {
        const isOverdue = task.dueDate && task.dueDate < today && !task.done;
        return <div className={`card task ${task.done ? 'done' : ''}`} key={task.id}><input className="check" type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} aria-label={`Complete ${task.text}`} /><div className="task-body"><div className="task-text">{task.text}</div>{task.notes && <div className="note">{task.notes}</div>}<div className="meta"><span className={`tag ${task.priority === 'high' ? 'high' : task.priority === 'low' ? 'low' : ''}`}>{task.priority}</span><span className="tag">{task.category}</span>{task.dueDate && <span className={`tag ${isOverdue ? 'overdue' : ''}`}>{isOverdue ? 'Overdue · ' : 'Due · '}{formatDate(task.dueDate)}</span>}</div></div><div><button className="icon" onClick={() => editTask(task)} aria-label={`Edit ${task.text}`}>✎</button><button className="icon" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.text}`}>×</button></div></div>;
      })}</div>
    </div>
  );
}
