import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMedicines, deleteMedicine } from '../services/api';
import AddMedicineModal from '../components/AddReminderModal';
import MedicineCard from '../components/ReminderCard';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const ICONS = ['💊','💉','🩺','🧪','🫁','🩹','🧬','🫀','🌡️','💆'];

const SLOTS = [
  'BEFORE_BREAKFAST','AFTER_BREAKFAST',
  'BEFORE_LUNCH','AFTER_LUNCH',
  'BEFORE_DINNER','AFTER_DINNER',
  'BEDTIME'
];

export default function Dashboard() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadMedicines = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMedicines();
      setMedicines(res.data || []);
    } catch {
      setError('Failed to load medicines. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMedicines(); }, [loadMedicines]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this medicine?')) return;
    try {
      await deleteMedicine(id);
      setMedicines(m => m.filter(x => x.id !== id));
    } catch {
      setError('Failed to delete.');
    }
  }

  function handleSaved(saved) {
    setMedicines(m => [...m, saved]);
    setShowModal(false);
  }

  // Next medicine by time today
  const nextMed = [...medicines]
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''))[0];

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dash-content">

        {/* Hero */}
        <div className="dash-hero fade-up">
          <div>
            <h1 className="dash-greeting">
              Good {getTimeOfDay()}, <span>{user?.name?.split(' ')[0] || 'there'}!</span>
            </h1>
            <p className="dash-subtitle">Here are your medicine reminders.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Medicine
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid fade-up">
          <StatCard color="accent"  value={medicines.length}              label="Total Medicines" icon="💊" />
          <StatCard color="purple"  value={nextMed?.time || '—'}          label="Next Dose"        icon="⏰" />
          <StatCard color="yellow"  value={nextMed?.slot?.replace(/_/g,' ') || '—'} label="Next Slot" icon="📅" />
          <StatCard color="danger"  value={[...new Set(medicines.map(m => m.date))].length || 0} label="Active Days" icon="📆" />
        </div>

        {/* Error */}
        {error && <div className="alert alert-error fade-up">{error}</div>}

        {/* List */}
        <div className="section-header fade-up">
          <h2 className="section-title">My Medicines</h2>
          <span className="badge badge-green">{medicines.length} total</span>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spinner" style={{ width:36, height:36, borderTopColor:'var(--accent)' }} />
            <p>Loading your medicines…</p>
          </div>
        ) : medicines.length === 0 ? (
          <div className="empty-state fade-up">
            <div className="empty-icon">💊</div>
            <h3>No medicines yet</h3>
            <p>Add your first medicine reminder to get started</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Add Your First Medicine
            </button>
          </div>
        ) : (
          <div className="reminders-list">
            {medicines.map((m, i) => (
              <MedicineCard
                key={m.id}
                reminder={m}
                icon={ICONS[i % ICONS.length]}
                onDelete={() => handleDelete(m.id)}
                onEdit={() => {}}
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddMedicineModal
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function StatCard({ color, value, label, icon }) {
  return (
    <div className={`stat-card stat-card--${color} fade-up`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-val">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
