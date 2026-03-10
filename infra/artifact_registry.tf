resource "google_artifact_registry_repository" "blog" {
  location      = var.region
  repository_id = "blog"
  format        = "DOCKER"

  depends_on = [google_project_service.apis]
}
