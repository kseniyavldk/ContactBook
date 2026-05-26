import { useEffect, useState } from "react";
import type { Contact, ContactDto } from "../types/Contact";
import { ApiError } from "../services/contactService";

interface ContactModalProps {
  isOpen: boolean;
  initialData: Contact | null;
  onClose: () => void;
  onSave: (contact: ContactDto) => Promise<void>;
}

const initialForm: ContactDto = {
  name: "",
  mobilePhone: "",
  jobTitle: "",
  birthDate: "",
};

function ContactModal({
  isOpen,
  initialData,
  onClose,
  onSave,
}: ContactModalProps) {
  const [formData, setFormData] = useState<ContactDto>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = initialData !== null;

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData({
        name: initialData.name,
        mobilePhone: initialData.mobilePhone,
        jobTitle: initialData.jobTitle ?? "",
        birthDate: initialData.birthDate ?? "",
      });
    } else {
      setFormData(initialForm);
    }

    setErrors({});
    setServerError("");
    setIsSaving(false);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  function validate() {
    const newErrors: Record<string, string> = {};

    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.mobilePhone.trim();
    const trimmedJobTitle = formData.jobTitle.trim();

    if (!trimmedName) {
      newErrors.name = "Имя обязательно";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
    } else if (trimmedName.length > 80) {
      newErrors.name = "Имя не должно превышать 80 символов";
    } else if (!/^[a-zA-Zа-яА-ЯёЁ\s\-'.]+$/.test(trimmedName)) {
      newErrors.name =
        "Имя может содержать только буквы, пробелы, дефисы и апостроф";
    }

    if (!trimmedPhone) {
      newErrors.mobilePhone = "Телефон обязателен";
    } else if (trimmedPhone.length < 7) {
      newErrors.mobilePhone = "Телефон слишком короткий";
    } else if (trimmedPhone.length > 20) {
      newErrors.mobilePhone = "Телефон слишком длинный";
    } else if (!/^[+\d\s\-()]+$/.test(trimmedPhone)) {
      newErrors.mobilePhone = "Телефон содержит недопустимые символы";
    }

    if (trimmedJobTitle.length > 80) {
      newErrors.jobTitle = "Должность не должна превышать 80 символов";
    }

    if (formData.birthDate) {
      const selectedDate = new Date(formData.birthDate);
      const today = new Date();
      const minDate = new Date("1900-01-01");

      if (selectedDate > today) {
        newErrors.birthDate = "Дата рождения не может быть в будущем";
      } else if (selectedDate < minDate) {
        newErrors.birthDate = "Дата рождения не может быть раньше 1900 года";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSaving(true);
      setServerError("");

      await onSave({
        name: formData.name.trim(),
        mobilePhone: formData.mobilePhone.trim(),
        jobTitle: formData.jobTitle.trim(),
        birthDate: formData.birthDate,
      });

      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);

        if (error.errors) {
          const mappedErrors: Record<string, string> = {};

          if (error.errors.Name?.length) {
            mappedErrors.name = error.errors.Name[0];
          }
          if (error.errors.MobilePhone?.length) {
            mappedErrors.mobilePhone = error.errors.MobilePhone[0];
          }
          if (error.errors.JobTitle?.length) {
            mappedErrors.jobTitle = error.errors.JobTitle[0];
          }
          if (error.errors.BirthDate?.length) {
            mappedErrors.birthDate = error.errors.BirthDate[0];
          }

          setErrors((prev) => ({ ...prev, ...mappedErrors }));
        }
      } else {
        setServerError("Не удалось сохранить контакт");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditMode ? "Редактировать контакт" : "Добавить контакт"}</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {serverError && <div className="server-error">{serverError}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobilePhone">Телефон</label>
            <input
              id="mobilePhone"
              name="mobilePhone"
              type="text"
              value={formData.mobilePhone}
              onChange={handleChange}
              placeholder="+375291234567"
            />
            {errors.mobilePhone && (
              <span className="field-error">{errors.mobilePhone}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="jobTitle">Должность</label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={handleChange}
            />
            {errors.jobTitle && (
              <span className="field-error">{errors.jobTitle}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">Дата рождения</label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
            />
            {errors.birthDate && (
              <span className="field-error">{errors.birthDate}</span>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="primary-btn" disabled={isSaving}>
              {isSaving
                ? "Сохранение..."
                : isEditMode
                  ? "Сохранить изменения"
                  : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;
