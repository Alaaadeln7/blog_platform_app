import * as yup from "yup";
export const validtaionCreateBlog = yup.object({
  title: yup.string().required("title is required").min(5),
  description: yup.string().required("description is required").min(10),
});
