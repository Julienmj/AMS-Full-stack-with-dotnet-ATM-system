import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { insertCard } from '../api';
import { useAuth } from '../AuthContext';

export default function Login() {
  const { saveToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ accountNumber: '', pin: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await insertCard(form);
      saveToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card">
        <div className="atm-header">
          <h2>AMS_26967</h2>
          <p className="atm-title">ATM Management System</p>
        </div>
        <p className="subtitle">Insert Card — Enter Account Number & PIN</p>
        <form onSubmit={submit}>
          <label>Account Number</label>
          <input
            value={form.accountNumber}
            onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
            placeholder="Enter account number"
            required
          />
          <label>PIN</label>
          <input
            type="password"
            value={form.pin}
            onChange={(e) => setForm({ ...form, pin: e.target.value })}
            placeholder="Enter PIN"
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Insert Card'}
          </button>
        </form>
      </div>
    </div>
  );
}
