resource "google_artifact_registry_repository" "blog" {
  location      = var.region
  repository_id = "blog"
  format        = "DOCKER"

  cleanup_policies {
    id     = "keep-latest-2"
    action = "KEEP"

    most_recent_versions {
      package_name_prefixes = ["backend", "frontend"]
      keep_count            = 2
    }
  }

  cleanup_policies {
    id     = "delete-old-untagged"
    action = "DELETE"

    condition {
      tag_state = "UNTAGGED"
      older_than = "604800s" # 7 days
    }
  }

  depends_on = [google_project_service.apis]
}
