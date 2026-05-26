using ContactBook.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ContactBook.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Contact> Contacts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Contact>().HasData(
                new Contact { Id = 1, Name = "Алексей Петров", MobilePhone = "+375291234567", JobTitle = "Backend Developer", BirthDate = new DateOnly(1990, 3, 15) },
                new Contact { Id = 2, Name = "Мария Иванова", MobilePhone = "+375339876543", JobTitle = "UI/UX Designer", BirthDate = new DateOnly(1995, 7, 22) },
                new Contact { Id = 3, Name = "Дмитрий Сидоров", MobilePhone = "+375445551234", JobTitle = "Frontend Developer", BirthDate = new DateOnly(1988, 11, 5) }
            );
        }
    }
}
