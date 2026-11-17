import { useMemo, useState } from 'react';

const statusFor = (expiry) => {
  const diff = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);
  if (diff < 0) return 'Expired';
  if (diff <= 3) return 'Expiring soon';
  return 'Safe';
};

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Milk', quantity: 2, expiry: '2026-11-18', category: 'Dairy' },
    { id: 2, name: 'Bread', quantity: 1, expiry: '2026-11-22', category: 'Bakery' },
    { id: 3, name: 'Rice', quantity: 1, expiry: '2026-12-05', category: 'Staples' },
  ]);
  const [form, setForm] = useState({ name: '', quantity: 1, expiry: '', category: 'Groceries' });
  const [planner, setPlanner] = useState({ Monday: ['Oats', 'Dal'], Tuesday: ['Egg toast', 'Salad'], Wednesday: ['Rice bowl', 'Soup'], Thursday: ['Paratha', 'Salad'], Friday: ['Pasta', 'Fruit'], Saturday: ['Sandwich', 'Soup'], Sunday: ['Poha', 'Curry'] });
  const [meal, setMeal] = useState({ day: 'Monday', name: '' });

  const shoppingList = useMemo(() => items
    .filter((item) => item.quantity <= 2 || statusFor(item.expiry) !== 'Safe')
    .map((item) => `${item.name} x${item.quantity}`), [items]);

  const addItem = () => {
    if (!form.name || !form.expiry) return;
    setItems((current) => [...current, { id: Date.now(), name: form.name, quantity: Number(form.quantity), expiry: form.expiry, category: form.category }]);
    setForm({ name: '', quantity: 1, expiry: '', category: 'Groceries' });
  };

  const addMeal = () => {
    if (!meal.name) return;
    setPlanner((current) => ({ ...current, [meal.day]: [...(current[meal.day] || []), meal.name] }));
    setMeal({ day: 'Monday', name: '' });
  };

  return (
    <div className="app-shell">
      <div className="panel hero-panel">
        <div>
          <p className="eyebrow">Reduce kitchen waste</p>
          <h1>Smart Pantry Planner</h1>
        </div>
      </div>

      <div className="panel">
        <h2>Add pantry item</h2>
        <div className="form-grid three-columns">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Item name" />
          <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Qty" />
          <input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="full-width" />
        </div>
        <button className="primary" onClick={addItem}>Add</button>
      </div>

      <div className="panel">
        <h2>Expiry watch</h2>
        {items.map((item) => (
          <div key={item.id} className="transaction-row">
            <span>{item.name}</span>
            <span>{item.category}</span>
            <strong>{statusFor(item.expiry)}</strong>
            <small>{item.expiry}</small>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>Shopping list</h2>
        {shoppingList.length ? shoppingList.map((item) => <div key={item} className="tag-item">{item}</div>) : <p className="muted">Pantry looks healthy.</p>}
      </div>

      <div className="panel full-span">
        <h2>Weekly meal plan</h2>
        <div className="meal-add-row">
          <select value={meal.day} onChange={(e) => setMeal({ ...meal, day: e.target.value })}>
            {Object.keys(planner).map((day) => <option key={day} value={day}>{day}</option>)}
          </select>
          <input value={meal.name} onChange={(e) => setMeal({ ...meal, name: e.target.value })} placeholder="Meal idea" />
          <button onClick={addMeal}>Add</button>
        </div>
        {Object.entries(planner).map(([day, meals]) => (
          <div key={day} className="meal-row">
            <strong>{day}</strong>
            <span>{meals.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
