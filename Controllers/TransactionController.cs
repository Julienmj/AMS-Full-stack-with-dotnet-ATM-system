using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AMS_26967.Data;
using AMS_26967.DTOs;
using AMS_26967.Models;

namespace AMS_26967.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private async Task<Transaction> Record(int accountId, TransactionType type, decimal amount,
        string description, decimal balanceAfter, TransactionStatus status = TransactionStatus.Success, string? failedReason = null)
    {
        var tx = new Transaction
        {
            AccountId = accountId, TransactionType = type, Amount = amount,
            Description = description, BalanceAfter = balanceAfter,
            Status = status, FailedReason = failedReason
        };
        db.Transactions.Add(tx);
        await db.SaveChangesAsync();
        return tx;
    }

    [HttpPost("deposit")]
    public async Task<IActionResult> Deposit(DepositDTO dto)
    {
        if (dto.Amount <= 0) return BadRequest("Amount must be positive.");
        var account = await db.Accounts.FindAsync(UserId);
        if (account is null) return NotFound();
        account.Balance += dto.Amount;
        await db.SaveChangesAsync();
        var tx = await Record(account.Id, TransactionType.Deposit, dto.Amount, "Cash Deposit", account.Balance);
        return Ok(new { account.Balance, tx.Id, receipt = GenerateReceipt(tx, account) });
    }

    [HttpPost("withdraw")]
    public async Task<IActionResult> Withdraw(WithdrawDTO dto)
    {
        if (dto.Amount <= 0) return BadRequest("Amount must be positive.");
        var account = await db.Accounts.FindAsync(UserId);
        if (account is null) return NotFound();
        if (account.Balance < dto.Amount)
        {
            await Record(account.Id, TransactionType.Withdrawal, dto.Amount,
                "Cash Withdrawal", account.Balance, TransactionStatus.Failed, "Insufficient funds");
            return BadRequest(new { message = "Insufficient funds. Transaction declined." });
        }
        account.Balance -= dto.Amount;
        await db.SaveChangesAsync();
        var tx = await Record(account.Id, TransactionType.Withdrawal, dto.Amount, "Cash Withdrawal", account.Balance);
        return Ok(new { account.Balance, tx.Id, receipt = GenerateReceipt(tx, account) });
    }

    [HttpPost("transfer")]
    public async Task<IActionResult> Transfer(TransferDTO dto)
    {
        if (dto.Amount <= 0) return BadRequest("Amount must be positive.");
        var sender = await db.Accounts.FindAsync(UserId);
        if (sender is null) return NotFound();
        var receiver = await db.Accounts.FirstOrDefaultAsync(a => a.AccountNumber == dto.ReceiverAccountNumber);
        if (receiver is null)
        {
            await Record(sender.Id, TransactionType.Transfer, dto.Amount,
                "Transfer", sender.Balance, TransactionStatus.Failed, "Receiver account not found");
            return NotFound("Receiver account not found.");
        }
        if (receiver.Id == sender.Id) return BadRequest("Cannot transfer to yourself.");
        if (sender.Balance < dto.Amount)
        {
            await Record(sender.Id, TransactionType.Transfer, dto.Amount,
                "Transfer", sender.Balance, TransactionStatus.Failed, "Insufficient funds");
            return BadRequest(new { message = "Insufficient funds. Transaction declined." });
        }
        sender.Balance -= dto.Amount;
        receiver.Balance += dto.Amount;
        await db.SaveChangesAsync();
        var tx = await Record(sender.Id, TransactionType.Transfer, dto.Amount, $"Transfer to {receiver.AccountNumber}", sender.Balance);
        await Record(receiver.Id, TransactionType.Transfer, dto.Amount, $"Transfer from {sender.AccountNumber}", receiver.Balance);
        return Ok(new { sender.Balance, tx.Id, receipt = GenerateReceipt(tx, sender) });
    }

    private static object GenerateReceipt(Transaction tx, Account account) => new
    {
        ReceiptNo = $"RCP-{tx.Id:D6}",
        Date = tx.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
        AccountHolder = account.Name,
        AccountNumber = account.AccountNumber,
        TransactionType = tx.TransactionType.ToString(),
        Amount = tx.Amount,
        BalanceAfter = tx.BalanceAfter,
        Status = tx.Status.ToString()
    };
}
