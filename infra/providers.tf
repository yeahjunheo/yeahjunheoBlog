terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "yeahjunheo-blog-tfstate"
    prefix = "terraform/state"
  }
}

provider "google" {
  project                     = var.project_id
  region                      = var.region
  user_project_override       = true
  billing_project             = var.project_id
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
