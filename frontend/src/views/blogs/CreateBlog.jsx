import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCreateBlogMutation } from "../../store/api/blogApiSlice";
import { Image, Loader2, X } from "lucide-react";
import { useCheckQuery } from "../../store/api/authApiSlice";
import { useEffect, useRef, useState } from "react";
import { validtaionCreateBlog } from "../../utils/validation";

export default function CreateBlog() {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [createBlog, { data: dataCreated, isLoading }] =
    useCreateBlogMutation();
  const { data: user } = useCheckQuery();
  const userId = user?._id;
  console.log(dataCreated);
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      image: null,
    },
    validationSchema: validtaionCreateBlog,
    onSubmit: async (values) => {
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }
      values.image = imagePreview;
      try {
        await createBlog({ ...values, userId }).unwrap();
        toast.success("Blog created successfully!");
        navigate("/blogs");
      } catch (error) {
        console.log(error);
        toast.error(error?.data?.message || "An error occurred");
      }
    },
  });

  useEffect(() => {
    const { title, description } = formik.errors;
    if (formik.touched.title && title) {
      toast.error(title);
    }
    if (formik.touched.description && description) {
      toast.error(description);
    }
  }, [formik.errors, formik.touched]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result); // Base64
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select an image file");
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="h-screen pt-20 flex justify-center items-center">
      <div className="bg-base-300 rounded-xl p-6 max-w-4xl w-full">
        <button className="btn btn-info" onClick={() => navigate(-1)}>
          Back
        </button>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Title</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full pl-10"
              placeholder="Title"
              id="title"
              name="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Description"
              id="description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            ></textarea>
          </div>
          <div className="w-full flex justify-start items-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button
              type="button"
              className={`btn btn-circle ${
                imagePreview ? "text-emerald-500" : "text-zinc-400"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={20} />
            </button>
          </div>
          {imagePreview && (
            <div className="mb-3 flex items-center gap-2">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-80 h-80 object-cover rounded-lg border border-zinc-700"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                  type="button"
                >
                  <X className="size-3" />
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 /> : "Create Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}
