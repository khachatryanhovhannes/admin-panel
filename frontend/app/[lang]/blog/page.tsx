
import { fetchBlogData } from "@/lib/api";

async function Blog({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const blogs = await fetchBlogData(lang);
  console.log(blogs);

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <div
            dangerouslySetInnerHTML={{ __html: blog.content }}
          ></div>
        </div>
      ))}
    </div>
  );
}

export default Blog;
