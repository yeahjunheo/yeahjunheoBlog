package main

import (
	"context"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/golang-migrate/migrate/v4"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/yeahjun/blog/backend/internal/config"
	db "github.com/yeahjun/blog/backend/internal/db/generated"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config error: %v", err)
	}

	m, err := migrate.New("file://migrations", cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("migration error: %v", err)
	}
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("migration error: %v", err)
	}
	log.Println("migrations applied.")

	pool, err := pgxpool.New(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db connection error: %v", err)
	}
	err = pool.Ping(context.Background())
	if err != nil {
		log.Fatalf("db ping error: %v", err)
	}
	defer pool.Close()

	sqlc := db.New(pool)
	_ = sqlc
	c := chi.NewRouter()
	c.Use(middleware.Logger)
	c.Use(middleware.Recoverer)
	log.Printf("server is starting: %v", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, c))
}
