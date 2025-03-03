import { fetchBlogData } from "@/lib/api";
import Link from "next/link";

async function Blog({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const blogs = await fetchBlogData(lang);
  console.log(blogs);

  return (
    <div>
      {blogs.map((blog) => (
        <Link href={"/" + lang + "/blog/" + blog.slug} key={blog.slug}>
          <h2>{blog.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
        </Link>
      ))}
    </div>
  );
}

export default Blog;
