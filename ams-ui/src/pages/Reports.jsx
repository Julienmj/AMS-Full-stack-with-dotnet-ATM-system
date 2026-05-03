import { useEffect, useState } from 'react';
import { getTotals, getHistory } from '../api';

const typeColor = { Deposit: 'green', Withdrawal: 'red', Transfer: 'blue' };
const statusColor = { Success: 'green', Failed: 'red' };

export default function Reports() {
  const [totals, setTotals] = useState(null);
  const [failed, setFailed] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getTotals(), getHistory()])
      .then(([t, h]) => {
        setTotals(t);
        setFailed(h.filter(tx => tx.status === 'Failed'));
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!totals) return <p className="loading">Loading…</p>;

  return (
    <div>
      <h2>Reports</h2>

      <div className="stats-grid">
        <div className="stat-card green">
          <span className="stat-label">Total Deposits</span>
          <span className="stat-value">${(totals.totalDeposits ?? 0).toFixed(2)}</span>
        </div>
        <div className="stat-card red">
          <span className="stat-label">Total Withdrawals</span>
          <span className="stat-value">${(totals.totalWithdrawals ?? 0).toFixed(2)}</span>
        </div>
        <div className="stat-card blue">
          <span className="stat-label">Total Transfers</span>
          <span className="stat-value">${(totals.totalTransfers ?? 0).toFixed(2)}</span>
        </div>
        <div className="stat-card red">
          <span className="stat-label">Failed Attempts</span>
          <span className="stat-value">{totals.failedAttempts ?? 0}</span>
        </div>
      </div>

      <h3>Failed Transactions</h3>
      {failed.length === 0 ? <p className="empty">No failed transactions.</p> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Type</th><th>Amount</th><th>Reason</th><th>Date</th></tr>
            </thead>
            <tbody>
              {failed.map((f) => (
                <tr key={f.id}>
                  <td><span className={`badge badge-${typeColor[f.transactionType]}`}>{f.transactionType}</span></td>
                  <td>${f.amount.toFixed(2)}</td>
                  <td>{f.failedReason || '—'}</td>
                  <td>{new Date(f.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
