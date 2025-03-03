import instance from "./client";

export const fetchAllPages = async () => {
  const response = await instance.get("/pages?type=DYNAMIC");
  return response.data;
};

export const createPage = async (data: {
  title: string;
  slug: string;
  type: "DYNAMIC" | "BLOG";
  isActive?: boolean;
}) => {
  const response = await instance.post("/pages", data);
  return response.data;
};

export const updatePage = async (
  id: number,
  data: {
    title?: string;
    slug?: string;
    type?: "DYNAMIC" | "BLOG";
    isActive?: boolean;
  }
) => {
  const response = await instance.patch(`/pages/${id}`, data);
  return response.data;
};

export const deletePage = async (id: number) => {
  await instance.delete(`/pages/${id}`);
};

export const fetchAllPagesContent = async () => {
  const response = await instance.get("/pages-content");
  return response.data;
};

export const createPageContent = async (data: {
  pagesId: number;
  languageId: number;
  meta_title: string;
  meta_description: string;
  keywords: string;
  title: string;
  content: string;
}) => {
  const response = await instance.post("/pages-content", data);
  return response.data;
};

export const updatePageContent = async (
  id: number,
  data: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string;
    title?: string;
    content?: string;
  }
) => {
  const response = await instance.patch(`/pages-content/${id}`, data);
  return response.data;
};

export const deletePageContent = async (id: number) => {
  await instance.delete(`/pages-content/${id}`);
};
