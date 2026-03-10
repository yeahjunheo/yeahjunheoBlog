package auth

import (
	"encoding/json"
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

type attempt struct {
	count       int
	windowStart time.Time
}

type RateLimiter struct {
	mu       sync.Mutex
	attempts map[string]*attempt
	max      int
	window   time.Duration
}

func NewRateLimiter(max int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		attempts: make(map[string]*attempt),
		max:      max,
		window:   window,
	}
}

func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		// First IP in the chain is the original client
		if ip := strings.TrimSpace(strings.SplitN(xff, ",", 2)[0]); ip != "" {
			return ip
		}
	}
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}

func (rl *RateLimiter) Limit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := clientIP(r)

		rl.mu.Lock()
		a, exists := rl.attempts[ip]
		if !exists || time.Since(a.windowStart) > rl.window {
			rl.attempts[ip] = &attempt{count: 1, windowStart: time.Now()}
			rl.mu.Unlock()
			next.ServeHTTP(w, r)
			return
		}

		a.count++
		if a.count > rl.max {
			rl.mu.Unlock()
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusTooManyRequests)
			json.NewEncoder(w).Encode(map[string]string{"error": "too many requests"})
			return
		}
		rl.mu.Unlock()
		next.ServeHTTP(w, r)
	})
}
