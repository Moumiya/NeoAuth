# NeoAuth

Simple PHP + SQLite auth demo with Register, Login, Profile, and Logout.

## Run Locally

- Requirements: PHP 8.x with `pdo_sqlite` and `sqlite3` enabled.
- Start a local server from the project root:

```
php -S localhost:8000 -t .
```

Open:
- http://localhost:8000/register.html
- http://localhost:8000/login.html

## Deploy on Ubuntu EC2 (Apache + PHP)

One-shot script installs Apache/PHP/SQLite, clones the repo, configures a vhost, and prints your public URLs.

Run on the instance:

```
curl -fsSL https://raw.githubusercontent.com/Moumiya/NeoAuth/main/setup_server.sh -o setup_server.sh
sudo bash setup_server.sh
```

Or from your laptop:

```
scp -i KEY.pem setup_server.sh ubuntu@EC2_PUBLIC_IP:~
ssh -i KEY.pem ubuntu@EC2_PUBLIC_IP "sudo bash ~/setup_server.sh"
```

## CI Deploy (GitHub Actions)

A workflow is included at `.github/workflows/deploy.yml`. On push to `main`, it SSHes into your EC2 and runs the setup script.

Before it works, add these Repository Secrets:
- `EC2_HOST` – public IPv4/DNS of the instance (e.g., `34.x.x.x`).
- `EC2_USER` – SSH user (Ubuntu images typically use `ubuntu`).
- `EC2_SSH_KEY` – private key contents for that instance (PEM). Paste the whole key as the secret value.

Then push to `main` to trigger deployment.

## Notes

- SQLite database file is created under `data/app.db` at runtime. Ensure the directory is writable by the web server.
- For HTTPS, use `certbot --apache` after pointing a domain to the instance.
