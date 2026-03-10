package auth

import "testing"

func TestHashAndComparePassword(t *testing.T) {
	hash, err := HashPassword("mysecretpassword")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !ComparePassword(hash, "mysecretpassword") {
		t.Fatal("expected password to match")
	}
}

func TestComparePassword_Wrong(t *testing.T) {
	hash, _ := HashPassword("correctpassword")
	if ComparePassword(hash, "wrongpassword") {
		t.Fatal("expected password not to match")
	}
}
