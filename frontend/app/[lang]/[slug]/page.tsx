import { fetchPageData } from "@/lib/api";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; lang: string };
}) {
  const { slug, lang } = params;
  const pageContent = await fetchPageData(lang, slug);

  if (
    !pageContent ||
    !pageContent.page_content ||
    !pageContent.page_content[0] ||
    !pageContent.page_content[0].content
  ) {
    notFound();
  }

  return {
    title: pageContent.page_content[0]?.meta_title || "Page Not Found",
    description:
      pageContent.page_content[0]?.meta_description ||
      "This page does not exist.",
  };
}

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
    return notFound();
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: pageContent.page_content[0].content }}
    ></div>
  );
}

export default DefaultPage;
