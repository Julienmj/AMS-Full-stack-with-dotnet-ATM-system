import { useEffect, useState } from 'react';
import { getDetails } from '../api';

export default function Dashboard() {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDetails().then(setAccount).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!account) return <p className="loading">Loading…</p>;

  return (
    <div>
      <h2>Account Overview</h2>
      <div className="stats-grid">
        <div className="stat-card green">
          <span className="stat-label">Available Balance</span>
          <span className="stat-value">${account.balance.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Card Number</span>
          <span className="stat-value mono">{account.cardNumber}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Account Holder</span>
          <span className="stat-value">{account.name}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Account Number</span>
          <span className="stat-value">{account.accountNumber}</span>
        </div>
      </div>
    </div>
  );
}
