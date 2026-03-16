resource "cloudflare_zone" "blog" {
  account = {
    id = var.cloudflare_account_id
  }
  name = var.domain
  type = "full"
}

# Google Cloud Run domain mapping IPs (stable anycast IPs for custom domain routing)
locals {
  cloud_run_domain_mapping_ips = [
    "216.239.32.21",
    "216.239.34.21",
    "216.239.36.21",
    "216.239.38.21",
  ]
}

# Frontend: yeahjunheo.com → Cloud Run domain mapping IPs
resource "cloudflare_dns_record" "frontend" {
  for_each = toset(local.cloud_run_domain_mapping_ips)
  zone_id  = cloudflare_zone.blog.id
  name     = var.domain
  type     = "A"
  content  = each.value
  proxied  = true
  ttl      = 1
}

# Backend: api.yeahjunheo.com → Cloud Run domain mapping IPs
resource "cloudflare_dns_record" "backend" {
  for_each = toset(local.cloud_run_domain_mapping_ips)
  zone_id  = cloudflare_zone.blog.id
  name     = "api"
  type     = "A"
  content  = each.value
  proxied  = true
  ttl      = 1
}

# www → yeahjunheo.com redirect (needs a proxied record + redirect rule)
resource "cloudflare_dns_record" "www" {
  zone_id = cloudflare_zone.blog.id
  name    = "www"
  type    = "CNAME"
  content = var.domain
  proxied = true
  ttl     = 1
}

resource "cloudflare_ruleset" "www_redirect" {
  zone_id     = cloudflare_zone.blog.id
  name        = "Redirect www to apex"
  description = "301 redirect www.yeahjunheo.com to yeahjunheo.com"
  kind        = "zone"
  phase       = "http_request_dynamic_redirect"

  rules = [
    {
      ref         = "www_redirect"
      description = "Redirect www to apex"
      expression  = "(http.host eq \"www.${var.domain}\")"
      action      = "redirect"
      action_parameters = {
        from_value = {
          status_code = 301
          target_url = {
            expression = "concat(\"https://${var.domain}\", http.request.uri.path)"
          }
        }
      }
    }
  ]
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
