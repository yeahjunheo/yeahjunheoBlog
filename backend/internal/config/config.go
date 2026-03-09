package config

import (
	"fmt"
	"os"
)

type Config struct {
	DatabaseURL   string
	JWTSecret     string
	Port          string
	AllowedOrigin string
}

func Load() (*Config, error) {
	cfg := &Config{
		DatabaseURL:   os.Getenv("DATABASE_URL"),
		JWTSecret:     os.Getenv("JWT_SECRET"),
		Port:          os.Getenv("PORT"),
		AllowedOrigin: os.Getenv("ALLOWED_ORIGIN"),
	}

	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required.")
	}
	if cfg.JWTSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET is required.")
	}
	if cfg.Port == "" {
		cfg.Port = "8080"
	}
	if cfg.AllowedOrigin == "" {
		cfg.AllowedOrigin = "http://localhost:4321"
	}
	return cfg, nil
}
