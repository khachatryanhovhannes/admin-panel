import { fetchPageContent } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const content = await fetchPageContent(params.lang);
  return {
    title: content.metaTitle,
    description: content.metaDescription,
  };
}

export default async function Home({ params }: { params: { lang: string } }) {
  const content = await fetchPageContent(params.lang);

  return (
    <main>
      <h1>{content.COMPANY_NAME}</h1>
      <h3>{content.HOME_HERO_TITLE}</h3>
      <p>{content.HOME_HERO_DESCRIPTION}</p>
    </main>
  );
}
