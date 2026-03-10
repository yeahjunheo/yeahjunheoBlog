package api

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/yeahjun/blog/backend/internal/auth"
	db "github.com/yeahjun/blog/backend/internal/db/generated"
)

type mockQuerier struct {
	AddTagToPostFunc              func(ctx context.Context, arg db.AddTagToPostParams) error
	CreateAuthorFunc              func(ctx context.Context, arg db.CreateAuthorParams) (db.Author, error)
	CreatePostFunc                func(ctx context.Context, arg db.CreatePostParams) (db.Post, error)
	CreateRefreshTokenFunc        func(ctx context.Context, arg db.CreateRefreshTokenParams) (db.RefreshToken, error)
	CreateTagFunc                 func(ctx context.Context, arg db.CreateTagParams) (db.Tag, error)
	DeletePostByIDFunc            func(ctx context.Context, id pgtype.UUID) error
	DeleteRefreshTokenFunc        func(ctx context.Context, tokenHash string) error
	DeleteRefreshTokenByAuthorFunc func(ctx context.Context, authorID pgtype.UUID) error
	DeleteTagByIDFunc             func(ctx context.Context, id pgtype.UUID) error
	GetAllTagsFunc                func(ctx context.Context) ([]db.Tag, error)
	GetAuthorByUsernameFunc       func(ctx context.Context, username string) (db.Author, error)
	GetPostBySlugFunc             func(ctx context.Context, slug string) (db.Post, error)
	GetPostByTagSlugFunc          func(ctx context.Context, arg db.GetPostByTagSlugParams) ([]db.GetPostByTagSlugRow, error)
	GetPostTagsFunc               func(ctx context.Context, postID pgtype.UUID) ([]db.GetPostTagsRow, error)
	GetPostsAdminFunc             func(ctx context.Context, arg db.GetPostsAdminParams) ([]db.Post, error)
	GetPublishedPostsFunc         func(ctx context.Context, arg db.GetPublishedPostsParams) ([]db.Post, error)
	GetRefreshTokenFunc           func(ctx context.Context, tokenHash string) (db.RefreshToken, error)
	RemoveTagFromPostFunc         func(ctx context.Context, arg db.RemoveTagFromPostParams) error
	UpdatePostByIDFunc            func(ctx context.Context, arg db.UpdatePostByIDParams) (db.Post, error)
}

func (m *mockQuerier) AddTagToPost(ctx context.Context, arg db.AddTagToPostParams) error {
	return m.AddTagToPostFunc(ctx, arg)
}
func (m *mockQuerier) CreateAuthor(ctx context.Context, arg db.CreateAuthorParams) (db.Author, error) {
	return m.CreateAuthorFunc(ctx, arg)
}
func (m *mockQuerier) CreatePost(ctx context.Context, arg db.CreatePostParams) (db.Post, error) {
	return m.CreatePostFunc(ctx, arg)
}
func (m *mockQuerier) CreateRefreshToken(ctx context.Context, arg db.CreateRefreshTokenParams) (db.RefreshToken, error) {
	return m.CreateRefreshTokenFunc(ctx, arg)
}
func (m *mockQuerier) CreateTag(ctx context.Context, arg db.CreateTagParams) (db.Tag, error) {
	return m.CreateTagFunc(ctx, arg)
}
func (m *mockQuerier) DeletePostByID(ctx context.Context, id pgtype.UUID) error {
	return m.DeletePostByIDFunc(ctx, id)
}
func (m *mockQuerier) DeleteRefreshToken(ctx context.Context, tokenHash string) error {
	return m.DeleteRefreshTokenFunc(ctx, tokenHash)
}
func (m *mockQuerier) DeleteRefreshTokenByAuthor(ctx context.Context, authorID pgtype.UUID) error {
	return m.DeleteRefreshTokenByAuthorFunc(ctx, authorID)
}
func (m *mockQuerier) DeleteTagByID(ctx context.Context, id pgtype.UUID) error {
	return m.DeleteTagByIDFunc(ctx, id)
}
func (m *mockQuerier) GetAllTags(ctx context.Context) ([]db.Tag, error) {
	return m.GetAllTagsFunc(ctx)
}
func (m *mockQuerier) GetAuthorByUsername(ctx context.Context, username string) (db.Author, error) {
	return m.GetAuthorByUsernameFunc(ctx, username)
}
func (m *mockQuerier) GetPostBySlug(ctx context.Context, slug string) (db.Post, error) {
	return m.GetPostBySlugFunc(ctx, slug)
}
func (m *mockQuerier) GetPostByTagSlug(ctx context.Context, arg db.GetPostByTagSlugParams) ([]db.GetPostByTagSlugRow, error) {
	return m.GetPostByTagSlugFunc(ctx, arg)
}
func (m *mockQuerier) GetPostTags(ctx context.Context, postID pgtype.UUID) ([]db.GetPostTagsRow, error) {
	return m.GetPostTagsFunc(ctx, postID)
}
func (m *mockQuerier) GetPostsAdmin(ctx context.Context, arg db.GetPostsAdminParams) ([]db.Post, error) {
	return m.GetPostsAdminFunc(ctx, arg)
}
func (m *mockQuerier) GetPublishedPosts(ctx context.Context, arg db.GetPublishedPostsParams) ([]db.Post, error) {
	return m.GetPublishedPostsFunc(ctx, arg)
}
func (m *mockQuerier) GetRefreshToken(ctx context.Context, tokenHash string) (db.RefreshToken, error) {
	return m.GetRefreshTokenFunc(ctx, tokenHash)
}
func (m *mockQuerier) RemoveTagFromPost(ctx context.Context, arg db.RemoveTagFromPostParams) error {
	return m.RemoveTagFromPostFunc(ctx, arg)
}
func (m *mockQuerier) UpdatePostByID(ctx context.Context, arg db.UpdatePostByIDParams) (db.Post, error) {
	return m.UpdatePostByIDFunc(ctx, arg)
}

func newTestHandler(mock *mockQuerier) *Handler {
	return &Handler{
		sqlc: mock,
		tokenConfig: auth.TokenConfig{
			Secret:             "test-secret",
			AccessTokenExpiry:  15 * time.Minute,
			RefreshTokenExpiry: 7 * 24 * time.Hour,
		},
	}
}
