import instance from "./client";

// Fetch all navbars
export const fetchAllNavbars = async () => {
  const response = await instance.get("/navbar");
  return response.data;
};

// Fetch all navbar items (translations)
export const fetchAllNavbarItems = async () => {
  const response = await instance.get("/navbar-item");
  return response.data;
};

// Create new navbar
export const createNavbar = async (data: {
  title: string;
  link: string;
  orderId: number;
  parentId?: number | null;
}) => {
  const response = await instance.post("/navbar", data);
  return response.data;
};

export const updateNavbar = async (
  id: number,
  data: {
    title?: string;
    link?: string;
    orderId?: number;
    parentId?: number | null;
  }
) => {
  const response = await instance.patch(`/navbar/${id}`, data);
  return response.data;
};

// Delete navbar
export const deleteNavbar = async (id: number) => {
  await instance.delete(`/navbar/${id}`);
};

// Update navbar item (translation)
export const updateNavbarItem = async (
  id: number,
  data: { text: string; isActive: boolean }
) => {
  const response = await instance.patch(`/navbar-item/${id}`, data);
  return response.data;
};

// Create new navbar item (translation)
export const createNavbarItem = async (data: {
  navId: number;
  languageId: number;
  text: string;
  isActive: boolean;
}) => {
  const response = await instance.post("/navbar-item", data);
  return response.data;
};
