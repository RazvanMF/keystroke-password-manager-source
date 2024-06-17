using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using keystroke_backend_over_asp.Models;
using Microsoft.AspNetCore.SignalR;
using keystroke_backend_over_asp.Hubs;

namespace keystroke_backend_over_asp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly KeystrokeDBContext _context;
        private readonly IHubContext<PingHub> _hubContext;

        public AccountsController(KeystrokeDBContext context, IHubContext<PingHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // GET: api/Accounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountDTO>>> GetAccounts()
        {
            return await _context.Accounts.Select(x => Utils.AccountToDTO(x)).ToListAsync();
        }

        // GET: api/Accounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AccountDTO>> GetAccount(long id)
        {
            var account = await _context.Accounts.FindAsync(id);

            if (account == null)
            {
                return NotFound();
            }

            return Utils.AccountToDTO(account);
        }

        // PUT: api/Accounts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccount(long id, AccountDTO account)
        {
            if (id != account.ID)
            {
                return BadRequest();
            }

            var accountRef = await _context.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }

            if (!UserExists(accountRef.UserID))
                return BadRequest();

            //Account searchTemp = new Account { Service = account.Service, Username = account.Username, Email = account.Email, Password = account.Password, UserID = account.UserID };
            //if (_context.Accounts.ToList().Where(acc => acc == searchTemp && acc.ID != searchTemp.ID).Count() > 0)
            //{
            //    return BadRequest();
            //}

            accountRef.Service = account.Service;

            accountRef.Email = account.Email;
            if (accountRef.Email == "")
                accountRef.Email = null;

            accountRef.Username = account.Username;
            if (accountRef.Username == "")
                accountRef.Username = null;

            accountRef.Password = account.Password;

            _context.Entry(accountRef).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            await _hubContext.Clients.All.SendAsync("InvokeGETRequest");
            return NoContent();
        }

        // POST: api/Accounts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AccountDTO>> PostAccount(AccountDTO account)
        {
            Account accountRef = new Account {Service = account.Service, Username = account.Username, Email = account.Email, Password = account.Password, UserID = account.UserID };
            if (accountRef.Email == "")
                accountRef.Email = null;
            if (accountRef.Username == "")
                accountRef.Username = null;

            if (!UserExists(accountRef.UserID))
                return BadRequest();
            if (_context.Accounts.ToList().Where(acc => acc == accountRef).Count() > 0)
                return BadRequest();

            _context.Accounts.Add(accountRef);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("InvokeGETRequest");
            return CreatedAtAction("GetAccount", new { id = accountRef.ID }, Utils.AccountToDTO(accountRef));
        }

        // DELETE: api/Accounts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(long id)
        {
            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();


            await _hubContext.Clients.All.SendAsync("InvokeGETRequest");
            return NoContent();
        }

        private bool AccountExists(long id)
        {
            return _context.Accounts.Any(e => e.ID == id);
        }

        private bool UserExists(long id)
        {
            return _context.Users.Any(e => e.ID == id);
        }

        [HttpGet("forUser/{userID}")]
        public async Task<ActionResult<IEnumerable<AccountDTO>>> GetUserSpecificAccounts(long userID)
        {
            return await _context.Accounts.Where(x => x.UserID == userID).Select(x => Utils.AccountToDTO(x)).ToListAsync();
        }
    }
}
