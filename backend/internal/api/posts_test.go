package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/yeahjun/blog/backend/internal/db/generated"
)

func TestListPublishedPosts_Success(t *testing.T) {
	mock := &mockQuerier{
		GetPublishedPostsFunc: func(ctx context.Context, arg db.GetPublishedPostsParams) ([]db.Post, error) {
			return []db.Post{
				{Title: "Post 1", Slug: "post-1"},
				{Title: "Post 2", Slug: "post-2"},
			}, nil
		},
	}

	h := newTestHandler(mock)
	req := httptest.NewRequest(http.MethodGet, "/api/posts?limit=5", nil)
	rec := httptest.NewRecorder()

	h.ListPublishedPosts(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}

	var posts []db.Post
	json.NewDecoder(rec.Body).Decode(&posts)
	if len(posts) != 2 {
		t.Fatalf("expected 2 posts, got %d", len(posts))
	}
}

func TestListPublishedPosts_DefaultLimit(t *testing.T) {
	var gotLimit int32
	mock := &mockQuerier{
		GetPublishedPostsFunc: func(ctx context.Context, arg db.GetPublishedPostsParams) ([]db.Post, error) {
			gotLimit = arg.Limit
			return []db.Post{}, nil
		},
	}

	h := newTestHandler(mock)
	req := httptest.NewRequest(http.MethodGet, "/api/posts", nil)
	rec := httptest.NewRecorder()

	h.ListPublishedPosts(rec, req)

	if gotLimit != 10 {
		t.Fatalf("expected default limit 10, got %d", gotLimit)
	}
}

func TestGetPost_Success(t *testing.T) {
	mock := &mockQuerier{
		GetPostBySlugFunc: func(ctx context.Context, slug string) (db.Post, error) {
			return db.Post{Title: "My Post", Slug: slug}, nil
		},
	}

	h := newTestHandler(mock)
	req := httptest.NewRequest(http.MethodGet, "/api/posts/my-post", nil)
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("slug", "my-post")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.GetPost(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
}

func TestGetPost_NotFound(t *testing.T) {
	mock := &mockQuerier{
		GetPostBySlugFunc: func(ctx context.Context, slug string) (db.Post, error) {
			return db.Post{}, fmt.Errorf("no rows")
		},
	}

	h := newTestHandler(mock)
	req := httptest.NewRequest(http.MethodGet, "/api/posts/nonexistent", nil)
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("slug", "nonexistent")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.GetPost(rec, req)

	if rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", rec.Code)
	}
}

func TestCreatePost_Success(t *testing.T) {
	mock := &mockQuerier{
		CreatePostFunc: func(ctx context.Context, arg db.CreatePostParams) (db.Post, error) {
			return db.Post{
				Title:   arg.Title,
				Slug:    arg.Slug,
				Content: arg.Content,
				Status:  arg.Status,
			}, nil
		},
	}

	h := newTestHandler(mock)
	body := `{"title":"New Post","slug":"new-post","content":"Hello","status":"draft"}`
	req := httptest.NewRequest(http.MethodPost, "/api/admin/posts", strings.NewReader(body))
	rec := httptest.NewRecorder()

	h.CreatePost(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", rec.Code)
	}
}

func TestCreatePost_BadJSON(t *testing.T) {
	h := newTestHandler(&mockQuerier{})
	req := httptest.NewRequest(http.MethodPost, "/api/admin/posts", strings.NewReader("not json"))
	rec := httptest.NewRecorder()

	h.CreatePost(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rec.Code)
	}
}

func TestUpdatePost_Success(t *testing.T) {
	mock := &mockQuerier{
		UpdatePostByIDFunc: func(ctx context.Context, arg db.UpdatePostByIDParams) (db.Post, error) {
			return db.Post{Title: arg.Title, Slug: arg.Slug}, nil
		},
	}

	h := newTestHandler(mock)
	body := `{"title":"Updated","slug":"updated","content":"new content","status":"published"}`
	req := httptest.NewRequest(http.MethodPut, "/api/admin/posts/550e8400-e29b-41d4-a716-446655440000", strings.NewReader(body))
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", "550e8400-e29b-41d4-a716-446655440000")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.UpdatePost(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
}

func TestUpdatePost_BadUUID(t *testing.T) {
	h := newTestHandler(&mockQuerier{})
	req := httptest.NewRequest(http.MethodPut, "/api/admin/posts/bad-uuid", strings.NewReader(`{}`))
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", "bad-uuid")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.UpdatePost(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rec.Code)
	}
}

func TestDeletePost_Success(t *testing.T) {
	mock := &mockQuerier{
		DeletePostByIDFunc: func(ctx context.Context, id pgtype.UUID) error {
			return nil
		},
	}

	h := newTestHandler(mock)
	req := httptest.NewRequest(http.MethodDelete, "/api/admin/posts/550e8400-e29b-41d4-a716-446655440000", nil)
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", "550e8400-e29b-41d4-a716-446655440000")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.DeletePost(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("expected 204, got %d", rec.Code)
	}
}

func TestDeletePost_BadUUID(t *testing.T) {
	h := newTestHandler(&mockQuerier{})
	req := httptest.NewRequest(http.MethodDelete, "/api/admin/posts/bad-uuid", nil)
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", "bad-uuid")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.DeletePost(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rec.Code)
	}
}
