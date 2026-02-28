import './ReminderCard.css';

export default function MedicineCard({ reminder, icon, onDelete, style }) {
  const name = reminder.medicineName || 'Medicine';
  const slot = reminder.slot?.replace(/_/g, ' ') || '';
  const time = reminder.time || '';
  const date = reminder.date || '';
  const days = reminder.days || '';

  return (
    <div className="reminder-card fade-up" style={style}>
      <div className="rc-icon">{icon}</div>
      <div className="rc-info">
        <div className="rc-name">{name}</div>
        <div className="rc-badges">
          {slot && <span className="badge badge-purple">{slot}</span>}
          {days && <span className="badge badge-green">{days} days</span>}
          {date && <span className="badge badge-yellow">From {date}</span>}
        </div>
      </div>
      <div className="rc-right">
        <div className="rc-time">{time || '—'}</div>
        <div className="rc-actions">
          <button className="btn-icon" onClick={onDelete} title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  );
}
