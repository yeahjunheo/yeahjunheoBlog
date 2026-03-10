variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "region" {
  type        = string
  default     = "us-central1"
  description = "GCP region"
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "Cloud SQL database password"
}

variable "jwt_secret" {
  type        = string
  sensitive   = true
  description = "JWT signing secret"
}

variable "domain" {
  type        = string
  default     = "yeahjunheo.com"
  description = "Root domain for the blog"
}

variable "db_tier" {
  type        = string
  default     = "db-f1-micro"
  description = "Cloud SQL machine tier"
}

variable "db_name" {
  type        = string
  default     = "blog"
  description = "Database name"
}

variable "db_user" {
  type        = string
  default     = "blog"
  description = "Database user"
}

variable "backend_image" {
  type        = string
  description = "Backend container image (e.g. us-central1-docker.pkg.dev/PROJECT/blog/backend:latest)"
}

variable "frontend_image" {
  type        = string
  description = "Frontend container image (e.g. us-central1-docker.pkg.dev/PROJECT/blog/frontend:latest)"
}

variable "billing_account" {
  type        = string
  description = "GCP billing account ID"
}

variable "alert_email" {
  type        = string
  description = "Email address for budget and monitoring alerts"
}
