import { AxiosResponse } from "axios";
import instance from "./axios.config";

export async function fetchLanguages() {
  const res = await instance.get("/frontend/languages");
  return res.data;
}

export async function fetchNavigation(lang: string) {
  const response: AxiosResponse<Record<string, string>> = await instance.get(
    "/frontend/navigation"
  );
  return response.data[lang] || [];
}

export async function fetchPageContent(lang: string) {
  const response = await instance.get(`/frontend/content`);

  return {
    ...response.data[lang],
    ...response.data.constants,
  };
}
export async function fetchPageData(
  lang: string,
  slug: string,
  type = "DYNAMIC"
) {
  console.log(slug, lang);
  try {
    const response = await instance.get(
      `/frontend/pages?slug=${slug}&language=${lang}&type=${type}`
    );

    return response.data || {};
  } catch (err) {
    console.error(err);
    return {};
  }
}

export async function fetchBlogData(lang: string, skip = 0, take = 10) {
  const response = await instance.get(
    `/frontend/blog?type=BLOG&language=${lang}&skip=${skip}&take=${take}`
  );

  console.log(response.data || {});

  return response.data
    .filter((data) => data.page_content.length)
    .map((data) => {
      return { slug: data.slug, ...data.page_content[0]! };
    });
}
