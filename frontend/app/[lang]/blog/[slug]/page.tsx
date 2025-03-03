import { fetchPageData } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function SingleBlog({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const pageContent = await fetchPageData(lang, slug, "BLOG");
  console.log(pageContent);
  if (
    !pageContent ||
    !pageContent.page_content ||
    !pageContent.page_content[0] ||
    !pageContent.page_content[0].content
  ) {
    return notFound();
  }
  return (
    <div
      dangerouslySetInnerHTML={{ __html: pageContent.page_content[0].content }}
    ></div>
  );
}
