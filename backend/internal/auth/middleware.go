package auth

import (
	"context"
	"encoding/json"
	"net/http"
)

type contextKey string

const AuthorIDKey contextKey = "authorID"

func JWTMiddleware(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			cookie, err := r.Cookie("access_token")
			if err != nil {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "unauthorized"})
				return
			}
			authorID, err := ValidateAccessToken(cookie.Value, secret)
			if err != nil {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "unauthorized"})
				return
			}
			ctx := context.WithValue(r.Context(), AuthorIDKey, authorID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
