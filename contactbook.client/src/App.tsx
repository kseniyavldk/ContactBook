import { useEffect, useState } from "react";
import "./App.css";
import type { Contact, ContactDto } from "./types/Contact";
import { contactService } from "./services/contactService";
import ContactList from "./components/ContactList";
import ContactModal from "./components/ContactModal";

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      setLoading(true);
      setError("");

      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить контакты");
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingContact(null);
    setIsModalOpen(true);
  }

  function openEditModal(contact: Contact) {
    setEditingContact(contact);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingContact(null);
  }

  async function handleSaveContact(contactDto: ContactDto) {
    if (editingContact) {
      await contactService.update(editingContact.id, contactDto);
    } else {
      await contactService.create(contactDto);
    }

    await loadContacts();
  }

  function openDeleteModal(contact: Contact) {
    setDeletingContact(contact);
  }

  function closeDeleteModal() {
    setDeletingContact(null);
  }

  async function handleDeleteContact() {
    if (!deletingContact) return;

    await contactService.remove(deletingContact.id);
    setDeletingContact(null);
    await loadContacts();
  }

  return (
    <main className="app">
      <div className="app-header">
        <div>
          <h1>Контакты</h1>
        </div>

        <button className="primary-btn" onClick={openCreateModal}>
          Добавить контакт
        </button>
      </div>

      {loading && <p>Загрузка контактов...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && (
        <ContactList
          contacts={contacts}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      <ContactModal
        isOpen={isModalOpen}
        initialData={editingContact}
        onClose={closeModal}
        onSave={handleSaveContact}
      />

      {deletingContact && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h2>Удалить контакт</h2>
              <button
                type="button"
                className="close-btn"
                onClick={closeDeleteModal}
              >
                ✕
              </button>
            </div>

            <p className="confirm-text">
              Вы действительно хотите удалить контакт{" "}
              <strong>{deletingContact.name}</strong>?
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={closeDeleteModal}
              >
                Отмена
              </button>
              <button
                type="button"
                className="danger-btn"
                onClick={handleDeleteContact}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
