# yeahjunheoBlog

Personal blog. Astro + Tailwind v4, deployed to Cloudflare Workers with a D1 database for post view counts.

Push to `main` → Cloudflare auto-deploys. No GitHub Action.

## Stack

- Astro 6, Tailwind v4, MDX
- Cloudflare Workers (worker + static assets via `@astrojs/cloudflare`)
- D1 (`VIEWS` binding) for view counts
- Fonts: Newsreader / Inter / JetBrains Mono via Google Fonts
- Asciinema casts via `asciinema-player`

## First-time setup on a new machine

```sh
pnpm install
npx wrangler d1 migrations apply blog-views --local
```

Node version is pinned via Volta (`22.23.1`). Volta picks it up automatically; without Volta, just install Node 22+.

## Daily workflow

```sh
pnpm dev        # local dev, D1 via miniflare
```

To add a post: drop a `.md` or `.mdx` file into `src/content/posts/` with frontmatter:

```yaml
---
title: "..."
publishedAt: 2026-06-30T11:00
published: true
excerpt: "..."         # optional
tags: ["..."]          # optional
---
```

Commit and push. CF rebuilds and deploys.

## Embedding a terminal recording

1. Drop the `.cast` file in `public/casts/`
2. In an `.mdx` post:

```mdx
import AsciinemaPlayer from "../../components/AsciinemaPlayer.astro";

<AsciinemaPlayer src="/casts/my-recording.cast" idleTimeLimit={2} />
```

## When you change `wrangler.jsonc` bindings

```sh
pnpm generate-types     # regenerates worker-configuration.d.ts
```

## When you add a D1 migration

Cloudflare's Git integration only runs `wrangler deploy` — it does **not** apply D1 migrations. Apply them yourself before pushing:

```sh
# Create the migration file under migrations/000X_*.sql, then:
npx wrangler d1 migrations apply blog-views --local     # local SQLite
npx wrangler d1 migrations apply blog-views --remote    # production D1
```

Only then commit and push.

## Manual deploy (if the auto-deploy ever breaks)

```sh
pnpm deploy
```

Now wipes `dist/`, `.astro/`, `node_modules/.astro/`, and `node_modules/.vite/` before building so stale routes (e.g. deleted posts) don't sneak into the upload. Astro persists content-collection data in `node_modules/.astro/data-store.json` between builds, so deleting only `.astro/` isn't enough — `pnpm clean` (or the `clean` step in `deploy`) handles it.

## Layout

```
src/
  content/posts/      # post markdown / mdx
  components/         # AsciinemaPlayer.astro
  pages/
    index.astro       # directory-listing-style post index
    posts/[id].astro  # post detail
    api/views/[id].ts # POST: increment count
    api/views.json.ts # GET:  { postId: count, ... }
  styles/global.css   # tailwind + font theme + link defaults
public/
  casts/              # .cast files
migrations/           # D1 migrations
```
