import instance from "./client";

export const fetchAllBlogPages = async () => {
  const response = await instance.get("/pages?type=BLOG");
  return response.data;
};

export const createBlogPage = async (data: {
  title: string;
  slug: string;
  isActive?: boolean;
}) => {
  const response = await instance.post("/pages", {
    ...data,
    type: "BLOG",
  });
  return response.data;
};

export const updateBlogPage = async (
  id: number,
  data: {
    title?: string;
    slug?: string;
    isActive?: boolean;
  }
) => {
  const response = await instance.patch(`/pages/${id}`, {
    ...data,
    type: "BLOG",
  });
  return response.data;
};

export const deleteBlogPage = async (id: number) => {
  await instance.delete(`/pages/${id}`);
};

export const fetchAllBlogPagesContent = async () => {
  const response = await instance.get("/pages-content?type=BLOG");
  return response.data;
};

export const createBlogPageContent = async (data: {
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

export const updateBlogPageContent = async (
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

export const deleteBlogPageContent = async (id: number) => {
  await instance.delete(`/pages-content/${id}`);
};
