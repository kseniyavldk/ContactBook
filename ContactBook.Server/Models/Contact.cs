using System.ComponentModel.DataAnnotations;

namespace ContactBook.Server.Models
{
    public class Contact
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(80)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string MobilePhone { get; set; } = string.Empty;

        [MaxLength(80)]
        public string? JobTitle { get; set; }

        public DateOnly? BirthDate { get; set; }
    }

}
