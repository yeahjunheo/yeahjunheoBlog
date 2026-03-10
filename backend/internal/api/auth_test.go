package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/yeahjun/blog/backend/internal/auth"
	db "github.com/yeahjun/blog/backend/internal/db/generated"
)

func TestLogin_Success(t *testing.T) {
	hashed, _ := auth.HashPassword("password123")
	authorID := pgtype.UUID{Bytes: [16]byte{1}, Valid: true}

	mock := &mockQuerier{
		GetAuthorByUsernameFunc: func(ctx context.Context, username string) (db.Author, error) {
			return db.Author{
				ID:           authorID,
				Username:     "admin",
				PasswordHash: hashed,
			}, nil
		},
		CreateRefreshTokenFunc: func(ctx context.Context, arg db.CreateRefreshTokenParams) (db.RefreshToken, error) {
			return db.RefreshToken{}, nil
		},
	}

	h := newTestHandler(mock)
	body := `{"username":"admin","password":"password123"}`
	req := httptest.NewRequest(http.MethodPost, "/api/auth/login", strings.NewReader(body))
	rec := httptest.NewRecorder()

	h.Login(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}

	cookies := rec.Result().Cookies()
	var hasAccess, hasRefresh bool
	for _, c := range cookies {
		if c.Name == "access_token" && c.Value != "" {
			hasAccess = true
		}
		if c.Name == "refresh_token" && c.Value != "" {
			hasRefresh = true
		}
	}
	if !hasAccess {
		t.Fatal("expected access_token cookie")
	}
	if !hasRefresh {
		t.Fatal("expected refresh_token cookie")
	}
}

func TestLogin_BadJSON(t *testing.T) {
	h := newTestHandler(&mockQuerier{})
	req := httptest.NewRequest(http.MethodPost, "/api/auth/login", strings.NewReader("not json"))
	rec := httptest.NewRecorder()

	h.Login(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rec.Code)
	}
}

func TestLogin_UserNotFound(t *testing.T) {
	mock := &mockQuerier{
		GetAuthorByUsernameFunc: func(ctx context.Context, username string) (db.Author, error) {
			return db.Author{}, fmt.Errorf("no rows")
		},
	}

	h := newTestHandler(mock)
	body := `{"username":"unknown","password":"pass"}`
	req := httptest.NewRequest(http.MethodPost, "/api/auth/login", strings.NewReader(body))
	rec := httptest.NewRecorder()

	h.Login(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", rec.Code)
	}
}

func TestLogin_WrongPassword(t *testing.T) {
	hashed, _ := auth.HashPassword("correct")
	mock := &mockQuerier{
		GetAuthorByUsernameFunc: func(ctx context.Context, username string) (db.Author, error) {
			return db.Author{
				ID:           pgtype.UUID{Bytes: [16]byte{1}, Valid: true},
				Username:     "admin",
				PasswordHash: hashed,
			}, nil
		},
	}

	h := newTestHandler(mock)
	body := `{"username":"admin","password":"wrong"}`
	req := httptest.NewRequest(http.MethodPost, "/api/auth/login", strings.NewReader(body))
	rec := httptest.NewRecorder()

	h.Login(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", rec.Code)
	}
}

func TestLogout_Success(t *testing.T) {
	mock := &mockQuerier{
		DeleteRefreshTokenFunc: func(ctx context.Context, tokenHash string) error {
			return nil
		},
	}

	h := newTestHandler(mock)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/logout", nil)
	req.AddCookie(&http.Cookie{Name: "refresh_token", Value: "some-token"})
	rec := httptest.NewRecorder()

	h.Logout(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}

	cookies := rec.Result().Cookies()
	for _, c := range cookies {
		if c.Name == "access_token" && c.MaxAge != -1 {
			t.Fatal("expected access_token cookie to be cleared")
		}
		if c.Name == "refresh_token" && c.MaxAge != -1 {
			t.Fatal("expected refresh_token cookie to be cleared")
		}
	}
}

func TestLogout_NoCookie(t *testing.T) {
	h := newTestHandler(&mockQuerier{})
	req := httptest.NewRequest(http.MethodPost, "/api/auth/logout", nil)
	rec := httptest.NewRecorder()

	h.Logout(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", rec.Code)
	}
}

func TestRefresh_Success(t *testing.T) {
	authorID := pgtype.UUID{Bytes: [16]byte{2}, Valid: true}
	rawToken := "original-refresh-token"

	mock := &mockQuerier{
		GetRefreshTokenFunc: func(ctx context.Context, tokenHash string) (db.RefreshToken, error) {
			return db.RefreshToken{
				AuthorID:  authorID,
				TokenHash: tokenHash,
				ExpiresAt: pgtype.Timestamptz{
					Time:  time.Now().Add(24 * time.Hour),
					Valid: true,
				},
			}, nil
		},
		DeleteRefreshTokenFunc: func(ctx context.Context, tokenHash string) error {
			return nil
		},
		CreateRefreshTokenFunc: func(ctx context.Context, arg db.CreateRefreshTokenParams) (db.RefreshToken, error) {
			return db.RefreshToken{}, nil
		},
	}

	h := newTestHandler(mock)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/refresh", nil)
	req.AddCookie(&http.Cookie{Name: "refresh_token", Value: rawToken})
	rec := httptest.NewRecorder()

	h.Refresh(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}

	var resp map[string]string
	json.NewDecoder(rec.Body).Decode(&resp)
	if resp["message"] != "refreshed" {
		t.Fatalf("expected 'refreshed' message, got %v", resp)
	}
}

func TestRefresh_Expired(t *testing.T) {
	mock := &mockQuerier{
		GetRefreshTokenFunc: func(ctx context.Context, tokenHash string) (db.RefreshToken, error) {
			return db.RefreshToken{
				AuthorID:  pgtype.UUID{Bytes: [16]byte{3}, Valid: true},
				TokenHash: tokenHash,
				ExpiresAt: pgtype.Timestamptz{
					Time:  time.Now().Add(-1 * time.Hour),
					Valid: true,
				},
			}, nil
		},
		DeleteRefreshTokenFunc: func(ctx context.Context, tokenHash string) error {
			return nil
		},
	}

	h := newTestHandler(mock)
	req := httptest.NewRequest(http.MethodPost, "/api/auth/refresh", nil)
	req.AddCookie(&http.Cookie{Name: "refresh_token", Value: "expired-token"})
	rec := httptest.NewRecorder()

	h.Refresh(rec, req)

	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", rec.Code)
	}
}
