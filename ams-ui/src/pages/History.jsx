import { useEffect, useState } from 'react';
import { getHistory } from '../api';

const typeColor = { Deposit: 'green', Withdrawal: 'red', Transfer: 'blue' };
const statusColor = { Success: 'green', Failed: 'red' };

export default function History() {
  const [txs, setTxs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getHistory().then(setTxs).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Transaction History</h2>
      {txs.length === 0 ? (
        <p className="empty">No transactions yet.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Status</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((t) => (
                <tr key={t.id}>
                  <td><span className={`badge badge-${typeColor[t.transactionType]}`}>{t.transactionType}</span></td>
                  <td><span className={`badge badge-${statusColor[t.status]}`}>{t.status}</span></td>
                  <td>{t.description}{t.failedReason && <span className="failed-reason"> — {t.failedReason}</span>}</td>
                  <td className={`amount ${typeColor[t.transactionType]}`}>${t.amount.toFixed(2)}</td>
                  <td>${t.balanceAfter.toFixed(2)}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
