const BASE = 'http://localhost:5236/api';

const headers = (auth = false) => ({
  'Content-Type': 'application/json',
  ...(auth && { Authorization: `Bearer ${localStorage.getItem('token')}` }),
});

const handle = async (res) => {
  if (!res.ok) {
    let msg;
    try { const d = await res.json(); msg = d?.message || JSON.stringify(d); }
    catch { msg = res.statusText; }
    throw new Error(msg);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const insertCard = (data) =>
  fetch(`${BASE}/auth/insert-card`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handle);

export const getDetails = () =>
  fetch(`${BASE}/account/details`, { headers: headers(true) }).then(handle);

export const getBalance = () =>
  fetch(`${BASE}/account/balance`, { headers: headers(true) }).then(handle);

export const lookupAccount = (accountNumber) =>
  fetch(`${BASE}/account/lookup/${accountNumber}`, { headers: headers(true) }).then(handle);

export const deposit = (data) =>
  fetch(`${BASE}/transaction/deposit`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handle);

export const withdraw = (data) =>
  fetch(`${BASE}/transaction/withdraw`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handle);

export const transfer = (data) =>
  fetch(`${BASE}/transaction/transfer`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handle);

export const getReceipt = (id) =>
  fetch(`${BASE}/transaction/receipt/${id}`, { headers: headers(true) }).then(handle);

export const getHistory = () =>
  fetch(`${BASE}/report/history`, { headers: headers(true) }).then(handle);

export const getDailySummary = () =>
  fetch(`${BASE}/report/daily-summary`, { headers: headers(true) }).then(handle);

export const getTotals = () =>
  fetch(`${BASE}/report/totals`, { headers: headers(true) }).then(handle);

export const getFailedTransactions = () =>
  fetch(`${BASE}/report/failed`, { headers: headers(true) }).then(handle);
