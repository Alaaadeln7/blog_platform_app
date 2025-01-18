import { Link } from "react-router-dom";
import BlogsList from "./BlogsList";

export default function Blogs() {
  return (
    <>
      <div className="pt-20 flex justify-center items-center">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8 flex justify-center">
            <Link to={"/create-blog"} className="btn btn-info">
              create blog
            </Link>
          </div>
          <BlogsList />
        </div>
      </div>
    </>
  );
}
