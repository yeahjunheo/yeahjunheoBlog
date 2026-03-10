resource "google_sql_database_instance" "blog" {
  name             = "blog"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier              = var.db_tier
    edition           = "ENTERPRISE"
    availability_type = "ZONAL"

    backup_configuration {
      enabled = true
    }

    ip_configuration {
      ipv4_enabled = true
    }
  }

  deletion_protection = true

  depends_on = [google_project_service.apis]
}

resource "google_sql_database" "blog" {
  name     = var.db_name
  instance = google_sql_database_instance.blog.name
}

resource "google_sql_user" "blog" {
  name     = var.db_user
  instance = google_sql_database_instance.blog.name
  password = var.db_password
}
