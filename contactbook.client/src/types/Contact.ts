export interface Contact {
  id: number;
  name: string;
  mobilePhone: string;
  jobTitle: string | null;
  birthDate: string | null;
}

export interface ContactDto {
  name: string;
  mobilePhone: string;
  jobTitle: string;
  birthDate: string;
}
