-- name: CreateAuthor :one
INSERT INTO authors (username, password_hash)
VALUES ($1, $2) RETURNING *;

-- name: GetAuthorByUsername :one
SELECT * FROM authors
WHERE username = $1 LIMIT 1;

-- name: CreateRefreshToken :one
INSERT INTO refresh_tokens (author_id, token_hash, expires_at)
VALUES ($1, $2, $3) RETURNING *;

-- name: GetRefreshToken :one
SELECT * FROM refresh_tokens
WHERE token_hash = $1 LIMIT 1;

-- name: DeleteRefreshToken :exec
DELETE FROM refresh_tokens
WHERE token_hash = $1;

-- name: DeleteRefreshTokenByAuthor :exec
DELETE FROM refresh_tokens
WHERE author_id = $1;