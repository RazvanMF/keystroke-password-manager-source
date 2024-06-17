using keystroke_backend_over_asp.Hubs;
using keystroke_backend_over_asp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting.Internal;
using Microsoft.Extensions.Options;

namespace keystroke_backend_over_asp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddSignalR();
            //builder.Services.AddDbContext<KeystrokeDBContext>(opt => opt.UseInMemoryDatabase("KeystrokeDB"));
            //builder.Services.AddDbContext<KeystrokeDBContext>(opt => opt.UseSqlServer("Data Source=DESKTOP-MAIN;Initial Catalog=keystroke;Integrated Security=true;TrustServerCertificate=Yes;Encrypt=False;"));
            builder.Services.AddDbContext<KeystrokeDBContext>(opt => opt.UseSqlite("Data Source=keystrokeoversqlite.db"));
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:3000")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.UseCors();
            app.MapControllers();
            app.MapHub<PingHub>("/ping");

            app.Run();
        }
    }
}
