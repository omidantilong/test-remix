import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts, getTodos } from "~/models/post.server";

export const loader = async () => {
  return json<LoaderData>({
    posts: await getPosts(),
    todos: await getTodos(),
  });
};

export default function Posts() {
  const { posts, todos } = useLoaderData() as LoaderData;

  return (
    <div className="wrapper">
      <main>
        <h1>Posts</h1>
        <div>
          {posts.map((post) => (
            <article key={post.slug}>
              <Link to={post.slug}>{post.title}</Link>
            </article>
          ))}
        </div>
        <h1>Todos</h1>
        <div>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </div>
        <hr />
        <Link to="admin" className="text-red-600 underline">
          Admin
        </Link>
      </main>
    </div>
  );
}

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
  todos: Awaited<ReturnType<typeof getTodos>>;
};
