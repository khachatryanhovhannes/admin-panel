import instance from "./client";

export interface IConstant {
  id: number;
  key: string;
  value: string;
}

export async function fetchAllConstants(): Promise<IConstant[]> {
  const { data } = await instance.get("/constants");
  return data;
}

export async function createConstant(
  payload: Omit<IConstant, "id">
): Promise<IConstant> {
  const { data } = await instance.post("/constants", payload);
  return data;
}

export async function updateConstant(
  id: number,
  payload: Partial<Omit<IConstant, "id">>
): Promise<IConstant> {
  const { data } = await instance.patch(`/constants/${id}`, payload);
  return data;
}

export async function deleteConstant(id: number): Promise<void> {
  await instance.delete(`/constants/${id}`);
}
