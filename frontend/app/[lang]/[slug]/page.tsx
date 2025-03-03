import { fetchPageData } from "@/lib/api";
import { notFound } from "next/navigation";
import React from "react";

async function DefaultPage({
  params,
}: {
  params: { slug: string; lang: string };
}) {
  const { slug, lang } = await params;
  const pageContent = await fetchPageData(lang, slug);

  if (
    !pageContent ||
    !pageContent.page_content ||
    !pageContent.page_content[0] ||
    !pageContent.page_content[0].content
  ) {
    notFound();
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: pageContent.page_content[0].content }}
    ></div>
  );
}

export default DefaultPage;
