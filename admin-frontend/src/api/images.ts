import instance from "./client";

export interface IImage {
  id: number;
  key: string;
  imageUrl: string;
}

// Fetch all images
export async function fetchAllImages(): Promise<IImage[]> {
  const { data } = await instance.get("/images");
  return data;
}

// Upload new image
export async function uploadImage(formData: FormData): Promise<IImage> {
  const { data } = await instance.post("/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

// Update image (replace existing image by key)
export async function updateImage(
  key: string,
  formData: FormData
): Promise<IImage> {
  const { data } = await instance.put(`/images/${key}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

// Delete image
export async function deleteImage(key: string): Promise<void> {
  await instance.delete(`/images/${key}`);
}
