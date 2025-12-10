#!/usr/bin/env bash
set -euo pipefail

# NeoAuth – One-shot Ubuntu deploy script (Apache + PHP + SQLite)
# Usage on your EC2 (Ubuntu 22.04/24.04):
#   curl -fsSL https://raw.githubusercontent.com/Moumiya/NeoAuth/main/setup_server.sh -o setup_server.sh
#   sudo bash setup_server.sh
# Or from your laptop (replace KEY and IP):
#   scp -i KEY.pem setup_server.sh ubuntu@EC2_PUBLIC_IP:~
#   ssh -i KEY.pem ubuntu@EC2_PUBLIC_IP 'sudo bash ~/setup_server.sh'

REPO_URL="https://github.com/Moumiya/NeoAuth.git"
APP_DIR="/var/www/neoauth"
SITE_NAME="neoauth"

echo "[1/6] Updating APT and installing packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y apache2 git php libapache2-mod-php php-sqlite3

echo "[2/6] Cloning/updating repository..."
if [[ -d "$APP_DIR/.git" ]]; then
  git -C "$APP_DIR" fetch --all --prune
  git -C "$APP_DIR" reset --hard origin/main
else
  rm -rf "$APP_DIR"
  git clone --depth 1 "$REPO_URL" "$APP_DIR"
fi

echo "[3/6] Setting file ownership and permissions..."
chown -R www-data:www-data "$APP_DIR"
mkdir -p "$APP_DIR/data"
chown -R www-data:www-data "$APP_DIR/data"
chmod -R 775 "$APP_DIR/data"

echo "[4/6] Configuring Apache VirtualHost..."
cat >/etc/apache2/sites-available/${SITE_NAME}.conf <<EOF
<VirtualHost *:80>
    ServerName _
    DocumentRoot ${APP_DIR}
    <Directory ${APP_DIR}>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog \\${APACHE_LOG_DIR}/${SITE_NAME}-error.log
    CustomLog \\${APACHE_LOG_DIR}/${SITE_NAME}-access.log combined
</VirtualHost>
EOF

a2dissite 000-default >/dev/null 2>&1 || true
a2ensite ${SITE_NAME}
a2enmod rewrite

echo "[5/6] Restarting Apache..."
systemctl enable apache2
systemctl restart apache2

IPV4=$(curl -fsS http://checkip.amazonaws.com || echo "<EC2_PUBLIC_IP>")
echo "[6/6] Deployment complete. Test URLs:"
echo "  http://${IPV4}/index.html"
echo "  http://${IPV4}/login.html"
echo "  http://${IPV4}/register.html"

echo "Tip: For HTTPS, install certbot and enable SSL:"
echo "  sudo apt-get install -y certbot python3-certbot-apache && sudo certbot --apache"
#!/bin/bash
# setup_server.sh
# Run this on your AWS/Ubuntu Server to install the Tech Stack

echo "Updating system..."
sudo apt update && sudo apt upgrade -y

echo "Installing PHP 8.1 and extensions..."
sudo apt install -y php php-cli php-fpm php-mysql php-xml php-curl php-mbstring unzip

echo "Installing PHP Drivers for Redis & MongoDB..."
sudo apt install -y php-redis php-mongodb

echo "Installing Database Servers (MySQL, Redis)..."
sudo apt install -y mysql-server redis-server

echo "Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

echo "Starting Services..."
sudo service mysql start
sudo service redis-server start
sudo service mongod start

echo "Setup Complete!"
