using System.ComponentModel.DataAnnotations;

namespace ContactBook.Server.DTOs
{
    public class ContactDto
    {
        [Required(ErrorMessage = "Имя обязательно")]
        [MinLength(2, ErrorMessage = "Имя: минимум 2 символа")]
        [MaxLength(80, ErrorMessage = "Имя: максимум 80 символов")]
        [RegularExpression(@"^[a-zA-Zа-яёА-ЯЁ\s\-'.]+$",
            ErrorMessage = "Имя может содержать только буквы, пробелы и дефисы")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Телефон обязателен")]
        [Phone(ErrorMessage = "Введите корректный номер телефона")]
        [MaxLength(20, ErrorMessage = "Телефон: максимум 20 символов")]
        public string MobilePhone { get; set; } = string.Empty;

        [MaxLength(80, ErrorMessage = "Должность: максимум 80 символов")]
        public string? JobTitle { get; set; }

        public DateOnly? BirthDate { get; set; }
    }
}
