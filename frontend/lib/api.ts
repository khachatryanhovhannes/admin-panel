export async function fetchLanguages() {
  const res = await fetch("http://localhost:3000/frontend/languages");
  return res.json();
}

export async function fetchNavigation(lang: string) {
  const res = await fetch("http://localhost:3000/frontend/navigation");
  const data = await res.json();
  return data[lang] || [];
}

export async function fetchPageContent(lang: string) {
  const res = await fetch(`http://localhost:3000/frontend/content`);
  const data = await res.json();

  return {
    ...data[lang],
    ...data.constants,
  };
}

export async function fetchPageData(lang: string, slug: string) {
  console.log(slug, lang);
  try {
    const res = await fetch(
      `http://localhost:3000/frontend/pages?slug=${slug}&language=${lang}&type=DYNAMIC`
    );

    console.log(res);

    const data = (await res.json()) || {};

    return data || {};
  } catch {
    return {};
  }
}
