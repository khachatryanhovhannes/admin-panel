import client from "./client";

// Page և PageTranslation structure: հարմարեցրեք ըստ ձեր schema-ի
export interface PageTranslation {
  id?: number;
  title: string;
  content: string;
  seoTitle?: string;
  seoDesc?: string;
  // languageId?: number; // կարող է լինել նաև language: { connect: { id: number } }
}

export interface Page {
  id: number;
  slug: string;
  isActive: boolean;
  isStatic: boolean;
  translations?: PageTranslation[];
}

// CRUD
export async function fetchPages(): Promise<Page[]> {
  const { data } = await client.get("/admin/pages");
  return data;
}

export async function fetchPage(id: number): Promise<Page> {
  const { data } = await client.get(`/admin/pages/${id}`);
  return data;
}

export async function createPage(payload: any): Promise<Page> {
  const { data } = await client.post("/admin/pages", payload);
  return data;
}

export async function updatePage(id: number, payload: any): Promise<Page> {
  const { data } = await client.patch(`/admin/pages/${id}`, payload);
  return data;
}

export async function deletePage(id: number): Promise<Page> {
  const { data } = await client.delete(`/admin/pages/${id}`);
  return data;
}
