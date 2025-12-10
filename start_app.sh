#!/bin/bash
# start_app.sh
# Run this on AWS to start the live server

# Stop any existing PHP server on port 80 (optional but safe)
sudo pkill php

echo "Starting PHP Server on Port 80..."
# Running in background with nohup
sudo nohup php -S 0.0.0.0:80 -t ~/nexentry > ~/php_server.log 2>&1 &

echo "Server started! Check logs at ~/php_server.log"
