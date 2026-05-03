export default function Receipt({ data }) {
  return (
    <div className="receipt">
      <div className="receipt-header">
        <strong>AMS_26967 — Transaction Receipt</strong>
      </div>
      <div className="receipt-row"><span>Receipt No.</span><span>{data.receiptNo}</span></div>
      <div className="receipt-row"><span>Date</span><span>{data.date}</span></div>
      <div className="receipt-row"><span>Account Holder</span><span>{data.accountHolder}</span></div>
      <div className="receipt-row"><span>Account Number</span><span>{data.accountNumber}</span></div>
      <div className="receipt-row"><span>Transaction</span><span>{data.transactionType}</span></div>
      <div className="receipt-row"><span>Description</span><span>{data.description}</span></div>
      <div className="receipt-divider" />
      <div className="receipt-row"><span>Amount</span><strong>${data.amount.toFixed(2)}</strong></div>
      <div className="receipt-row"><span>Balance After</span><strong>${data.balanceAfter.toFixed(2)}</strong></div>
      <div className={`receipt-status ${data.status === 'Success' ? 'success' : 'error'}`}>
        {data.status === 'Success' ? 'Transaction Approved' : 'Transaction Declined'}
      </div>
    </div>
  );
}
