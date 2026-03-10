package auth

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestJWTMiddleware_ValidToken(t *testing.T) {
	cfg := TokenConfig{
		Secret:            "test-secret",
		AccessTokenExpiry: 15 * time.Minute,
	}
	token, _ := GenerateAccessToken("author-mid", cfg)

	var gotAuthorID string
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotAuthorID, _ = r.Context().Value(AuthorIDKey).(string)
		w.WriteHeader(http.StatusOK)
	})

	handler := JWTMiddleware(cfg.Secret)(next)
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.AddCookie(&http.Cookie{Name: "access_token", Value: token})
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
	if gotAuthorID != "author-mid" {
		t.Fatalf("expected author-mid in context, got %s", gotAuthorID)
	}
}

func TestJWTMiddleware_NoCookie(t *testing.T) {
	handler := JWTMiddleware("secret")(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t.Fatal("next handler should not be called")
	}))

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", rec.Code)
	}
}

func TestJWTMiddleware_InvalidToken(t *testing.T) {
	handler := JWTMiddleware("secret")(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t.Fatal("next handler should not be called")
	}))

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.AddCookie(&http.Cookie{Name: "access_token", Value: "invalid.token.here"})
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", rec.Code)
	}
}
