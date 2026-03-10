package api

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/yeahjun/blog/backend/internal/db/generated"
)

func TestListTags_Success(t *testing.T) {
	mock := &mockQuerier{
		GetAllTagsFunc: func(ctx context.Context) ([]db.Tag, error) {
			return []db.Tag{
				{Name: "Go", Slug: "go"},
				{Name: "Rust", Slug: "rust"},
			}, nil
		},
	}

	h := newTestHandler(mock)
	req := httptest.NewRequest(http.MethodGet, "/api/tags", nil)
	rec := httptest.NewRecorder()

	h.ListTags(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}

	var tags []db.Tag
	json.NewDecoder(rec.Body).Decode(&tags)
	if len(tags) != 2 {
		t.Fatalf("expected 2 tags, got %d", len(tags))
	}
}

func TestGetPostsByTag_Success(t *testing.T) {
	mock := &mockQuerier{
		GetPostByTagSlugFunc: func(ctx context.Context, arg db.GetPostByTagSlugParams) ([]db.GetPostByTagSlugRow, error) {
			return []db.GetPostByTagSlugRow{
				{Title: "Tagged Post", Slug: "tagged-post"},
			}, nil
		},
	}

	h := newTestHandler(mock)
	req := httptest.NewRequest(http.MethodGet, "/api/tags/go/posts", nil)
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("slug", "go")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.GetPostsByTag(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rec.Code)
	}
}

func TestCreateTag_Success(t *testing.T) {
	mock := &mockQuerier{
		CreateTagFunc: func(ctx context.Context, arg db.CreateTagParams) (db.Tag, error) {
			return db.Tag{Name: arg.Name, Slug: arg.Slug}, nil
		},
	}

	h := newTestHandler(mock)
	body := `{"name":"Go","slug":"go"}`
	req := httptest.NewRequest(http.MethodPost, "/api/admin/tags", strings.NewReader(body))
	rec := httptest.NewRecorder()

	h.CreateTag(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", rec.Code)
	}
}

func TestCreateTag_BadJSON(t *testing.T) {
	h := newTestHandler(&mockQuerier{})
	req := httptest.NewRequest(http.MethodPost, "/api/admin/tags", strings.NewReader("bad"))
	rec := httptest.NewRecorder()

	h.CreateTag(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rec.Code)
	}
}

func TestDeleteTag_Success(t *testing.T) {
	mock := &mockQuerier{
		DeleteTagByIDFunc: func(ctx context.Context, id pgtype.UUID) error {
			return nil
		},
	}

	h := newTestHandler(mock)
	req := httptest.NewRequest(http.MethodDelete, "/api/admin/tags/550e8400-e29b-41d4-a716-446655440000", nil)
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", "550e8400-e29b-41d4-a716-446655440000")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.DeleteTag(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("expected 204, got %d", rec.Code)
	}
}

func TestDeleteTag_BadUUID(t *testing.T) {
	h := newTestHandler(&mockQuerier{})
	req := httptest.NewRequest(http.MethodDelete, "/api/admin/tags/bad-uuid", nil)
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", "bad-uuid")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.DeleteTag(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rec.Code)
	}
}

func TestAddTagToPost_Success(t *testing.T) {
	mock := &mockQuerier{
		AddTagToPostFunc: func(ctx context.Context, arg db.AddTagToPostParams) error {
			return nil
		},
	}

	h := newTestHandler(mock)
	body := `{"tag_id":"550e8400-e29b-41d4-a716-446655440001"}`
	req := httptest.NewRequest(http.MethodPost, "/api/admin/posts/550e8400-e29b-41d4-a716-446655440000/tags", strings.NewReader(body))
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", "550e8400-e29b-41d4-a716-446655440000")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.AddTagToPost(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", rec.Code)
	}
}

func TestAddTagToPost_BadPostUUID(t *testing.T) {
	h := newTestHandler(&mockQuerier{})
	req := httptest.NewRequest(http.MethodPost, "/api/admin/posts/bad-uuid/tags", strings.NewReader(`{"tag_id":"550e8400-e29b-41d4-a716-446655440001"}`))
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", "bad-uuid")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.AddTagToPost(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rec.Code)
	}
}

func TestRemoveTagFromPost_Success(t *testing.T) {
	mock := &mockQuerier{
		RemoveTagFromPostFunc: func(ctx context.Context, arg db.RemoveTagFromPostParams) error {
			return nil
		},
	}

	h := newTestHandler(mock)
	req := httptest.NewRequest(http.MethodDelete, "/api/admin/posts/550e8400-e29b-41d4-a716-446655440000/tags/550e8400-e29b-41d4-a716-446655440001", nil)
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", "550e8400-e29b-41d4-a716-446655440000")
	rctx.URLParams.Add("tagID", "550e8400-e29b-41d4-a716-446655440001")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.RemoveTagFromPost(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("expected 204, got %d", rec.Code)
	}
}

func TestRemoveTagFromPost_BadPostUUID(t *testing.T) {
	h := newTestHandler(&mockQuerier{})
	req := httptest.NewRequest(http.MethodDelete, "/api/admin/posts/bad-uuid/tags/550e8400-e29b-41d4-a716-446655440001", nil)
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("id", "bad-uuid")
	rctx.URLParams.Add("tagID", "550e8400-e29b-41d4-a716-446655440001")
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
	rec := httptest.NewRecorder()

	h.RemoveTagFromPost(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", rec.Code)
	}
}
