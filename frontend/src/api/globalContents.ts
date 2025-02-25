import client from "./client";

export interface GlobalContentTranslation {
  id?: number;
  value: string;
  // languageId?: number
}

export interface GlobalContent {
  id: number;
  key: string;
  translations?: GlobalContentTranslation[];
}

export async function fetchGlobalContents(): Promise<GlobalContent[]> {
  const { data } = await client.get("/admin/global-contents");
  return data;
}

export async function fetchGlobalContent(id: number): Promise<GlobalContent> {
  const { data } = await client.get(`/admin/global-contents/${id}`);
  return data;
}

export async function createGlobalContent(
  payload: any
): Promise<GlobalContent> {
  const { data } = await client.post("/admin/global-contents", payload);
  return data;
}

export async function updateGlobalContent(
  id: number,
  payload: any
): Promise<GlobalContent> {
  const { data } = await client.patch(`/admin/global-contents/${id}`, payload);
  return data;
}

export async function deleteGlobalContent(id: number): Promise<GlobalContent> {
  const { data } = await client.delete(`/admin/global-contents/${id}`);
  return data;
}
