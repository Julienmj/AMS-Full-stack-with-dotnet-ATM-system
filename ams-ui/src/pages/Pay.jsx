import { useState } from 'react';
import { pay } from '../api';

export default function Pay() {
  const [form, setForm] = useState({ amount: '', description: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    setLoading(true);
    try {
      const data = await pay({ amount: parseFloat(form.amount), description: form.description });
      setMsg(`Payment successful! New balance: ₱${data.balance.toFixed(2)}`);
      setForm({ amount: '', description: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Pay</h2>
      <div className="card form-card">
        <form onSubmit={submit}>
          <label>Amount (₱)</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="0.00"
            required
          />
          <label>Description</label>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g. Canteen, Books"
            required
          />
          {msg && <p className="success">{msg}</p>}
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Processing…' : 'Pay'}
          </button>
        </form>
      </div>
    </div>
  );
}
