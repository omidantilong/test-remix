import { Form, useActionData, useTransition } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { createPost } from "~/models/post.server";
import type { ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: ActionData = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");
  await new Promise((res) => setTimeout(res, 1000));
  await createPost({ title, slug, markdown });

  return redirect("/posts/admin");
};

export default function NewPost() {
  const errors = useActionData();
  const transition = useTransition();
  const isCreating = !!transition.submission;

  return (
    <Form method="post" className="admin-form">
      <p>
        <label>
          <span>Post Title:</span>
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label>
          <span>Post Slug: </span>
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input type="text" name="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        {errors?.markdown ? (
          <em className="text-red-600">{errors.markdown}</em>
        ) : null}
        <br />
        <textarea id="markdown" rows={20} name="markdown" />
      </p>
      <p className="text-right">
        <button disabled={isCreating} type="submit">
          {isCreating ? "Creating..." : "Create post"}
        </button>
      </p>
    </Form>
  );
}
