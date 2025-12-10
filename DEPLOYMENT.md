# COMPLETE Project Guide: From Scratch to AWS Deployment

This documentation covers the entire lifecycle of the *NexEntry* project, from setting up the local development environment (WSL) to building the application code, and finally deploying it to a live AWS server.

---

# PHASE 1: Local Development Setup (WSL)

Before writing any code, we set up a Linux environment on Windows using WSL (Windows Subsystem for Linux).

## 1. Enable WSL
1.  Open PowerShell as Administrator.
2.  Run: `wsl --install`
3.  Restart your computer.
4.  Open the "Ubuntu" app and set your username/password.

## 2. Install The Tech Stack (Inside WSL)
Open your Ubuntu terminal and run these commands to install PHP, Databases, and extensions.

```bash
# Update Ubuntu
sudo apt update && sudo apt upgrade -y

# Install PHP 8.1 and Extensions
sudo apt install -y php php-cli php-fpm php-mysql php-xml php-curl php-mbstring unzip

# Install PHP Drivers for Redis & MongoDB
sudo apt install -y php-redis php-mongodb

# Install Database Servers
sudo apt install -y mysql-server redis-server
```

## 3. Install MongoDB (Special Step)
MongoDB is not in the default list, so we add its source manually:
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
```

## 4. Configure Local Databases
Start the services:
```bash
sudo service mysql start
sudo service redis-server start
sudo service mongod start
```

Create the MySQL Database:
```bash
sudo mysql
```

Inside the MySQL prompt:
```sql
CREATE DATABASE guvi_db;
CREATE USER 'guvi_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON guvi_db.* TO 'guvi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

# PHASE 2: Building the Application (Code)

We built the application structure in `s:\project 2\Guvi intern\`.

## 1. Directory Structure

```
assets/
  css/
    - style.css       (Dark theme styling)
  js/
    - register.js     (AJAX for registration)
    - login.js        (AJAX for login)
    - profile.js      (AJAX for profile loading)
  php/
    - register.php    (MySQL Insert)
    - login.php       (MySQL Verify + Redis Session)
    - profile.php     (MongoDB Update/Fetch + Redis Auth)
index.html          (Landing Page)
register.html       (Signup Form)
login.html          (Signin Form)
profile.html        (User Dashboard)
schema.sql          (Database Table Design)
```

## 2. Key Features Implemented
*   *MySQL*: Used to store secure user credentials (Username, Email, Hashed Password).
*   *Redis*: Used for Session Management. When a user logs in, a token is generated and stored in RAM (Redis) for fast access.
*   *MongoDB*: Used to store the User Profile (Age, DOB, Contact). This demonstrates NoSQL flexibility.
*   *AJAX (jQuery)*: Used to submit all forms without reloading the page.

---

# PHASE 3: AWS Deployment (Go Live)

Finally, we move the code from our local computer to the internet.

## 1. Launch AWS Server
1.  Log in to *AWS Console*.
2.  Launch a new *EC2 Instance* (Ubuntu 22.04, t2.micro or t3.micro).
3.  *Security Group: Open Port **80 (HTTP)* and *22 (SSH)* to 0.0.0.0/0.
4.  Download the .pem key file.

## 2. Connect via SSH
From your local terminal:
```powershell
ssh -i "nexentry-key.pem" ubuntu@YOUR_AWS_IP
```

## 3. Install Stack on AWS
Once connected to the AWS terminal, run the *exact same commands* from *Phase 1 (Step 2 & 3)*.
*   Install PHP, MySQL, Redis, MongoDB.
*   Start all services (systemctl start ...).
*   Create the guvi_db in MySQL (same SQL commands as Phase 1).

## 4. Upload Code
From your local computer (not the SSH window), send the files to the cloud. Make sure to include the `assets` folder.
```powershell
scp -r -i "nexentry-key.pem" * ubuntu@YOUR_AWS_IP:~/nexentry/
```

## 5. Start the Live Server
Back in the AWS SSH window:
```bash
# Run PHP on Port 80, detached from terminal
sudo nohup php -S 0.0.0.0:80 -t ~/nexentry > ~/php_server.log 2>&1 &
```

## 6. Result
The website is now live!

**Access Link**: `http://10.18.217.55:8000`
*(Running on Local WiFi Network)*

**Expected Interface**:
![Live Server Preview](uploaded_image_1765365644786.png)

