import * as yup from "yup";
export const signUpvalidationSchema = yup.object({
  fullName: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/\d/, "Password must contain a number"),
});
export const loginValidationSchema = yup.object({
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
});
