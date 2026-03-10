package auth

import (
	"testing"
	"time"
)

func TestGenerateAccessToken(t *testing.T) {
	cfg := TokenConfig{
		Secret:            "test-secret",
		AccessTokenExpiry: 15 * time.Minute,
	}

	token, err := GenerateAccessToken("author-123", cfg)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if token == "" {
		t.Fatal("expected non-empty token")
	}

	sub, err := ValidateAccessToken(token, cfg.Secret)
	if err != nil {
		t.Fatalf("token should be valid: %v", err)
	}
	if sub != "author-123" {
		t.Fatalf("expected subject author-123, got %s", sub)
	}
}

func TestValidateAccessToken(t *testing.T) {
	cfg := TokenConfig{
		Secret:            "test-secret",
		AccessTokenExpiry: 15 * time.Minute,
	}

	token, _ := GenerateAccessToken("author-456", cfg)
	sub, err := ValidateAccessToken(token, cfg.Secret)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if sub != "author-456" {
		t.Fatalf("expected author-456, got %s", sub)
	}
}

func TestValidateAccessToken_Expired(t *testing.T) {
	cfg := TokenConfig{
		Secret:            "test-secret",
		AccessTokenExpiry: -1 * time.Second,
	}

	token, _ := GenerateAccessToken("author-789", cfg)
	_, err := ValidateAccessToken(token, cfg.Secret)
	if err == nil {
		t.Fatal("expected error for expired token")
	}
}

func TestValidateAccessToken_WrongSecret(t *testing.T) {
	cfg := TokenConfig{
		Secret:            "correct-secret",
		AccessTokenExpiry: 15 * time.Minute,
	}

	token, _ := GenerateAccessToken("author-abc", cfg)
	_, err := ValidateAccessToken(token, "wrong-secret")
	if err == nil {
		t.Fatal("expected error for wrong secret")
	}
}

func TestHashToken(t *testing.T) {
	hash1 := HashToken("my-token")
	hash2 := HashToken("my-token")
	if hash1 != hash2 {
		t.Fatal("hash should be deterministic")
	}
	if len(hash1) != 64 {
		t.Fatalf("expected 64-char hex string, got len %d", len(hash1))
	}

	different := HashToken("other-token")
	if hash1 == different {
		t.Fatal("different inputs should produce different hashes")
	}
}

func TestGenerateRefreshToken(t *testing.T) {
	token1, err := GenerateRefreshToken()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(token1) != 64 {
		t.Fatalf("expected 64-char hex string, got len %d", len(token1))
	}

	token2, _ := GenerateRefreshToken()
	if token1 == token2 {
		t.Fatal("tokens should be unique")
	}
}
