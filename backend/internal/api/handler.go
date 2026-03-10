package api

import (
	"github.com/yeahjun/blog/backend/internal/auth"
	db "github.com/yeahjun/blog/backend/internal/db/generated"
)

type Handler struct {
	sqlc          db.Querier
	tokenConfig   auth.TokenConfig
	allowedOrigin string
}

func NewHandler(queries db.Querier, tokenConfig auth.TokenConfig, allowedOrigin string) *Handler {
	return &Handler{
		sqlc:          queries,
		tokenConfig:   tokenConfig,
		allowedOrigin: allowedOrigin,
	}
}
