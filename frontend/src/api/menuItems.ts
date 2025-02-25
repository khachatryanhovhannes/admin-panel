import client from "./client";

export interface MenuItemTranslation {
  id?: number;
  title: string;
  // languageId?: number;
}

export interface MenuItem {
  id: number;
  url: string;
  order: number;
  isActive: boolean;
  // parentId?: number;
  // menuId: number;
  translations?: MenuItemTranslation[];
}

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const { data } = await client.get("/admin/menu-items");
  return data;
}

export async function fetchMenuItem(id: number): Promise<MenuItem> {
  const { data } = await client.get(`/admin/menu-items/${id}`);
  return data;
}

export async function createMenuItem(payload: any): Promise<MenuItem> {
  const { data } = await client.post("/admin/menu-items", payload);
  return data;
}

export async function updateMenuItem(
  id: number,
  payload: any
): Promise<MenuItem> {
  const { data } = await client.patch(`/admin/menu-items/${id}`, payload);
  return data;
}

export async function deleteMenuItem(id: number): Promise<MenuItem> {
  const { data } = await client.delete(`/admin/menu-items/${id}`);
  return data;
}
