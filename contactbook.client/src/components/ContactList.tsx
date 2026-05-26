import type { Contact } from "../types/Contact";
import ContactCard from "./ContactCard";

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

function ContactList({ contacts, onEdit, onDelete }: ContactListProps) {
  if (contacts.length === 0) {
    return <p>Контактов пока нет.</p>;
  }

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default ContactList;
