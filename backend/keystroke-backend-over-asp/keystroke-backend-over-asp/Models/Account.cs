using Microsoft.AspNetCore.Mvc.Localization;

namespace keystroke_backend_over_asp.Models
{
    public class Account
    {
        public long ID { get; set; }
        public string Service { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string Password { get; set; }

        public long UserID { get; set; }
        public virtual User User { get; set; } = null!;

        public static bool operator== (Account lhs, Account? rhs)
        {
            if (rhs is null)
                return lhs is null;

            bool emailEquality = rhs.Email != null && (rhs.Service == lhs.Service && rhs.Email == lhs.Email);
            bool usernameEquality = rhs.Username != null && (rhs.Service == lhs.Service && rhs.Username == lhs.Username);
            bool passwordEqualityWhenNulls = rhs.Service == lhs.Service &&
                (rhs.Email == null && lhs.Email == null) &&
                (rhs.Username == null && lhs.Username == null) &&
                (rhs.Password == lhs.Password);
            bool totalEquality = (rhs.Email != null) && (rhs.Username == null) &&
                (rhs.Service == lhs.Service && rhs.Email == lhs.Email && rhs.Username == lhs.Username && rhs.Password == lhs.Password);

            return emailEquality || usernameEquality || passwordEqualityWhenNulls || totalEquality;
        }

        public static bool operator!= (Account lhs, Account rhs)
        {
            return !(lhs == rhs);
        }

        public override bool Equals(object? obj)
        {
            if (obj == null) return false;
            if (!(obj is Account)) return false;

            Account rhs = (Account)obj;

            bool emailEquality = rhs.Service == this.Service && rhs.Email == this.Email;
            bool usernameEquality = rhs.Service == this.Service && rhs.Username == this.Username;
            bool passwordEqualityWhenNulls = rhs.Service == this.Service &&
                (rhs.Email == null && this.Email == null) &&
                (rhs.Username == null && this.Username == null) &&
                (rhs.Password == this.Password);
            bool totalEquality = rhs.Service == this.Service && rhs.Email == this.Email && rhs.Username == this.Username && rhs.Password == this.Password;

            return emailEquality || usernameEquality || passwordEqualityWhenNulls || totalEquality;
        }

        public override int GetHashCode()
        {
            return (this.ID, this.Service, this.Email, this.Username, this.Password).GetHashCode();
        }
    }
}
