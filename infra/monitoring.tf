# Notification channel
resource "google_monitoring_notification_channel" "email" {
  display_name = "Alert Email"
  type         = "email"

  labels = {
    email_address = var.alert_email
  }
}

# Billing budget — $25/month with alerts at 50%, 80%, 100%
resource "google_billing_budget" "monthly" {
  billing_account = var.billing_account
  display_name    = "Blog Monthly Budget"

  budget_filter {
    projects = ["projects/${var.project_id}"]
  }

  amount {
    specified_amount {
      currency_code = "USD"
      units         = "25"
    }
  }

  threshold_rules {
    threshold_percent = 0.5
  }

  threshold_rules {
    threshold_percent = 0.8
  }

  threshold_rules {
    threshold_percent = 1.0
  }

  threshold_rules {
    threshold_percent = 1.0
    spend_basis       = "FORECASTED_SPEND"
  }

  all_updates_rule {
    monitoring_notification_channels = [google_monitoring_notification_channel.email.id]
  }

  depends_on = [google_project_service.apis]
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
