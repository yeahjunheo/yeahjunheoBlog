package api

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	db "github.com/yeahjun/blog/backend/internal/db/generated"
)

func (h *Handler) ListTags(w http.ResponseWriter, r *http.Request) {
	tags, err := h.sqlc.GetAllTags(r.Context())
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tags)
}

func (h *Handler) GetPostsByTag(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	offset, _ := strconv.Atoi(r.URL.Query().Get("offset"))
	if limit <= 0 {
		limit = 10
	}

	posts, err := h.sqlc.GetPostByTagSlug(r.Context(), db.GetPostByTagSlugParams{
		Slug:   slug,
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func (h *Handler) CreateTag(w http.ResponseWriter, r *http.Request) {
	var req db.CreateTagParams
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	tag, err := h.sqlc.CreateTag(r.Context(), req)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(tag)
}

func (h *Handler) DeleteTag(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := parseUUID(idStr)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	err = h.sqlc.DeleteTagByID(r.Context(), id)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) AddTagToPost(w http.ResponseWriter, r *http.Request) {
	postIDStr := chi.URLParam(r, "id")
	postID, err := parseUUID(postIDStr)
	if err != nil {
		http.Error(w, "invalid post id", http.StatusBadRequest)
		return
	}

	var req struct {
		TagID string `json:"tag_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	tagID, err := parseUUID(req.TagID)
	if err != nil {
		http.Error(w, "invalid tag id", http.StatusBadRequest)
		return
	}

	err = h.sqlc.AddTagToPost(r.Context(), db.AddTagToPostParams{
		PostID: postID,
		TagID:  tagID,
	})
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *Handler) RemoveTagFromPost(w http.ResponseWriter, r *http.Request) {
	postIDStr := chi.URLParam(r, "id")
	postID, err := parseUUID(postIDStr)
	if err != nil {
		http.Error(w, "invalid post id", http.StatusBadRequest)
		return
	}

	tagIDStr := chi.URLParam(r, "tagID")
	tagID, err := parseUUID(tagIDStr)
	if err != nil {
		http.Error(w, "invalid tag id", http.StatusBadRequest)
		return
	}

	err = h.sqlc.RemoveTagFromPost(r.Context(), db.RemoveTagFromPostParams{
		PostID: postID,
		TagID:  tagID,
	})
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
