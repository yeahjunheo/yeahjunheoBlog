package api

import (
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/yeahjun/blog/backend/internal/auth"
)

func (h *Handler) Routes() *chi.Mux {
	r := chi.NewRouter()
	globalLimiter := auth.NewRateLimiter(60, 1*time.Minute)
	authLimiter := auth.NewRateLimiter(5, 1*time.Minute)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(CORSMiddleware(h.allowedOrigin))
	r.Use(globalLimiter.Limit)

	r.Route("/api", func(r chi.Router) {
		r.Get("/posts", h.ListPublishedPosts)
		r.Get("/posts/{slug}", h.GetPost)
		r.Get("/tags", h.ListTags)
		r.Get("/tags/{slug}/posts", h.GetPostsByTag)

		r.Route("/auth", func(r chi.Router) {
			r.Use(authLimiter.Limit)
			r.Post("/login", h.Login)
			r.Post("/logout", h.Logout)
			r.Post("/refresh", h.Refresh)
		})

		r.Route("/admin", func(r chi.Router) {
			r.Use(auth.JWTMiddleware(h.tokenConfig.Secret))
			r.Get("/posts", h.ListPostsAdmin)
			r.Post("/posts", h.CreatePost)
			r.Put("/posts/{id}", h.UpdatePost)
			r.Delete("/posts/{id}", h.DeletePost)
			r.Get("/posts/{id}/tags", h.GetPostTags)
			r.Post("/tags", h.CreateTag)
			r.Delete("/tags/{id}", h.DeleteTag)
			r.Post("/posts/{id}/tags", h.AddTagToPost)
			r.Delete("/posts/{id}/tags/{tagID}", h.RemoveTagFromPost)
		})
	})

	return r
}
