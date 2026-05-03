namespace AMS_26967.Models;

public enum TransactionType { Deposit, Withdrawal, Transfer }
public enum TransactionStatus { Success, Failed }

public class Transaction
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public TransactionType TransactionType { get; set; }
    public TransactionStatus Status { get; set; } = TransactionStatus.Success;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? FailedReason { get; set; }
    public decimal BalanceAfter { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Account Account { get; set; } = null!;
}
