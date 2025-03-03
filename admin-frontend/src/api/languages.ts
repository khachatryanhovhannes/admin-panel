import { ILanguage } from "../models";
import instance from "./client";

export const fetchAllLanguages = async () => {
  const data = await instance.get("/language");
  return data.data;
};

export const createLanguage = async (data: ILanguage) => {
  const response = await instance.post("/language", data);
  return response.data;
};

export const updateLanguage = async (id: number, data: ILanguage) => {
  const response = await instance.patch(`/language/${id}`, data);
  return response.data;
};

export const deleteLanguage = async (id: number) => {
  const response = await instance.delete(`/language/${id}`);
  return response.data;
};

export const getLanguageById = async (id: number) => {
  const response = await instance.get(`/language/${id}`);
  return response.data;
};
