package auth

import (
	"net/http"
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

func (rl *RateLimiter) Limit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr

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
			http.Error(w, "too many requests", http.StatusTooManyRequests)
			return
		}
		rl.mu.Unlock()
		next.ServeHTTP(w, r)
	})
}
