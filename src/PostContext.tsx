import { faker } from "@faker-js/faker";
import { createContext, useContext, useMemo, useState } from "react";

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

const PostContext = createContext<PostContextProp | undefined>(undefined);

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

  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
      onAddPost: handleAddPost,
    };
  }, [searchQuery, searchedPosts]);
  return (
    <PostContext.Provider value={value}>
      <>{children}</>
    </PostContext.Provider>
  );
}

function usePost() {
  const context = useContext(PostContext);

  if (context === undefined)
    throw new Error(
      "contex is undefined, post context was used outside of the post provider"
    );

  return context;
}
export { PostProvider, usePost };
// solution to not getting error on line 76 is creating a hook file for this usePost for fast refresh to work properly the error is happening because we are export two component at the same time.
