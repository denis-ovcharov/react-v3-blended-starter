import axios from "axios";
import { Post } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

export const fetchPosts = async (
  searchText: string,
  page: number
): Promise<{ posts: Post[]; totalCount: number }> => {
  const response = await axios.get<Post[]>("/posts", {
    params: {
      ...(searchText !== "" && {
        q: searchText,
      }),
      _page: page,
      _limit: 8,
    },
  });
  const totalCount = Number(response.headers["x-total-count"]);
  return {
    posts: response.data,
    totalCount,
  };
};

interface NewPost {
  title: string;
  body: string;
}

export const createPost = async (newPost: NewPost) => {
  const { data } = await axios.post<Post>("/posts", newPost);
  return data;
};

export const editPost = async (newDataPost: Post) => {
  const { data } = await axios.patch<Post>(`/posts/${newDataPost.id}`, newDataPost);
  return data;
};

export const deletePost = async (postId: Post["id"]) => {
  const { data } = await axios.delete<Post>(`/posts/${postId}`);
  return data;
};
