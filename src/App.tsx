import { useEffect, useState, memo } from "react";
import { faker } from "@faker-js/faker";
import { PostProvider, usePost } from "./PostContext";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function App() {
  const [isFakeDark, setIsFakeDark] = useState(false);

  // Derived state. These are the posts that will actually be displayed

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
      <PostProvider>
        <Header />
        <Main />
        <Archive />
        <Footer />
      </PostProvider>
    </section>
  );
}

const Header = memo(function Header() {
  const { onClearPosts } = usePost();

  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts />
        <button onClick={() => onClearPosts()}>Clear posts</button>
      </div>
    </header>
  );
});

function SearchPosts() {
  const { searchQuery, setSearchQuery } = usePost();

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

function Results() {
  const { posts } = usePost();
  return <p>🚀 {posts.length} atomic posts found</p>;
}

const Main = memo(() => {
  return (
    <main>
      <FormAddPost />
      <Posts />
    </main>
  );
});

const Posts = memo(function Posts() {
  const { posts } = usePost();

  return (
    <section>
      <List posts={posts} />
    </section>
  );
});

function FormAddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { onAddPost } = usePost();

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

function List({ posts }: { posts: Post[] }) {
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

const Archive = memo(function Archive() {
  const { onAddPost } = usePost();
  // Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick 😉
  const [posts] = useState(() =>
    // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 30 }, () => createRandomPost())
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
});

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️ by Anon sols</footer>;
}

export default App;
