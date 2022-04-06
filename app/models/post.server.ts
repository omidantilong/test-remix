import { prisma } from "~/db.server";
import type { Post } from "@prisma/client";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type { Post };

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function getTodos(): Promise<Array<Todo>> {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/");

  const data = res.ok ? await res.json() : null;

  return data?.slice(0, 20) || [];
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  return prisma.post.create({ data: post });
}
