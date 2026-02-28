import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <nav className="navbar">
      <div className="nav-logo">💊 MedAlert</div>
      <div className="nav-right">
        <div className="nav-user">
          <div className="nav-avatar">{initials}</div>
          <div className="nav-info">
            <div className="nav-name">{user?.name || 'User'}</div>
            <div className="nav-email">{user?.email || ''}</div>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
