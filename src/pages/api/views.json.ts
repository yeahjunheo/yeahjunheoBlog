import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async () => {
  const { results } = await env.VIEWS
    .prepare("SELECT post_id, count FROM views")
    .all<{ post_id: string; count: number }>();

  const counts: Record<string, number> = {};
  for (const r of results ?? []) counts[r.post_id] = r.count;

  return new Response(JSON.stringify(counts), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=30",
    },
  });
};
