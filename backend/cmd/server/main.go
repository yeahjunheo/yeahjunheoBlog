package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
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
	queries := db.New(pool)

	tokenConfig := auth.TokenConfig{
		Secret:             cfg.JWTSecret,
		AccessTokenExpiry:  15 * time.Minute,
		RefreshTokenExpiry: 30 * 24 * time.Hour,
	}

	handler := api.NewHandler(queries, tokenConfig, cfg.AllowedOrigin)
	r := handler.Routes()

	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: r,
	}

	go func() {
		log.Printf("server is starting: %v", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	<-quit

	log.Println("shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("server shutdown error: %v", err)
	}

	pool.Close()
	log.Println("server stopped")
}
