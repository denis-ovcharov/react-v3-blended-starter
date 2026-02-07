import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Toaster } from "react-hot-toast";
import { Post } from "../../types/post";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import EditPostForm from "../EditPostForm/EditPostForm";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [isEditForm, setIsEditForm] = useState(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);

  const { data } = useQuery({
    queryKey: ["posts", query, page],
    queryFn: () => fetchPosts(query, page),
    placeholderData: keepPreviousData,
  });
  console.log(data);

  const handleSearch = useDebouncedCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  }, 500);

  const posts = data?.posts ?? [];
  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / 8) : 0;

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditedPost(null);
    // setIsEditForm(!isEditForm);
    // setIsCreateForm(!isCreateForm);
  };
  const toggleIsCreate = () => {
    setIsCreateForm(!isCreateForm);
  };

  const toggleEditPost = (post?: Post | null) => {
    if (post) setEditedPost(post);
    setIsEditForm(!isEditForm);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} value={query} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
        )}
        <button
          className={css.button}
          onClick={() => {
            toggleModal();
            toggleIsCreate();
          }}
        >
          Create post
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          {isCreateForm && (
            <CreatePostForm
              onClose={() => {
                toggleIsCreate();
                toggleModal();
              }}
            />
          )}
          {isEditForm && editedPost && (
            <EditPostForm
              initialValues={editedPost}
              onClose={() => {
                toggleModal();
                toggleEditPost();
                setEditedPost(null);
              }}
            />
          )}
        </Modal>
      )}

      {posts.length > 0 && (
        <PostList posts={posts} toggleModal={toggleModal} toggleEditPost={toggleEditPost} />
      )}
      <Toaster position="top-right" />
    </div>
  );
}
