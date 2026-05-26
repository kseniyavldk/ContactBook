import type { Contact, ContactDto } from "../types/Contact";

const BASE_URL = "https://localhost:44390/api/Contacts";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  let errorMessage = "Произошла ошибка";
  let validationErrors: Record<string, string[]> | undefined;

  try {
    const errorData = await response.json();

    if (errorData?.title) {
      errorMessage = errorData.title;
    }

    if (errorData?.errors) {
      validationErrors = errorData.errors;
      errorMessage = "Проверьте правильность заполнения формы";
    }

    if (errorData?.message) {
      errorMessage = errorData.message;
    }
  } catch {
    errorMessage = "Ошибка сервера";
  }

  throw new ApiError(errorMessage, response.status, validationErrors);
}

export const contactService = {
  async getAll(): Promise<Contact[]> {
    const response = await fetch(BASE_URL);
    return handleResponse<Contact[]>(response);
  },

  async create(dto: ContactDto): Promise<Contact> {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    return handleResponse<Contact>(response);
  },

  async update(id: number, dto: ContactDto): Promise<Contact> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    return handleResponse<Contact>(response);
  },

  async remove(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    return handleResponse<void>(response);
  },
};
