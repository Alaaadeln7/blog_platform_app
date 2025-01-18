import { Loader } from "lucide-react";
import { useGetBlogsQuery } from "../../store/api/blogApiSlice";
import Blog from "./Blog";

export default function BlogsList() {
  const { data, isLoading, error } = useGetBlogsQuery();
  const blogs = data?.data || [];
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Error loading blogs: {error.message}</p>
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No blogs found.</p>
      </div>
    );
  }
  const printBlogs = blogs.map((item) => (
    <Blog
      key={item._id}
      title={item.title}
      description={item.description}
      image={item.image}
      blogId={item._id}
      likes={item.likes}
      comments={item.comments}
      creator={item.creator}
    />
  ));
  return <div>{printBlogs}</div>;
}
