import instance from "./client";

export const fetchAllTexts = async () => {
  const response = await instance.get("/text");
  return response.data;
};

export const fetchOneText = async (id: number) => {
  const response = await instance.get(`/text/${id}`);
  return response.data;
};

export const createText = async (data: { key: string }) => {
  const response = await instance.post("/text", data);
  return response.data;
};

export const updateText = async (id: number, data: { key?: string }) => {
  const response = await instance.patch(`/text/${id}`, data);
  return response.data;
};

export const deleteText = async (id: number) => {
  await instance.delete(`/text/${id}`);
};

export const fetchAllTextContents = async () => {
  const response = await instance.get("/text-content");
  return response.data;
};

export const fetchOneTextContent = async (id: number) => {
  const response = await instance.get(`/text-content/${id}`);
  return response.data;
};

export const createTextContent = async (data: {
  textId: number;
  languageId: number;
  content?: string | null;
}) => {
  const response = await instance.post("/text-content", data);
  return response.data;
};

export const updateTextContent = async (
  id: number,
  data: { content?: string | null }
) => {
  const response = await instance.patch(`/text-content/${id}`, data);
  return response.data;
};

export const deleteTextContent = async (id: number) => {
  await instance.delete(`/text-content/${id}`);
};
