using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AMS_26967.Data;

namespace AMS_26967.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("details")]
    public async Task<IActionResult> Details()
    {
        var a = await db.Accounts.FindAsync(UserId);
        if (a is null) return NotFound();
        return Ok(new { a.Id, a.CardNumber, a.Name, a.AccountNumber, a.Balance, a.CreatedAt });
    }

    [HttpGet("lookup/{accountNumber}")]
    public async Task<IActionResult> Lookup(string accountNumber)
    {
        var a = await db.Accounts.FirstOrDefaultAsync(x => x.AccountNumber == accountNumber);
        if (a is null) return NotFound("Account not found.");
        if (a.Id == UserId) return BadRequest("Cannot transfer to yourself.");
        return Ok(new { a.CardNumber, a.Name, a.AccountNumber });
    }
}
