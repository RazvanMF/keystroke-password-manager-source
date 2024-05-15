using keystroke_backend_over_asp.Hubs;
using keystroke_backend_over_asp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

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
            builder.Services.AddDbContext<KeystrokeDBContext>(opt => opt.UseSqlServer("Data Source=DESKTOP-MAIN;Initial Catalog=keystroke;Integrated Security=true;TrustServerCertificate=Yes;Encrypt=False;"));
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
            app.MapControllers();
            app.UseCors();
            app.MapHub<PingHub>("/ping");

            app.Run();
        }
    }
}
