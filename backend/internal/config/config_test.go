package config

import (
	"os"
	"testing"
)

func TestLoad_AllSet(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://localhost/test")
	t.Setenv("JWT_SECRET", "supersecret")
	t.Setenv("PORT", "3000")
	t.Setenv("ALLOWED_ORIGIN", "https://example.com")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if cfg.DatabaseURL != "postgres://localhost/test" {
		t.Fatalf("expected DATABASE_URL=postgres://localhost/test, got %s", cfg.DatabaseURL)
	}
	if cfg.JWTSecret != "supersecret" {
		t.Fatalf("expected JWT_SECRET=supersecret, got %s", cfg.JWTSecret)
	}
	if cfg.Port != "3000" {
		t.Fatalf("expected PORT=3000, got %s", cfg.Port)
	}
	if cfg.AllowedOrigin != "https://example.com" {
		t.Fatalf("expected ALLOWED_ORIGIN=https://example.com, got %s", cfg.AllowedOrigin)
	}
}

func TestLoad_MissingDatabaseURL(t *testing.T) {
	os.Unsetenv("DATABASE_URL")
	t.Setenv("JWT_SECRET", "secret")

	_, err := Load()
	if err == nil {
		t.Fatal("expected error for missing DATABASE_URL")
	}
}

func TestLoad_MissingJWTSecret(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://localhost/test")
	os.Unsetenv("JWT_SECRET")

	_, err := Load()
	if err == nil {
		t.Fatal("expected error for missing JWT_SECRET")
	}
}

func TestLoad_Defaults(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://localhost/test")
	t.Setenv("JWT_SECRET", "secret")
	os.Unsetenv("PORT")
	os.Unsetenv("ALLOWED_ORIGIN")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if cfg.Port != "8080" {
		t.Fatalf("expected default PORT=8080, got %s", cfg.Port)
	}
	if cfg.AllowedOrigin != "http://localhost:4321" {
		t.Fatalf("expected default ALLOWED_ORIGIN=http://localhost:4321, got %s", cfg.AllowedOrigin)
	}
}
