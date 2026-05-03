using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AMS_26967.Data;
using AMS_26967.DTOs;
using AMS_26967.Helpers;

namespace AMS_26967.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, JwtHelper jwt) : ControllerBase
{
    [HttpPost("insert-card")]
    public async Task<IActionResult> InsertCard(InsertCardDTO dto)
    {
        var account = await db.Accounts.FirstOrDefaultAsync(a => a.AccountNumber == dto.AccountNumber);
        if (account is null) return Unauthorized("Invalid account number.");

        if (account.IsBlocked) return Unauthorized("Account is blocked. Please contact the bank.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Pin, account.PinHash))
        {
            account.FailedLoginAttempts++;
            if (account.FailedLoginAttempts >= 3) account.IsBlocked = true;
            await db.SaveChangesAsync();
            return Unauthorized(account.IsBlocked
                ? "Account blocked after 3 failed PIN attempts."
                : $"Invalid PIN. {3 - account.FailedLoginAttempts} attempt(s) remaining.");
        }

        account.FailedLoginAttempts = 0;
        await db.SaveChangesAsync();
        return Ok(new { token = jwt.GenerateToken(account), message = "Card accepted. Welcome!" });
    }
}
