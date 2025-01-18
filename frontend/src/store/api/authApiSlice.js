import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.NODE === "development"
        ? "http://localhost:9090/api/auth"
        : "/api/auth",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    check: builder.query({
      query: () => "/check",
      providesTags: ["User"],
    }),
    signup: builder.mutation({
      query: (values) => ({
        url: "/register",
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation({
      query: (values) => ({
        url: "/login",
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (values) => ({
        url: "/update-profile",
        method: "PUT",
        body: values,
      }),
      invalidatesTags: ["User"],
    }),
    updateInfo: builder.mutation({
      query: (values) => ({
        url: "/update",
        method: "PUT",
        body: values,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCheckQuery,
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useUpdateInfoMutation,
} = authApiSlice;
