using Microsoft.EntityFrameworkCore;
using keystroke_backend_over_asp.Models;

namespace keystroke_backend_over_asp.Models
{
    public class KeystrokeDBContext : DbContext
    {
        public KeystrokeDBContext(DbContextOptions<KeystrokeDBContext> options) : base(options) 
        { }

        public DbSet<Account> Accounts { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(e => e.Accounts)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserID)
                .IsRequired();

            modelBuilder.Entity<Account>()
                .HasOne(e => e.User)
                .WithMany(e => e.Accounts)
                .HasForeignKey(e => e.UserID)
                .IsRequired();

            modelBuilder.Entity<User>().Navigation(e => e.Accounts).AutoInclude();
        }
    }
}
