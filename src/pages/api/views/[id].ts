import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const POST: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return new Response("missing id", { status: 400 });

  await env.VIEWS
    .prepare(
      `INSERT INTO views (post_id, count) VALUES (?, 1)
       ON CONFLICT(post_id) DO UPDATE SET count = count + 1`,
    )
    .bind(id)
    .run();

  return new Response(null, { status: 204 });
};
