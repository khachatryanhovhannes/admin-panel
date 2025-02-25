import client from "./client";

export interface Menu {
  id: number;
  name: string;
  // items?: MenuItem[] // ուզեք կարելի է նաև ներգրավել
}

export async function fetchMenus(): Promise<Menu[]> {
  const { data } = await client.get("/admin/menus");
  return data;
}

export async function fetchMenu(id: number): Promise<Menu> {
  const { data } = await client.get(`/admin/menus/${id}`);
  return data;
}

export async function createMenu(payload: Partial<Menu>): Promise<Menu> {
  const { data } = await client.post("/admin/menus", payload);
  return data;
}

export async function updateMenu(
  id: number,
  payload: Partial<Menu>
): Promise<Menu> {
  const { data } = await client.patch(`/admin/menus/${id}`, payload);
  return data;
}

export async function deleteMenu(id: number): Promise<Menu> {
  const { data } = await client.delete(`/admin/menus/${id}`);
  return data;
}
