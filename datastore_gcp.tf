terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

# Enable Datastore API
resource "google_project_service" "datastore" {
  project = var.project_id
  service = "datastore.googleapis.com"

  disable_on_destroy = false
}

# Create Datastore database (Datastore mode)
resource "google_firestore_database" "datastore" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.region
  type        = "DATASTORE_MODE"

  depends_on = [google_project_service.datastore]
}

# Note: Datastore mode automatically creates single-property indexes
# Composite indexes are created automatically when queries require them
# You can also define them in an index.yaml file if needed

# Output important values
output "database_name" {
  value       = google_firestore_database.datastore.name
  description = "The name of the Datastore database"
}

output "project_id" {
  value       = var.project_id
  description = "The GCP project ID"
}
