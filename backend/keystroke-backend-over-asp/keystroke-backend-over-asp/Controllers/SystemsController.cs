using keystroke_backend_over_asp.Hubs;
using keystroke_backend_over_asp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;
using System.Text;

using Zxcvbn;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace keystroke_backend_over_asp.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class SystemsController : ControllerBase
    {
        private readonly KeystrokeDBContext _context;

        public SystemsController(KeystrokeDBContext context)
        {
            _context = context;
        }

        // GET: GET api/systems/pwn/forpassword/{password}
        [HttpGet("pwn/forpassword/{password}")]
        public async Task<IActionResult> GetPasswordSeensFromPwnedAPI(string password)
        {
            string sha1hash = Convert.ToHexString(SHA1.HashData(Encoding.UTF8.GetBytes(password)));
            string prefix = sha1hash.Substring(0, 5);
            string suffix = sha1hash.Substring(5);

            HttpClient client = new HttpClient();
            var response = await client.GetAsync("https://api.pwnedpasswords.com/range/" + prefix);
            response.EnsureSuccessStatusCode();
            string report = await response.Content.ReadAsStringAsync();

            foreach (string line in report.Split("\n"))
            {
                string[] tokens = line.Split(":");
                if (tokens[0] == suffix)
                    return Ok(int.Parse(tokens[1]));
            }

            return Ok(0);
        }

        // GET api/systems/stats/forpassword/{userid}
        [HttpGet("stats/forpassword/{userid}")]
        public async Task<IActionResult> GetPasswordStats(int userid)
        {
            Dictionary<string, int> report = new Dictionary<string, int>();
            report.Add("very weak", 0); report.Add("weak", 0); report.Add("adequeate", 0); report.Add("strong", 0); report.Add("very strong", 0);

            string lmao = "";
            foreach(string password in _context.Accounts.Where(x => x.UserID == userid).Select(x => x.Password))
            {
                var result = Zxcvbn.Core.EvaluatePassword(password);
                switch (result.Score)
                {
                    case 0:
                        report["very weak"] += 1;
                        break;
                    case 1:
                        report["weak"] += 1;
                        break;
                    case 2:
                        report["adequate"] += 1;
                        break;
                    case 3:
                        report["strong"] += 1;
                        break;
                    case 4:
                        report["very strong"] += 1;
                        break;
                }
                
            }
            return Ok(JsonConvert.SerializeObject(report));
        }

        // GET api/systems/stats/foremails/{userid}
        [HttpGet("stats/foremail/{userid}")]
        public async Task<IActionResult> GetEmailStats(int userid)
        {
            Dictionary<string, int> report = new Dictionary<string, int>();

            foreach (string? email in _context.Accounts.Where(x => x.UserID == userid).Select(x => x.Email))
            {
                if (email == null && !report.ContainsKey("no email"))
                {
                    report.Add("no email", 1);
                    continue;
                }

                if (email != null && !report.ContainsKey(email))
                {
                    report.Add(email, 1);
                    continue;
                }

                if (email == null && report.ContainsKey("no email"))
                {
                    report["no email"] += 1;
                    continue;
                }

                if (email != null && report.ContainsKey(email))
                {
                    report[email] += 1;
                    continue;
                }

            }
            return Ok(JsonConvert.SerializeObject(report));
        }

        // GET api/systems/stats/forusernames/{userid}
        [HttpGet("stats/forusername/{userid}")]
        public async Task<IActionResult> GetUsernameStats(int userid)
        {
            Dictionary<string, int> report = new Dictionary<string, int>();

            foreach (string? username in _context.Accounts.Where(x => x.UserID == userid).Select(x => x.Username))
            {
                if (username == null && !report.ContainsKey("no username"))
                {
                    report.Add("no username", 1);
                    continue;
                }

                if (username != null && !report.ContainsKey(username))
                {
                    report.Add(username, 1);
                    continue;
                }

                if (username == null && report.ContainsKey("no username"))
                {
                    report["no username"] += 1;
                    continue;
                }

                if (username != null && report.ContainsKey(username))
                {
                    report[username] += 1;
                    continue;
                }

            }
            return Ok(JsonConvert.SerializeObject(report));
        }

        // GET api/systems/stats/forpassword
        [HttpGet("sec/forpassword")]
        public async Task<IActionResult> GetCryptographicallySecurePassword()
        {
            return Ok(Convert.ToBase64String(RandomNumberGenerator.GetBytes(18)));
        }
    }
}
