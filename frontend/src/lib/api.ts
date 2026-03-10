// --- Types ---

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface PostTag {
  id: string;
  name: string;
  slug: string;
  post_id: string;
  tag_id: string;
}

// --- API URL resolution ---
// Server-side: read from process.env at runtime
// Client-side: read from window.__API_URL injected by the layout

function getApiUrl(): string {
  if (typeof window !== "undefined") {
    return (window as any).__API_URL || "http://localhost:8080";
  }
  return process.env.API_URL || "http://localhost:8080";
}

// --- Server-side helpers (called from .astro frontmatter, no cookies) ---

export async function getPublishedPosts(
  limit = 10,
  offset = 0
): Promise<Post[]> {
  const url = getApiUrl();
  const res = await fetch(
    `${url}/api/posts?limit=${limit}&offset=${offset}`
  );
  if (!res.ok) return [];
  return (await res.json()) ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const url = getApiUrl();
  const res = await fetch(`${url}/api/posts/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getAllTags(): Promise<Tag[]> {
  const url = getApiUrl();
  const res = await fetch(`${url}/api/tags`);
  if (!res.ok) return [];
  return (await res.json()) ?? [];
}

export async function getPostsByTag(
  slug: string,
  limit = 10,
  offset = 0
): Promise<Post[]> {
  const url = getApiUrl();
  const res = await fetch(
    `${url}/api/tags/${slug}/posts?limit=${limit}&offset=${offset}`
  );
  if (!res.ok) return [];
  const rows = await res.json();
  // The backend returns joined rows with extra tag fields; map to Post shape
  return (rows ?? []).map((r: any) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    content: r.content,
    excerpt: r.excerpt,
    status: r.status,
    published_at: r.published_at,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
}

// --- Client-side helpers (called from <script>, sends cookies) ---

async function clientFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = getApiUrl();
  const res = await fetch(`${url}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (res.status === 401) {
    // Try refreshing the access token
    const refreshRes = await fetch(`${url}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      // Retry original request
      return fetch(`${url}${path}`, {
        credentials: "include",
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init.headers || {}),
        },
      });
    }
    // Refresh failed — redirect to login
    window.location.href = "/admin/login";
  }

  return res;
}

export async function login(
  username: string,
  password: string
): Promise<boolean> {
  const url = getApiUrl();
  const res = await fetch(`${url}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.ok;
}

export async function logout(): Promise<void> {
  const url = getApiUrl();
  await fetch(`${url}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getAdminPosts(): Promise<Post[]> {
  const res = await clientFetch("/api/admin/posts");
  if (!res.ok) return [];
  return (await res.json()) ?? [];
}

export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  status: string;
}): Promise<Post | null> {
  const res = await clientFetch("/api/admin/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function updatePost(
  id: string,
  data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    status: string;
    published_at?: string | null;
  }
): Promise<Post | null> {
  const res = await clientFetch(`/api/admin/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function deletePost(id: string): Promise<boolean> {
  const res = await clientFetch(`/api/admin/posts/${id}`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function createTag(data: {
  name: string;
  slug: string;
}): Promise<Tag | null> {
  const res = await clientFetch("/api/admin/tags", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function deleteTag(id: string): Promise<boolean> {
  const res = await clientFetch(`/api/admin/tags/${id}`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function getPostTags(postId: string): Promise<PostTag[]> {
  const res = await clientFetch(`/api/admin/posts/${postId}/tags`);
  if (!res.ok) return [];
  return (await res.json()) ?? [];
}

export async function addTagToPost(
  postId: string,
  tagId: string
): Promise<boolean> {
  const res = await clientFetch(`/api/admin/posts/${postId}/tags`, {
    method: "POST",
    body: JSON.stringify({ tag_id: tagId }),
  });
  return res.ok;
}

export async function removeTagFromPost(
  postId: string,
  tagId: string
): Promise<boolean> {
  const res = await clientFetch(`/api/admin/posts/${postId}/tags/${tagId}`, {
    method: "DELETE",
  });
  return res.ok;
}
