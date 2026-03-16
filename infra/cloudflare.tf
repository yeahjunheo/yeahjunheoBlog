resource "cloudflare_zone" "blog" {
  account = {
    id = var.cloudflare_account_id
  }
  name = var.domain
  type = "full"
}

# Frontend: yeahjunheo.com → Cloud Run
resource "cloudflare_dns_record" "frontend" {
  zone_id = cloudflare_zone.blog.id
  name    = var.domain
  type    = "CNAME"
  content = trimprefix(google_cloud_run_v2_service.frontend.uri, "https://")
  proxied = true
  ttl     = 1
}

# Backend: api.yeahjunheo.com → Cloud Run
resource "cloudflare_dns_record" "backend" {
  zone_id = cloudflare_zone.blog.id
  name    = "api"
  type    = "CNAME"
  content = trimprefix(google_cloud_run_v2_service.backend.uri, "https://")
  proxied = true
  ttl     = 1
}

# SSL: Full mode — encrypts to origin (Cloud Run *.run.app has valid certs)
resource "cloudflare_zone_setting" "ssl" {
  zone_id    = cloudflare_zone.blog.id
  setting_id = "ssl"
  value      = "full"
}

# Force HTTPS
resource "cloudflare_zone_setting" "always_use_https" {
  zone_id    = cloudflare_zone.blog.id
  setting_id = "always_use_https"
  value      = "on"
}

# TLS 1.3
resource "cloudflare_zone_setting" "tls_1_3" {
  zone_id    = cloudflare_zone.blog.id
  setting_id = "tls_1_3"
  value      = "on"
}

# Auto-rewrite HTTP links to HTTPS
resource "cloudflare_zone_setting" "automatic_https_rewrites" {
  zone_id    = cloudflare_zone.blog.id
  setting_id = "automatic_https_rewrites"
  value      = "on"
}

# Bot protection — block AI scrapers and enable bot fight mode
resource "cloudflare_bot_management" "blog" {
  zone_id            = cloudflare_zone.blog.id
  enable_js          = true
  ai_bots_protection = "block"
  fight_mode         = true
}
