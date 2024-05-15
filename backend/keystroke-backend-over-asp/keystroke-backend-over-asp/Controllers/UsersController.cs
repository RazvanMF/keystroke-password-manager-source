using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using keystroke_backend_over_asp.Models;
using System.Security.Principal;
using System.Net.Mail;
using System.Net;

namespace keystroke_backend_over_asp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly KeystrokeDBContext _context;

        public UsersController(KeystrokeDBContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            return await _context.Users.Select(x => Utils.UserToDTO(x)).ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(long id)
        {
            var masterUser = await _context.Users.FindAsync(id);

            if (masterUser == null)
            {
                return NotFound();
            }

            return Utils.UserToDTO(masterUser);
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(long id, UserDTO user)
        {
            if (id != user.ID)
            {
                return BadRequest();
            }

            var userRef = await _context.Users.FindAsync(id);
            if (userRef == null)
            {
                return NotFound();
            }
            userRef.Username = user.Username;
            userRef.MasterKey = user.MasterKey;
            userRef.Email = user.Email;

            _context.Entry(userRef).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostUser(UserDTO user)
        {
            User userRef = new User { Username = user.Username, MasterKey = user.MasterKey, Email=user.Email };
            try
            {
                if (_context.Users.ToList().Any(user => user == userRef))
                    return BadRequest();

                _context.Users.Add(userRef);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetUser", new { id = userRef.ID }, Utils.UserToDTO(userRef));
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return BadRequest(e.ToString());
            }
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(long id)
        {
            return _context.Users.Any(e => e.ID == id);
        }

        //GET: api/Users/RazvanMF-admin
        [HttpGet("{username}-{masterkey}")]
        public async Task<ActionResult<UserDTO>> GetUserViaUsername(string username, string masterkey)
        {
            User user;
            try
            {
                var userList = await _context.Users.Where(x => x.Username == username && x.MasterKey == masterkey).ToListAsync();
                if (userList.Count == 1)
                    user = userList[0];
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                return NotFound();
            }

            return Utils.UserToDTO(user);
        }

        //GET: api/Users/login/admin&admin
        [HttpGet("login/{username}&{masterkey}")]
        public async Task<ActionResult<string>> LoginAndReturnJWT(long id, string username, string masterkey)
        {
            User user;
            try
            {
                var userList = await _context.Users.Where(x => x.Username == username && x.MasterKey == masterkey).ToListAsync();
                if (userList.Count == 1)
                    user = userList[0];
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                return NotFound();
            }

            return Utils.CreateAccessToken(user);
        }

        //GET: api/Users/validate/[TOKEN]
        [HttpGet("validate/{token}")]
        public async Task<ActionResult<UserDTO>> ValidateJWTAndReturnUser(string token)
        {
            int userID = Utils.ValidateJWTToken(token);
            return await GetUser(userID);
        }

        //POST: api/Users/emailFeature/email
        [HttpPost("emailFeature/{email}")]
        public async Task<ActionResult> SendEmailToEndUser(string email)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
                                  | SecurityProtocolType.Tls11
                                  | SecurityProtocolType.Tls12;
            using (var message = new MailMessage())
            {
                message.To.Add(new MailAddress(email));
                message.From = new MailAddress("longinusids.application@hotmail.com");
                message.Subject = "WELCOME TO KEYSTROKE";
                message.Body = "YOUR APPLICATION WAS ACCEPTED.\nYOU ARE NOW AUTHORIZED TO USE \"KEYSTROKE CREDENTIAL MANAGER\"\n\nDO NOT REPLY TO THIS EMAIL.";
                message.IsBodyHtml = false; // change to true if body msg is in html

                using (var client = new SmtpClient("smtp-mail.outlook.com"))
                {
                    client.UseDefaultCredentials = false;
                    client.Port = 587;
                    client.Credentials = new NetworkCredential("longinusids.application@hotmail.com", "ehxitrmjtywvnvwe");
                    client.EnableSsl = true;

                    try
                    {
                        await client.SendMailAsync(message); // Email sent
                        return NoContent();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.ToString());
                        return BadRequest();
                    }
                }
            }
        }
    }
}
