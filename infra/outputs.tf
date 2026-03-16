output "backend_url" {
  value = google_cloud_run_v2_service.backend.uri
}

output "frontend_url" {
  value = google_cloud_run_v2_service.frontend.uri
}

output "cloud_sql_connection_name" {
  value = google_sql_database_instance.blog.connection_name
}

output "artifact_registry_url" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.blog.repository_id}"
}

output "cloudflare_nameservers" {
  value       = cloudflare_zone.blog.name_servers
  description = "Set these nameservers in Squarespace"
}

output "github_wif_provider" {
  value = google_iam_workload_identity_pool_provider.github.name
}

output "github_service_account" {
  value = google_service_account.github_actions.email
}
