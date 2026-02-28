import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [form, setForm]   = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return setError('Please fill in all fields');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setError(''); setLoading(true);
    try {
      // Step 1: Register
      await register({ username: form.username, email: form.email, password: form.password });
      // Step 2: Auto-login after register
      const res = await login({ username: form.username, password: form.password });
      const token = typeof res.data === 'string' ? res.data : res.data.token;
      const user  = { name: form.username, email: form.email };
      saveSession(user, token);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data || err.response?.data?.message || '';
      setError(typeof msg === 'string' && msg ? msg : 'Registration failed. Username or email may already exist.');
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
        <p className="auth-tagline">Create your free account</p>

        <div className="auth-tabs">
          <Link to="/login"    className="auth-tab">Sign In</Link>
          <Link to="/register" className="auth-tab auth-tab--active">Register</Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input type="text" placeholder="abdulgohar" value={form.username} onChange={set('username')} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
