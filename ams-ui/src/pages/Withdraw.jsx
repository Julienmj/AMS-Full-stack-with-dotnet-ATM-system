import { useState } from 'react';
import { withdraw } from '../api';
import Receipt from '../components/Receipt';

export default function Withdraw() {
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setReceipt(null);
    setLoading(true);
    try {
      const data = await withdraw({ amount: parseFloat(amount) });
      setReceipt(data.receipt);
      setAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Withdraw Cash</h2>
      <div className="card form-card">
        <form onSubmit={submit}>
          <label>Amount ($)</label>
          <input type="number" min="1" step="0.01" value={amount}
            onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Dispensing…' : 'Withdraw'}</button>
        </form>
      </div>
      {receipt && <Receipt data={receipt} />}
    </div>
  );
}
