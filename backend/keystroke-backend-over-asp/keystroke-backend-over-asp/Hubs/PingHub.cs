using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace keystroke_backend_over_asp.Hubs
{
    public class PingHub : Hub
    {
        static int counter = 0;
        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("ReceiveMessage", $"[i] CLIENT {Context.ConnectionId} HAS CONNECTED");
            Console.WriteLine($"[i] CLIENT {Context.ConnectionId} HAS CONNECTED");
            await base.OnConnectedAsync();
        }

        public async Task ExecuteAsync()
        {
            var timer = new PeriodicTimer(TimeSpan.FromSeconds(5));

            while (await timer.WaitForNextTickAsync())
            {
                await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", $"[i] CLIENT {Context.ConnectionId} HAS BEEN PINGED");
            }
        }

        public async Task NewMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task Disconnect()
        {
            await Clients.All.SendAsync("Kill");
        }

    }
}
