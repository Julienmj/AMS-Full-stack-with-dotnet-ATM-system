import { useState } from 'react';
import { lookupAccount, transfer } from '../api';
import Receipt from '../components/Receipt';

export default function Transfer() {
  const [accountNumber, setAccountNumber] = useState('');
  const [receiver, setReceiver] = useState(null);
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const lookup = async (e) => {
    e.preventDefault();
    setError(''); setReceiver(null); setReceipt(null);
    setLoading(true);
    try {
      const data = await lookupAccount(accountNumber);
      setReceiver(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setReceipt(null);
    setLoading(true);
    try {
      const data = await transfer({ receiverAccountNumber: receiver.accountNumber, amount: parseFloat(amount) });
      setReceipt(data.receipt);
      setAmount(''); setReceiver(null); setAccountNumber('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Transfer Funds</h2>
      <div className="card form-card">
        <form onSubmit={lookup}>
          <label>Receiver Account Number</label>
          <input value={accountNumber}
            onChange={(e) => { setAccountNumber(e.target.value); setReceiver(null); }}
            placeholder="Enter account number" required />
          <button type="submit" disabled={loading}>{loading ? 'Searching…' : 'Verify Account'}</button>
        </form>

        {receiver && (
          <form onSubmit={submit} style={{ marginTop: '1.25rem', borderTop: '1px solid #eee', paddingTop: '1.25rem' }}>
            <div className="receiver-info">
              <span>Sending to:</span>
              <strong>{receiver.name}</strong>
              <span className="mono">{receiver.accountNumber}</span>
            </div>
            <label>Amount ($)</label>
            <input type="number" min="1" step="0.01" value={amount}
              onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
            <button type="submit" disabled={loading}>{loading ? 'Processing…' : 'Confirm Transfer'}</button>
          </form>
        )}
        {error && <p className="error">{error}</p>}
      </div>
      {receipt && <Receipt data={receipt} />}
    </div>
  );
}
