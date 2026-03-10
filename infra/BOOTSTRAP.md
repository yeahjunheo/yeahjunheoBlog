# Terraform State Bootstrap

Terraform needs a GCS bucket to store its state remotely. This bucket must be created manually before running `terraform init`.

## Steps

1. **Create the GCS bucket**

   ```bash
   gcloud storage buckets create gs://yeahjunheo-blog-tfstate \
     --project=YOUR_PROJECT_ID \
     --location=asia-northeast1 \
     --uniform-bucket-level-access
   ```

2. **Enable versioning**

   ```bash
   gcloud storage buckets update gs://yeahjunheo-blog-tfstate --versioning
   ```

3. **Enable the Cloud Storage API** (if not already enabled)

   ```bash
   gcloud services enable storage.googleapis.com --project=YOUR_PROJECT_ID
   ```

4. **Run Terraform init**

   ```bash
   cd infra
   terraform init
   ```

## CI/CD (after `terraform apply`)

GitHub Actions uses Workload Identity Federation for keyless auth to GCP. After applying Terraform, add two repository secrets:

1. **Get the output values**

   ```bash
   terraform output github_wif_provider
   terraform output github_service_account
   ```

2. **Add GitHub repo secrets**

   Go to **Settings → Secrets and variables → Actions** in the `yeahjunheo/yeahjunheoBlog` repo and create:

   - `WIF_PROVIDER` — the `github_wif_provider` output value
   - `WIF_SERVICE_ACCOUNT` — the `github_service_account` output value

Pushes to `main` that touch `backend/` or `frontend/` will then automatically build, push to Artifact Registry, and deploy to Cloud Run.
