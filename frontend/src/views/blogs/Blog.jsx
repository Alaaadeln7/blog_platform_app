import {
  Loader2,
  MessageCircle,
  Send,
  SlidersHorizontal,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useCheckQuery } from "../../store/api/authApiSlice";
import {
  useDeleteBlogMutation,
  useMakeCommentMutation,
  useMakeLikeMutation,
} from "../../store/api/blogApiSlice";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useState } from "react";
import LazyImage from "../../components/LazyImage";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
export default function Blog(props) {
  const [showComments, setShowComments] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { data: user, isLoading } = useCheckQuery();
  const [makeLike] = useMakeLikeMutation();
  const [makeComment] = useMakeCommentMutation();
  const [deleteBlog, { isLoading: loadDelete }] = useDeleteBlogMutation();
  const navigate = useNavigate();
  const userId = user?._id;
  const blogId = props.blogId;

  const handleDelete = (blogId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBlog(blogId);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };
  const handleMakeLike = () => {
    if (user) {
      makeLike({ userId, blogId }).unwrap();
    } else {
      navigate("/login");
    }
  };

  const formik = useFormik({
    initialValues: { comment: "" },
    onSubmit: (comment) => {
      if (!comment.comment.trim()) {
        toast.error("Comment cannot be empty!");
        return;
      }
      if (user) {
        makeComment({ userId, blogId, comment: comment.comment });
        formik.resetForm();
      } else {
        navigate("/login");
      }
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div
      className={`card bg-base-100 w-full max-w-100 shadow-sm my-5 border border-gray-500 `}
    >
      <div
        className={`flex items-center pb-2 p-5 ${
          props.creator._id === userId ? "justify-between" : "justify-end"
        }`}
      >
        {props.creator._id === userId && (
          <details className="dropdown">
            <summary className="btn m-1">
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li>
                <button className="btn" onClick={() => handleDelete(blogId)}>
                  {loadDelete ? (
                    <Loader2 className="w-5 h-5 text-red-600" />
                  ) : (
                    <Trash2 className="w-5 h-5 text-red-600" />
                  )}
                </button>
              </li>
            </ul>
          </details>
        )}
        <div className="flex gap-3">
          <h4>{props.creator.fullName}</h4>
          <div className="w-10">
            <LazyImage
              className="w-10 h-10 rounded-full object-cover"
              src={props.creator.avatar}
              alt={props.creator.fullName}
            />
          </div>
        </div>
      </div>
      {props.image && (
        <figure>
          <LazyImage src={props.image} alt="Shoes" className="w-96" />
        </figure>
      )}
      <div className="card-body">
        <h2
          className="card-title"
          dir={
            /[\u0600-\u06FF]/.test(props.description + props.title)
              ? "rtl"
              : "ltr"
          }
        >
          {props.title}
        </h2>
        <div
          className="description"
          dir={
            /[\u0600-\u06FF]/.test(props.description + props.title)
              ? "rtl"
              : "ltr"
          }
        >
          {props.description.length > 100 ? (
            showFullDescription ? (
              <>
                <p>{props.description}</p>
                <button
                  className="btn mt-2"
                  onClick={() => setShowFullDescription(false)}
                >
                  Show Less
                </button>
              </>
            ) : (
              <>
                <p>{props.description.substring(0, 100) + "..."}</p>
                <button
                  className="btn mt-2"
                  onClick={() => setShowFullDescription(true)}
                >
                  Show More
                </button>
              </>
            )
          ) : (
            <p>{props.description}</p>
          )}
        </div>
        <div className="py-2 px-4 flex justify-between items-center gap-2 flex-wrap w-full">
          <div className="flex gap-4">
            <span className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-900" />
              <p>{props.comments.length}</p>
            </span>
          </div>
          <span className="flex items-center gap-2">
            <p>{props.likes.length}</p>
            <ThumbsUp className="w-4 h-4 text-blue-900" />
          </span>
        </div>
        <div className="w-full card-actions justify-around items-center gap-3 py-2 border-y-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="btn bg-transparent text-gray-500 text-xs"
          >
            <span className="hidden sm:inline">comments</span>
            <MessageCircle className="w-5 h-5" />
          </button>
          <button
            onClick={handleMakeLike}
            className={`btn  text-gray-500 text-xs ${
              props.likes.includes(userId) ? "text-blue-600 bg-white" : ""
            }`}
          >
            <span className="hidden sm:inline">like</span>
            <ThumbsUp
              className={`w-5 h-5 ${
                props.likes.includes(userId) ? "text-blue-600" : ""
              }`}
            />
          </button>
        </div>
        <div>
          <form
            className="w-full flex justify-center items-center gap-3"
            onSubmit={formik.handleSubmit}
          >
            <div className="form-control w-full pt-3">
              <input
                type="text"
                className={`input input-bordered w-full pl-10 rounded-full ${
                  formik.touched.comment &&
                  formik.errors.comment &&
                  "border-red-500"
                }`}
                placeholder={
                  formik.touched.comment && formik.errors.comment
                    ? `${formik.errors.comment}`
                    : "comment..."
                }
                id="comment"
                name="comment"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.comment}
              />
            </div>
            <button className="btn btn-primary rounded-full" type="submit">
              <Send className="w-5 h-5 text-white" />
            </button>
          </form>
        </div>
        {showComments && (
          <div className="comments-section">
            {props.comments?.map((comment) => (
              <div
                key={comment._id}
                className="comment flex items-start gap-3 m-5"
              >
                {comment.creator.avatar && (
                  <LazyImage
                    src={comment.creator.avatar}
                    alt="Attachment"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div className="chat-bubble flex flex-col">
                  {comment.creator?.fullName && (
                    <p className="text-sm text-gray-400">
                      {" "}
                      {comment.creator?.fullName}
                    </p>
                  )}
                  {comment.comment && <p>{comment.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
