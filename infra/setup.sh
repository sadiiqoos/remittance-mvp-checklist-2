#!/bin/bash

# ============================================================
# RemitSwift - Azure Setup Script
# Deploys Next.js app to Azure Static Web Apps
# ============================================================

set -e

# ── Colors ──────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success(){ echo -e "${GREEN}[OK]${NC} $1"; }
warn()   { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()  { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ── Configuration ────────────────────────────────────────────
APP_NAME="remitswift-app"
RESOURCE_GROUP="remitswift-rg"
LOCATION="westeurope"
SKU="Free"

# ── Check required tools ─────────────────────────────────────
log "Checking required tools..."

command -v az &>/dev/null || error "Azure CLI not installed. Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
command -v git &>/dev/null || error "Git not installed."
command -v node &>/dev/null || error "Node.js not installed."

success "All required tools found."

# ── Prompt for required values ───────────────────────────────
echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}   RemitSwift Azure Deployment Setup${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

read -p "GitHub repository URL (e.g. https://github.com/username/remitswift): " GITHUB_REPO
read -p "GitHub branch [main]: " GITHUB_BRANCH
GITHUB_BRANCH=${GITHUB_BRANCH:-main}

read -p "Supabase URL: " SUPABASE_URL
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
read -s -p "Supabase Service Role Key (hidden): " SUPABASE_SERVICE_ROLE_KEY
echo ""

# ── Azure Login ──────────────────────────────────────────────
log "Logging into Azure..."
az account show &>/dev/null || az login
success "Logged into Azure."

# ── Create Resource Group ────────────────────────────────────
log "Creating resource group: $RESOURCE_GROUP in $LOCATION..."
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output none
success "Resource group created."

# ── Create Static Web App ────────────────────────────────────
log "Creating Azure Static Web App: $APP_NAME..."
az staticwebapp create \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --sku "$SKU" \
  --source "$GITHUB_REPO" \
  --branch "$GITHUB_BRANCH" \
  --app-location "/" \
  --output-location ".next" \
  --login-with-github \
  --output none
success "Static Web App created."

# ── Set Environment Variables ────────────────────────────────
log "Setting environment variables..."
az staticwebapp appsettings set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --setting-names \
    NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL" \
    NEXT_PUBLIC_SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
    SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
    NODE_ENV="production" \
    NEXT_PUBLIC_APP_URL="https://$APP_NAME.azurestaticapps.net" \
  --output none
success "Environment variables set."

# ── Get deployment URL ───────────────────────────────────────
log "Fetching deployment URL..."
APP_URL=$(az staticwebapp show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "defaultHostname" \
  --output tsv)

# ── Create GitHub Actions workflow ───────────────────────────
log "Creating GitHub Actions workflow..."
mkdir -p .github/workflows
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.apiKey" \
  --output tsv)

cat > .github/workflows/azure-static-web-app.yml << EOF
name: Deploy RemitSwift to Azure Static Web Apps

on:
  push:
    branches:
      - $GITHUB_BRANCH
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - $GITHUB_BRANCH

jobs:
  build_and_deploy:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy

    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: \${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: \${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}

      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: \${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: \${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: ".next"

  close_pull_request:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request

    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: \${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
EOF

success "GitHub Actions workflow created."

# ── Add GitHub Secret instructions ───────────────────────────
echo ""
echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW}   ACTION REQUIRED - Add GitHub Secrets${NC}"
echo -e "${YELLOW}============================================${NC}"
echo ""
echo "Add these secrets to your GitHub repository:"
echo "Go to: GitHub repo → Settings → Secrets → Actions → New repository secret"
echo ""
echo -e "  ${GREEN}AZURE_STATIC_WEB_APPS_API_TOKEN${NC} = $DEPLOYMENT_TOKEN"
echo -e "  ${GREEN}NEXT_PUBLIC_SUPABASE_URL${NC}         = $SUPABASE_URL"
echo -e "  ${GREEN}NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}    = $SUPABASE_ANON_KEY"
echo -e "  ${GREEN}SUPABASE_SERVICE_ROLE_KEY${NC}         = (your service role key)"
echo ""

# ── Summary ──────────────────────────────────────────────────
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   Deployment Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "  App Name:     ${BLUE}$APP_NAME${NC}"
echo -e "  Resource Group: ${BLUE}$RESOURCE_GROUP${NC}"
echo -e "  Region:       ${BLUE}$LOCATION (North Europe)${NC}"
echo -e "  Live URL:     ${BLUE}https://$APP_URL${NC}"
echo ""
echo -e "  Next steps:"
echo -e "  1. Add the GitHub secrets listed above"
echo -e "  2. Push to '$GITHUB_BRANCH' branch to trigger deployment"
echo -e "  3. Monitor at: ${BLUE}https://portal.azure.com${NC}"
echo ""
success "Done! Your app will be live in ~5 minutes after first push."