import paramiko, tarfile, time, os, io, sys

HOST = "37.60.225.35"
USER = "root"
PASS = "irval556"
APP_DIR = "/opt/dreamlit"
LOCAL_DIR = os.path.dirname(os.path.abspath(__file__))

INCLUDE = [
    "docker-compose.yml",
    "Caddyfile",
    ".env.example",
    "backend",
    "frontend",
]
EXCLUDE = ["node_modules", ".angular", "dist", "target", ".git", "__pycache__", "remote_", ".playwright-mcp"]

def should_skip(path):
    return any(p in path for p in EXCLUDE)

def safe_print(text):
    try:
        print(text)
    except UnicodeEncodeError:
        print(text.encode("ascii", "replace").decode("ascii"))

def run(ssh, cmd, timeout=600):
    safe_print(f"\n>>> {cmd[:150]}")
    _, o, e = ssh.exec_command(cmd, timeout=timeout)
    out = o.read().decode(errors="replace")
    err = e.read().decode(errors="replace")
    rc = o.channel.recv_exit_status()
    if out.strip():
        lines = out.strip().split("\n")
        for line in lines[-25:]:
            safe_print(line)
    if rc != 0 and err.strip():
        safe_print(f"ERR: {err.strip()[-500:]}")
    return rc, out

def main():
    print(f"=== Updating LIVE dreamlit.ee ({HOST}) ===\n")

    # Create tarball
    print("Creating archive...")
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w:gz") as tar:
        for item in INCLUDE:
            full = os.path.join(LOCAL_DIR, item)
            if os.path.isfile(full):
                tar.add(full, arcname=item)
            elif os.path.isdir(full):
                for root, dirs, files in os.walk(full):
                    rel_root = os.path.relpath(root, LOCAL_DIR)
                    if should_skip(rel_root):
                        dirs.clear()
                        continue
                    for f in files:
                        rel = os.path.join(rel_root, f).replace("\\", "/")
                        if not should_skip(rel):
                            tar.add(os.path.join(root, f), arcname=rel)
    buf.seek(0)
    safe_print(f"Archive: {len(buf.getvalue()) / 1024 / 1024:.1f} MB")

    # Connect
    print(f"Connecting to {HOST}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)
    print("Connected!")

    run(ssh, "uname -a")

    # Upload
    print("\n=== Uploading files ===")
    run(ssh, f"mkdir -p {APP_DIR}")
    sftp = ssh.open_sftp()
    sftp.putfo(buf, f"{APP_DIR}/app.tar.gz")
    print("Upload complete!")
    run(ssh, f"cd {APP_DIR} && tar xzf app.tar.gz && rm app.tar.gz")

    # Restore Caddyfile for domain-based setup (live uses domains, not IP)
    run(ssh, f"""cat > {APP_DIR}/Caddyfile << 'EOF'
dreamlit.ee {{
    reverse_proxy frontend:80
}}

api.dreamlit.ee {{
    reverse_proxy backend:8080
}}
EOF""")

    # Fix frontend prod environment to use api.dreamlit.ee
    run(ssh, f"""cat > {APP_DIR}/frontend/src/environments/environment.prod.ts << 'EOF'
export const environment = {{
  production: true,
  apiUrl: 'https://api.dreamlit.ee/api',
  stripePublishableKey: '',
  googleClientId: '',
}};
EOF""")

    # Keep existing .env if it exists
    rc, out = run(ssh, f"test -f {APP_DIR}/.env && echo EXISTS")
    if "EXISTS" not in out:
        print("No .env found, creating one...")
        run(ssh, f"""cd {APP_DIR} && JWT_SECRET=$(openssl rand -hex 32) && DB_PASSWORD=$(openssl rand -hex 16) && cat > .env << ENVEOF
DB_PASSWORD=$DB_PASSWORD
ANTHROPIC_API_KEY=sk-ant-CHANGE_ME
OPENAI_API_KEY=sk-CHANGE_ME
STRIPE_SECRET_KEY=sk_test_CHANGE_ME
STRIPE_PUBLISHABLE_KEY=pk_test_CHANGE_ME
STRIPE_WEBHOOK_SECRET=whsec_CHANGE_ME
STRIPE_PRICE_ID=price_CHANGE_ME
RESEND_API_KEY=re_CHANGE_ME
JWT_SECRET=$JWT_SECRET
APP_URL=https://dreamlit.ee
API_URL=https://api.dreamlit.ee
ALLOWED_ORIGINS=https://dreamlit.ee
FROM_EMAIL=hello@dreamlit.ee
GOOGLE_CLIENT_ID=CHANGE_ME
ENVEOF""")
    else:
        print(".env exists, keeping it")

    # Rebuild and restart
    print("\n=== Rebuilding containers ===")
    run(ssh, f"cd {APP_DIR} && docker compose down 2>/dev/null; true")
    rc, _ = run(ssh, f"cd {APP_DIR} && docker compose build --no-cache 2>&1")
    if rc != 0:
        print("BUILD FAILED!")
        ssh.close()
        return

    print("\n=== Starting services ===")
    run(ssh, f"cd {APP_DIR} && docker compose up -d")
    time.sleep(25)
    run(ssh, f"cd {APP_DIR} && docker compose ps")
    run(ssh, "curl -s -o /dev/null -w 'HTTP %{http_code}' http://localhost:80")

    print(f"\n=== LIVE UPDATE COMPLETE ===")
    print(f"Visit: https://dreamlit.ee")
    ssh.close()

if __name__ == "__main__":
    main()
