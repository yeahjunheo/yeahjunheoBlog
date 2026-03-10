package auth

import (
	"context"
	"net/http"
)

type contextKey string

const AuthorIDKey contextKey = "authorID"

func JWTMiddleware(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			cookie, err := r.Cookie("access_token")
			if err != nil {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}
			authorID, err := ValidateAccessToken(cookie.Value, secret)
			if err != nil {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}
			ctx := context.WithValue(r.Context(), AuthorIDKey, authorID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
