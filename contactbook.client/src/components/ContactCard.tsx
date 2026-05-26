import type { Contact } from "../types/Contact";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const initial = contact.name?.charAt(0).toUpperCase() || "?";

  function formatBirthDate(dateString: string | null) {
    if (!dateString) return "—";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("ru-RU");
  }

  return (
    <div className="contact-card">
      <div className="contact-card-top">
        <div className="contact-person">
          <div className="contact-avatar">{initial}</div>
          <h3>{contact.name}</h3>
        </div>

        <div className="card-actions">
          <button className="secondary-btn" onClick={() => onEdit(contact)}>
            Редактировать
          </button>
          <button className="danger-btn" onClick={() => onDelete(contact)}>
            Удалить
          </button>
        </div>
      </div>

      <div className="contact-info">
        <p>
          <strong>Телефон:</strong> {contact.mobilePhone}
        </p>
        <p>
          <strong>Должность:</strong> {contact.jobTitle || "—"}
        </p>
        <p>
          <strong>Дата рождения:</strong> {formatBirthDate(contact.birthDate)}
        </p>
      </div>
    </div>
  );
}

export default ContactCard;
