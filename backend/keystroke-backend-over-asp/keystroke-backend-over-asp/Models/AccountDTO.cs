namespace keystroke_backend_over_asp.Models
{
    public class AccountDTO
    {
        public long ID { get; set; }
        public string Service { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string Password { get; set; }

        public long UserID { get; set; }
    }
}
