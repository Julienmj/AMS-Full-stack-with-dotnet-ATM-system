namespace AMS_26967.Models;

public class Account
{
    public int Id { get; set; }
    public string CardNumber { get; set; } = Guid.NewGuid().ToString("N")[..8].ToUpper();
    public string Name { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string PinHash { get; set; } = string.Empty;
    public decimal Balance { get; set; } = 0;
    public int FailedLoginAttempts { get; set; } = 0;
    public bool IsBlocked { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Transaction> Transactions { get; set; } = [];
}
