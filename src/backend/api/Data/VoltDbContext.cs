using Microsoft.EntityFrameworkCore;
using Api.Data.Entities;

namespace Api.Data;

public sealed class VoltDbContext(DbContextOptions<VoltDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var user = modelBuilder.Entity<User>();
        user.ToTable("users");
        user.HasKey(item => item.Id);
        user.Property(item => item.Email).HasMaxLength(320).IsRequired();
        user.HasIndex(item => item.Email).IsUnique();
        user.Property(item => item.DisplayName).HasMaxLength(80).IsRequired();
        user.Property(item => item.PasswordHash).IsRequired();
        user.Property(item => item.CreatedAt).IsRequired();
    }
}
