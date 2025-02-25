import client from "./client";

export interface Language {
  id: number;
  name_en: string;
  name_native: string;
  short_code: string;
  logo_url?: string;
  is_active: boolean;
}

export async function fetchLanguages(): Promise<Language[]> {
  const { data } = await client.get("/admin/languages");
  return data;
}

export async function fetchLanguage(id: number): Promise<Language> {
  const { data } = await client.get(`/admin/languages/${id}`);
  return data;
}

export async function createLanguage(
  payload: Partial<Language>
): Promise<Language> {
  const { data } = await client.post("/admin/languages", payload);
  return data;
}

export async function updateLanguage(
  id: number,
  payload: Partial<Language>
): Promise<Language> {
  const { data } = await client.patch(`/admin/languages/${id}`, payload);
  return data;
}

export async function deleteLanguage(id: number): Promise<Language> {
  const { data } = await client.delete(`/admin/languages/${id}`);
  return data;
}
