package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/yeahjun/blog/backend/internal/api"
	"github.com/yeahjun/blog/backend/internal/auth"
	"github.com/yeahjun/blog/backend/internal/config"
	db "github.com/yeahjun/blog/backend/internal/db/generated"
)

func main() {
	godotenv.Load()
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

	queries := db.New(pool)

	tokenConfig := auth.TokenConfig{
		Secret:             cfg.JWTSecret,
		AccessTokenExpiry:  15 * time.Minute,
		RefreshTokenExpiry: 30 * 24 * time.Hour,
	}

	handler := api.NewHandler(queries, tokenConfig)
	r := handler.Routes()

	log.Printf("server is starting: %v", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, r))
}
