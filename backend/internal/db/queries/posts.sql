-- name: CreatePost :one
INSERT INTO posts (title, slug, content, status)
VALUES ($1, $2, $3, $4) RETURNING *;

-- name: GetPostBySlug :one
SELECT * FROM posts
WHERE slug = $1 LIMIT 1;

-- name: GetPublishedPosts :many
SELECT * FROM posts
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT $1 OFFSET $2;

-- name: GetPostsAdmin :many
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- name: UpdatePostByID :one
UPDATE posts SET
    title = $2,
    slug = $3,
    content = $4,
    excerpt = $5,
    status = $6,
    published_at = $7
WHERE id = $1 RETURNING *;

-- name: DeletePostByID :exec
DELETE FROM posts
WHERE id = $1;

-- name: GetPostTags :many
SELECT * FROM tags
JOIN post_tags ON post_tags.tag_id = tags.id
WHERE post_tags.post_id = $1;