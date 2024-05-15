using System.Text.Json.Serialization;

namespace keystroke_backend_over_asp.Models
{
    public class User
    {
        public long ID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string MasterKey { get; set; }

        [JsonIgnore]
        public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();

        public static bool operator== (User lhs, User? rhs)
        {
            if (rhs is null)
                return lhs is null;

            return lhs.Email == rhs.Email || lhs.Username == rhs.Username || lhs.ID == rhs.ID;
        }

        public static bool operator!= (User lhs, User? rhs) {  return !(lhs == rhs); }
    }
}