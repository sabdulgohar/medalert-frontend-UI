import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [form, setForm]   = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username || !form.password) return setError('Please fill in all fields');
    setError(''); setLoading(true);
    try {
      const res = await login({ username: form.username, password: form.password });
      // Backend returns plain JWT string directly
      const token = typeof res.data === 'string' ? res.data : res.data.token;
      const user  = { name: form.username, email: form.username };
      saveSession(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-glow auth-glow-1" />
      <div className="auth-glow auth-glow-2" />

      <div className="auth-box fade-up">
        <div className="auth-logo">💊 MedAlert</div>
        <p className="auth-tagline">Your personal medicine companion</p>

        <div className="auth-tabs">
          <Link to="/login"    className="auth-tab auth-tab--active">Sign In</Link>
          <Link to="/register" className="auth-tab">Register</Link>
        </div>

        {error && <div className="alert alert-error">{typeof error === 'string' ? error : 'Login failed'}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input type="text" placeholder="your username" value={form.username} onChange={set('username')} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
