using Microsoft.EntityFrameworkCore;
using AMS_26967.Models;

namespace AMS_26967.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
}
