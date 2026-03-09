package api

import (
	"github.com/yeahjun/blog/backend/internal/auth"
	db "github.com/yeahjun/blog/backend/internal/db/generated"
)

type Handler struct {
	sqlc        *db.Queries
	tokenConfig auth.TokenConfig
}

func NewHandler(queries *db.Queries, tokenConfig auth.TokenConfig) *Handler {
	return &Handler{
		sqlc:        queries,
		tokenConfig: tokenConfig,
	}
}
