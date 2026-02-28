import { useState } from 'react';
import { addMedicine } from '../services/api';

const SLOTS = [
  'BEFORE_BREAKFAST','AFTER_BREAKFAST',
  'BEFORE_LUNCH','AFTER_LUNCH',
  'BEFORE_DINNER','AFTER_DINNER',
  'BEDTIME'
];

export default function AddMedicineModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    medicineName: '',
    slot: 'AFTER_BREAKFAST',
    time: '08:00',
    date: new Date().toISOString().split('T')[0],
    days: 7
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.medicineName) return setError('Medicine name is required');
    if (!form.time)         return setError('Time is required');
    if (!form.date)         return setError('Date is required');
    setError(''); setLoading(true);
    try {
      const res = await addMedicine({
        medicineName: form.medicineName,
        slot:         form.slot,
        time:         form.time,
        date:         form.date,
        days:         parseInt(form.days) || 1
      });
      onSaved(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save medicine.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">➕ Add Medicine</div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Medicine Name *</label>
            <input type="text" placeholder="e.g. Paracetamol" value={form.medicineName} onChange={set('medicineName')} />
          </div>
          <div className="field">
            <label>Slot (When to take)</label>
            <select value={form.slot} onChange={set('slot')}>
              {SLOTS.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
            </select>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div className="field">
              <label>Time *</label>
              <input type="time" value={form.time} onChange={set('time')} />
            </div>
            <div className="field">
              <label>Duration (days)</label>
              <input type="number" min="1" max="365" value={form.days} onChange={set('days')} />
            </div>
          </div>
          <div className="field">
            <label>Start Date *</label>
            <input type="date" value={form.date} onChange={set('date')} />
          </div>
          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button type="button" className="btn btn-secondary" style={{ flex:1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex:2 }} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Save Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
