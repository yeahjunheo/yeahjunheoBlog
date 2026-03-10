-- name: CreateTag :one
INSERT INTO tags (name, slug)
VALUES ($1, $2) RETURNING *;

-- name: GetAllTags :many
SELECT * FROM tags;

-- name: DeleteTagByID :exec
DELETE FROM tags
WHERE id = $1;

-- name: GetPostByTagSlug :many
SELECT * FROM posts
JOIN post_tags ON post_tags.post_id = posts.id
JOIN tags ON tags.id = post_tags.tag_id
WHERE tags.slug = $1
ORDER BY posts.published_at DESC
LIMIT $2 OFFSET $3;

-- name: AddTagToPost :exec
INSERT INTO post_tags (post_id, tag_id)
VALUES ($1, $2);

-- name: RemoveTagFromPost :exec
DELETE FROM post_tags
WHERE post_id = $1 AND tag_id = $2;