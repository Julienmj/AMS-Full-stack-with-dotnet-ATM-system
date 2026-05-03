using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AMS_26967.Data;
using AMS_26967.DTOs;
using AMS_26967.Models;

namespace AMS_26967.Controllers;

[ApiController]
[Route("api/[controller]")]
[Tags("Admin — Account Management")]
public class AdminController(AppDbContext db) : ControllerBase
{
    [HttpGet("accounts")]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Accounts
            .Select(a => new { a.Id, a.CardNumber, a.Name, a.AccountNumber, a.Balance, a.IsBlocked })
            .ToListAsync());

    [HttpPost("accounts")]
    public async Task<IActionResult> Create(CreateAccountDTO dto)
    {
        if (await db.Accounts.AnyAsync(a => a.AccountNumber == dto.AccountNumber))
            return Conflict($"Account number '{dto.AccountNumber}' already exists.");
        var account = new Account
        {
            Name = dto.Name,
            AccountNumber = dto.AccountNumber,
            PinHash = BCrypt.Net.BCrypt.HashPassword(dto.Pin),
            Balance = dto.InitialBalance
        };
        db.Accounts.Add(account);
        await db.SaveChangesAsync();
        return Ok(new { account.Id, account.CardNumber, account.Name, account.AccountNumber, account.Balance });
    }

    [HttpGet("accounts/{id}/balance")]
    public async Task<IActionResult> BalanceById(int id)
    {
        var a = await db.Accounts.FindAsync(id);
        if (a is null) return NotFound($"Account {id} not found.");
        return Ok(new { a.Id, a.Name, a.AccountNumber, a.Balance });
    }

    [HttpGet("accounts/{id}/history")]
    public async Task<IActionResult> HistoryById(int id)
    {
        if (!await db.Accounts.AnyAsync(a => a.Id == id)) return NotFound($"Account {id} not found.");
        var txs = await db.Transactions
            .Where(t => t.AccountId == id)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new { t.Id, t.TransactionType, t.Status, t.Amount, t.Description, t.BalanceAfter, t.CreatedAt })
            .ToListAsync();
        return Ok(txs);
    }
}
