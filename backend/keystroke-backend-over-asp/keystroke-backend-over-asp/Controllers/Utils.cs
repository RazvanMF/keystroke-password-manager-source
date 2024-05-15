using keystroke_backend_over_asp.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace keystroke_backend_over_asp.Controllers
{
    public static class Utils
    {
        public static AccountDTO AccountToDTO(Account account) =>
            new AccountDTO
            {
                ID = account.ID,
                Service = account.Service,
                Email = account.Email,
                Username = account.Username,
                Password = account.Password,
                UserID = account.UserID
            };

        public static UserDTO UserToDTO(User user) =>
            new UserDTO
            {
                ID = user.ID,
                Username = user.Username,
                MasterKey = user.MasterKey,
                Email= user.Email
            };
        public static String CreateAccessToken(User user)
        {
            string publickey = "5L5I8D5S0P3R7I9V0A1T7E5K0E3Y7OXP";
            byte[] key = Encoding.UTF8.GetBytes(publickey);
            SymmetricSecurityKey symkey = new SymmetricSecurityKey(key);
            SigningCredentials signedCredential = new SigningCredentials(symkey, SecurityAlgorithms.HmacSha256Signature);
            ClaimsIdentity uClaims = new ClaimsIdentity(new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.ID.ToString()),
            });

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = uClaims,
                Audience = "https://localhost:3000",
                Expires = DateTime.UtcNow.AddDays(1),
                Issuer = "Longinus Imperative Defense Systems",
                SigningCredentials = signedCredential
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenJwt = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(tokenJwt);
            
            return token;
        }

        public static int ValidateJWTToken(string token)
        {
            string publickey = "5L5I8D5S0P3R7I9V0A1T7E5K0E3Y7OXP";
            byte[] key = Encoding.UTF8.GetBytes(publickey);
            SymmetricSecurityKey symkey = new SymmetricSecurityKey(key);

            var validationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidateTokenReplay = false,
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidAudience = "https://localhost:3000",
                ValidIssuer = "Longinus Imperative Defense Systems"
            };

            SecurityToken validatedToken;
            JwtSecurityToken result;

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                tokenHandler.ValidateToken(token, validationParameters, out validatedToken);
            }
            catch (Exception e)
            {
                return -1;
            }

            if (validatedToken == null)
                return -1;

            result = tokenHandler.ReadJwtToken(token);
            return int.Parse(result.Subject);
        }
    }
}
