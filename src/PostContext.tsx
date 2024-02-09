import { faker } from "@faker-js/faker";
import { createContext, useState } from "react";

type prop = {
  children: React.ReactNode;
};

type Post = {
  title: string;
  body: string;
};

type PostContextProp = {
  posts: Post[];
  onClearPosts(): void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onAddPost: (post: Post) => void;
};

export const PostContext = createContext<PostContextProp>(
  {} as PostContextProp
);

function PostProvider({ children }: prop) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  function createRandomPost() {
    return {
      title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      body: faker.hacker.phrase(),
    };
  }

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post: Post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
        onAddPost: handleAddPost,
      }}
    >
      <>{children}</>
    </PostContext.Provider>
  );
}

export default PostProvider;
