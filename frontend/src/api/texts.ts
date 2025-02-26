import instance from "./client";

// --------------------------------------------------
// Text API
// --------------------------------------------------

/**
 * Վերցնում ենք բոլոր Text գրառումները
 * GET /text
 */
export const fetchAllTexts = async () => {
  const response = await instance.get("/text");
  return response.data;
};

/**
 * Վերցնում ենք մեկ Text ըստ ID
 * GET /text/:id
 */
export const fetchOneText = async (id: number) => {
  const response = await instance.get(`/text/${id}`);
  return response.data;
};

/**
 * Ստեղծում ենք նոր Text
 * POST /text
 */
export const createText = async (data: { key: string }) => {
  const response = await instance.post("/text", data);
  return response.data;
};

/**
 * Թարմացնում ենք առկա Text
 * PATCH /text/:id
 */
export const updateText = async (id: number, data: { key?: string }) => {
  const response = await instance.patch(`/text/${id}`, data);
  return response.data;
};

/**
 * Ջնջում ենք Text
 * DELETE /text/:id
 */
export const deleteText = async (id: number) => {
  await instance.delete(`/text/${id}`);
};

// --------------------------------------------------
// Text_content API
// --------------------------------------------------

/**
 * Վերցնում ենք բոլոր Text_content գրառումները
 * GET /text-content
 */
export const fetchAllTextContents = async () => {
  const response = await instance.get("/text-content");
  return response.data;
};

/**
 * Վերցնում ենք մեկ Text_content ըստ ID
 * GET /text-content/:id
 */
export const fetchOneTextContent = async (id: number) => {
  const response = await instance.get(`/text-content/${id}`);
  return response.data;
};

/**
 * Ստեղծում ենք նոր Text_content
 * POST /text-content
 */
export const createTextContent = async (data: {
  textId: number;
  languageId: number;
  content?: string | null;
}) => {
  const response = await instance.post("/text-content", data);
  return response.data;
};

/**
 * Թարմացնում ենք առկա Text_content
 * PATCH /text-content/:id
 */
export const updateTextContent = async (
  id: number,
  data: { content?: string | null }
) => {
  const response = await instance.patch(`/text-content/${id}`, data);
  return response.data;
};

/**
 * Ջնջում ենք Text_content
 * DELETE /text-content/:id
 */
export const deleteTextContent = async (id: number) => {
  await instance.delete(`/text-content/${id}`);
};
