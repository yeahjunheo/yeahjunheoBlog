# Notification channel
resource "google_monitoring_notification_channel" "email" {
  display_name = "Alert Email"
  type         = "email"

  labels = {
    email_address = var.alert_email
  }
}

# Cloud Run 5xx error rate alert
resource "google_monitoring_alert_policy" "cloud_run_errors" {
  display_name = "Cloud Run 5xx Errors"
  combiner     = "OR"

  conditions {
    display_name = "5xx error count"

    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/request_count\" AND metric.labels.response_code_class = \"5xx\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 5

      aggregations {
        alignment_period   = "300s"
        per_series_aligner = "ALIGN_RATE"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.id]
}

# Cloud Run high latency alert (p95 > 2s)
resource "google_monitoring_alert_policy" "cloud_run_latency" {
  display_name = "Cloud Run High Latency"
  combiner     = "OR"

  conditions {
    display_name = "p95 latency > 2s"

    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/request_latencies\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 2000

      aggregations {
        alignment_period   = "300s"
        per_series_aligner = "ALIGN_PERCENTILE_95"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.id]
}
