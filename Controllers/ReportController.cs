using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AMS_26967.Data;
using AMS_26967.Models;

namespace AMS_26967.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("history")]
    public async Task<IActionResult> History() =>
        Ok(await db.Transactions
            .Where(t => t.AccountId == UserId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new { t.Id, t.TransactionType, t.Status, t.Amount, t.Description, t.FailedReason, t.BalanceAfter, t.CreatedAt })
            .ToListAsync());

    [HttpGet("totals")]
    public async Task<IActionResult> Totals()
    {
        var txs = await db.Transactions.Where(t => t.AccountId == UserId).ToListAsync();
        return Ok(new
        {
            TotalDeposits = txs.Where(t => t.TransactionType == TransactionType.Deposit && t.Status == TransactionStatus.Success).Sum(t => t.Amount),
            TotalWithdrawals = txs.Where(t => t.TransactionType == TransactionType.Withdrawal && t.Status == TransactionStatus.Success).Sum(t => t.Amount),
            TotalTransfers = txs.Where(t => t.TransactionType == TransactionType.Transfer && t.Status == TransactionStatus.Success).Sum(t => t.Amount),
            FailedAttempts = txs.Count(t => t.Status == TransactionStatus.Failed)
        });
    }
}
