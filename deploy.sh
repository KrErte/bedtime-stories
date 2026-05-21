#!/bin/bash
set -e

echo "=== Dreamlit.ee Deploy Script ==="
echo ""

# 1. Update system and install Docker
echo "[1/6] Installing Docker..."
apt-get update -qq
apt-get install -y -qq curl git apt-transport-https ca-certificates gnupg lsb-release

if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    apt-get install -y -qq docker-compose-plugin
fi

echo "Docker: $(docker --version)"

# 2. Clone or update repo
echo "[2/6] Setting up application..."
APP_DIR="/opt/dreamlit"
mkdir -p $APP_DIR

if [ -d "$APP_DIR/.git" ]; then
    cd $APP_DIR
    git pull
else
    # If no git remote, we copy files
    echo "Copying application files..."
fi
cd $APP_DIR

# 3. Create .env if not exists
echo "[3/6] Configuring environment..."
if [ ! -f .env ]; then
    JWT_SECRET=$(openssl rand -hex 32)
    DB_PASSWORD=$(openssl rand -hex 16)

    cat > .env << ENVEOF
# Database
DB_PASSWORD=$DB_PASSWORD

# APIs - FILL THESE IN
ANTHROPIC_API_KEY=sk-ant-CHANGE_ME
OPENAI_API_KEY=sk-CHANGE_ME
STRIPE_SECRET_KEY=sk_live_CHANGE_ME
STRIPE_PUBLISHABLE_KEY=pk_live_CHANGE_ME
STRIPE_WEBHOOK_SECRET=whsec_CHANGE_ME
STRIPE_PRICE_ID=price_CHANGE_ME
RESEND_API_KEY=re_CHANGE_ME

# App
JWT_SECRET=$JWT_SECRET
APP_URL=https://dreamlit.ee
API_URL=https://api.dreamlit.ee
ALLOWED_ORIGINS=https://dreamlit.ee

# Email
FROM_EMAIL=hello@dreamlit.ee

# Google OAuth
GOOGLE_CLIENT_ID=CHANGE_ME
ENVEOF
    echo "Created .env with generated secrets. Edit it to add your API keys:"
    echo "  nano /opt/dreamlit/.env"
fi

# 4. Build and start
echo "[4/6] Building containers (this takes a few minutes)..."
docker compose build --no-cache

echo "[5/6] Starting services..."
docker compose up -d

# 6. Wait for health
echo "[6/6] Waiting for services to be healthy..."
sleep 10

echo ""
echo "=== Deploy Complete ==="
echo ""
echo "Services:"
docker compose ps
echo ""
echo "IMPORTANT: Set your DNS records:"
echo "  dreamlit.ee     -> A record -> 37.60.225.35"
echo "  api.dreamlit.ee -> A record -> 37.60.225.35"
echo ""
echo "Edit API keys: nano /opt/dreamlit/.env"
echo "Then restart:   cd /opt/dreamlit && docker compose restart"
echo ""
echo "Logs: docker compose logs -f"
