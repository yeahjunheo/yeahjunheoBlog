package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/yeahjun/blog/backend/internal/auth"
	db "github.com/yeahjun/blog/backend/internal/db/generated"
)

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	author, err := h.sqlc.GetAuthorByUsername(r.Context(), req.Username)
	if err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	if !auth.ComparePassword(author.PasswordHash, req.Password) {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	accessToken, err := auth.GenerateAccessToken(uuid.UUID(author.ID.Bytes).String(), h.tokenConfig)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	refreshToken, err := auth.GenerateRefreshToken()
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	_, err = h.sqlc.CreateRefreshToken(r.Context(), db.CreateRefreshTokenParams{
		AuthorID:  author.ID,
		TokenHash: auth.HashToken(refreshToken),
		ExpiresAt: pgtype.Timestamptz{
			Time:  time.Now().Add(h.tokenConfig.RefreshTokenExpiry),
			Valid: true,
		},
	})
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(h.tokenConfig.AccessTokenExpiry.Seconds()),
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Path:     "/api/auth",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(h.tokenConfig.RefreshTokenExpiry.Seconds()),
	})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "logged in"})
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	err = h.sqlc.DeleteRefreshToken(r.Context(), auth.HashToken(cookie.Value))
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   -1,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/api/auth",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   -1,
	})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "logged out"})
}

func (h *Handler) Refresh(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	tokenHash := auth.HashToken(cookie.Value)
	stored, err := h.sqlc.GetRefreshToken(r.Context(), tokenHash)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	if time.Now().After(stored.ExpiresAt.Time) {
		h.sqlc.DeleteRefreshToken(r.Context(), tokenHash)
		http.Error(w, "token expired", http.StatusUnauthorized)
		return
	}

	err = h.sqlc.DeleteRefreshToken(r.Context(), tokenHash)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	authorID := uuid.UUID(stored.AuthorID.Bytes).String()

	accessToken, err := auth.GenerateAccessToken(authorID, h.tokenConfig)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	newRefreshToken, err := auth.GenerateRefreshToken()
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	_, err = h.sqlc.CreateRefreshToken(r.Context(), db.CreateRefreshTokenParams{
		AuthorID:  stored.AuthorID,
		TokenHash: auth.HashToken(newRefreshToken),
		ExpiresAt: pgtype.Timestamptz{
			Time:  time.Now().Add(h.tokenConfig.RefreshTokenExpiry),
			Valid: true,
		},
	})
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(h.tokenConfig.AccessTokenExpiry.Seconds()),
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    newRefreshToken,
		Path:     "/api/auth",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(h.tokenConfig.RefreshTokenExpiry.Seconds()),
	})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "refreshed"})
}
