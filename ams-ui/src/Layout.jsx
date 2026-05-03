import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/deposit', label: 'Deposit' },
  { to: '/withdraw', label: 'Withdraw' },
  { to: '/transfer', label: 'Transfer' },
  { to: '/history', label: 'Transaction History' },
  { to: '/reports', label: 'Reports' },
];

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">AMS_26967</div>
        <div className="sidebar-sub">ATM Management System</div>
        <nav>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Eject Card / Logout</button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
