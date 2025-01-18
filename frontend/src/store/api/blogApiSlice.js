import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApiSlice = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.NODE === "development"
        ? "http://localhost:9090/api/blogs"
        : "/api/blogs",
  }),
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    createBlog: builder.mutation({
      query: (values) => ({
        url: "/create",
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Blog"],
    }),
    getBlogs: builder.query({
      query: () => "/",
      providesTags: ["Blog"],
    }),
    updateBlog: builder.mutation({
      query: ({ blogId, ...values }) => ({
        url: `/update/${blogId}`,
        method: "PUT",
        body: values,
      }),
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `/delete`,
        method: "DELETE",
        body: { blogId: blogId },
      }),
      invalidatesTags: ["Blog"],
    }),
    makeLike: builder.mutation({
      query: (values) => ({
        url: "/like",
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Blog"],
    }),
    makeComment: builder.mutation({
      query: (values) => ({
        url: "/comment",
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});
export const {
  useCreateBlogMutation,
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useMakeLikeMutation,
  useMakeCommentMutation,
} = blogApiSlice;
