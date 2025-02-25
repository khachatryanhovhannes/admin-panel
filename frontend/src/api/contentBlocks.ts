import client from "./client";

export interface ContentBlockTranslation {
  id?: number;
  content: string;
  // languageId?: number;
}

export interface ContentBlock {
  id: number;
  key: string;
  isGlobal: boolean;
  translations?: ContentBlockTranslation[];
}

export async function fetchContentBlocks(): Promise<ContentBlock[]> {
  const { data } = await client.get("/admin/content-blocks");
  return data;
}

export async function fetchContentBlock(id: number): Promise<ContentBlock> {
  const { data } = await client.get(`/admin/content-blocks/${id}`);
  return data;
}

export async function createContentBlock(payload: any): Promise<ContentBlock> {
  const { data } = await client.post("/admin/content-blocks", payload);
  return data;
}

export async function updateContentBlock(
  id: number,
  payload: any
): Promise<ContentBlock> {
  const { data } = await client.patch(`/admin/content-blocks/${id}`, payload);
  return data;
}

export async function deleteContentBlock(id: number): Promise<ContentBlock> {
  const { data } = await client.delete(`/admin/content-blocks/${id}`);
  return data;
}
