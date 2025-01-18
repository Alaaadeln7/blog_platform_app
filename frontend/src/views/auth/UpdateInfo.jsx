import { useFormik } from "formik";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  useCheckQuery,
  useUpdateInfoMutation,
} from "../../store/api/authApiSlice";
import { Loader2, Mail, User } from "lucide-react";

export default function UpdateInfo() {
  const [updateInfo, { isLoading }] = useUpdateInfoMutation();
  const { data: user } = useCheckQuery();
  const formik = useFormik({
    initialValues: {
      fullName: user.fullName,
      email: user.email,
    },
    onSubmit: async (values) => {
      try {
        await updateInfo(values);
        toast.success("updating is successfully");
      } catch (error) {
        toast.error(error.message);
      }
    },
  });
  useEffect(() => {
    if (formik.touched.fullName && formik.errors.fullName) {
      toast.error(formik.errors.fullName);
    }
    if (formik.touched.email && formik.errors.email) {
      toast.error(formik.errors.email);
    }
    if (formik.touched.password && formik.errors.password) {
      toast.error(formik.errors.password);
    }
  }, [formik.errors, formik.touched]);
  return (
    <section className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10 ${
                    formik.touched.fullName &&
                    formik.errors.fullName &&
                    "border-red-500"
                  }`}
                  placeholder={
                    formik.touched.fullName && formik.errors.fullName
                      ? `${formik.errors.fullName}`
                      : "Full name"
                  }
                  id="fullName"
                  name="fullName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullName}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10 ${
                    formik.touched.email &&
                    formik.errors.email &&
                    "border-red-500"
                  }`}
                  placeholder="example@gmail.com"
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
            </div>

            {/* <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Password</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="size-5 text-base-content/40" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className={`input input-bordered w-full pl-10 ${
                formik.touched.password &&
                formik.errors.password &&
                "border-red-500"
              }`}
              placeholder="**********"
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="size-5 text-base-content/40" />
              ) : (
                <Eye className="size-5 text-base-content/40" />
              )}
            </button>
          </div>
        </div> */}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Update Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
