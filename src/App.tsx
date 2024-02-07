import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function App() {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isFakeDark, setIsFakeDark] = useState(false);

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

  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).

  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );

  return (
    <section>
      <button
        onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
        className="btn-fake-dark-mode"
      >
        {isFakeDark ? "☀️" : "🌙"}
      </button>

      <Header
        posts={searchedPosts}
        onClearPosts={handleClearPosts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Main posts={searchedPosts} onAddPost={handleAddPost} />
      <Archive onAddPost={handleAddPost} />
      <Footer />
    </section>
  );
}

type postsProp = {
  title: string;
  body: string;
};

type headerProp = {
  posts: postsProp[];
  onClearPosts(): void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

function Header({
  posts,
  onClearPosts,
  searchQuery,
  setSearchQuery,
}: headerProp) {
  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results posts={posts} />
        <SearchPosts
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

type searchedPostsProp = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};
function SearchPosts({ searchQuery, setSearchQuery }: searchedPostsProp) {
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

type Post = {
  title: string;
  body: string;
};

function Results({ posts }: { posts: postsProp[] }) {
  return <p>🚀 {posts.length} atomic posts found</p>;
}

type mainProp = {
  posts: postsProp[];
  onAddPost(post: Post): void;
};
function Main({ posts, onAddPost }: mainProp) {
  return (
    <main>
      <FormAddPost onAddPost={onAddPost} />
      <Posts posts={posts} />
    </main>
  );
}

function Posts({ posts }: { posts: postsProp[] }) {
  return (
    <section>
      <List posts={posts} />
    </section>
  );
}

function FormAddPost({ onAddPost }: { onAddPost(post: Post): void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const post = { title, body };
  const handleSubmit = function (e: React.FormEvent) {
    e.preventDefault();
    if (!body || !title) return;
    onAddPost(post);
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

function List({ posts }: { posts: postsProp[] }) {
  return (
    <ul>
      {posts.map((post, i) => (
        <li key={i}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Archive({ onAddPost }: { onAddPost(post: Post): void }) {
  // Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick 😉
  const [posts] = useState(() =>
    // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 10000 }, () => createRandomPost())
  );

  const [showArchive, setShowArchive] = useState(false);

  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => onAddPost(post)}>Add as new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️ by Anon sols</footer>;
}

export default App;
