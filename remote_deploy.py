import paramiko
import tarfile
import time
import sys
import os
import io

HOST = "62.171.153.133"
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
        print(text.encode('ascii', 'replace').decode('ascii'))

def run(ssh, cmd, timeout=600):
    safe_print(f"\n>>> {cmd[:200]}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode(errors='replace')
    err = stderr.read().decode(errors='replace')
    rc = stdout.channel.recv_exit_status()
    if out.strip():
        lines = out.strip().split('\n')
        safe_print('\n'.join(lines[-30:]) if len(lines) > 30 else out.strip())
    if err.strip() and rc != 0:
        safe_print(f"STDERR: {err[-500:]}")
    if rc != 0:
        safe_print(f"Exit code: {rc}")
    return rc, out

def main():
    print(f"=== Deploying to {HOST} ===\n")

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
    print(f"Archive: {len(buf.getvalue()) / 1024 / 1024:.1f} MB")

    # Connect
    print(f"Connecting to {HOST}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=30)
    print("Connected!")

    # System info
    run(ssh, "uname -a && free -h | head -2 && df -h / | tail -1")

    # Upload
    print("\n=== Uploading files ===")
    run(ssh, f"mkdir -p {APP_DIR}")
    sftp = ssh.open_sftp()
    sftp.putfo(buf, f"{APP_DIR}/app.tar.gz")
    print("Upload complete!")
    run(ssh, f"cd {APP_DIR} && tar xzf app.tar.gz && rm app.tar.gz")

    # Install Docker
    print("\n=== Installing Docker ===")
    rc, out = run(ssh, "docker --version 2>&1")
    if "Docker version" not in out:
        run(ssh, "curl -fsSL https://get.docker.com | sh 2>&1 | tail -10", timeout=300)
        run(ssh, "systemctl enable docker && systemctl start docker")
    run(ssh, "docker compose version 2>&1 || apt-get install -y docker-compose-plugin 2>&1 | tail -5")

    # Create .env
    print("\n=== Configuring .env ===")
    run(ssh, f"""cd {APP_DIR} && if [ ! -f .env ]; then
JWT_SECRET=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -hex 16)
cat > .env << ENVEOF
DB_PASSWORD=$DB_PASSWORD
ANTHROPIC_API_KEY=sk-ant-CHANGE_ME
OPENAI_API_KEY=sk-CHANGE_ME
STRIPE_SECRET_KEY=sk_test_CHANGE_ME
STRIPE_PUBLISHABLE_KEY=pk_test_CHANGE_ME
STRIPE_WEBHOOK_SECRET=whsec_CHANGE_ME
STRIPE_PRICE_ID=price_CHANGE_ME
RESEND_API_KEY=re_CHANGE_ME
JWT_SECRET=$JWT_SECRET
APP_URL=http://{HOST}
API_URL=http://{HOST}/api
ALLOWED_ORIGINS=http://{HOST}
FROM_EMAIL=hello@dreamlit.ee
GOOGLE_CLIENT_ID=CHANGE_ME
ENVEOF
echo "Created .env"
else
echo ".env already exists, keeping it"
fi""")

    # Stop old containers
    run(ssh, f"cd {APP_DIR} && docker compose down 2>&1 || true")

    # Build
    print("\n=== Building containers (this takes several minutes) ===")
    rc, _ = run(ssh, f"cd {APP_DIR} && docker compose build --no-cache 2>&1")
    if rc != 0:
        print("BUILD FAILED!")
        ssh.close()
        return

    # Start
    print("\n=== Starting services ===")
    run(ssh, f"cd {APP_DIR} && docker compose up -d")

    # Wait and check
    print("\nWaiting 20s for services...")
    time.sleep(20)
    run(ssh, f"cd {APP_DIR} && docker compose ps")
    run(ssh, f"curl -s -o /dev/null -w 'HTTP %{{http_code}}' http://localhost:80 2>&1 || echo 'not ready'")

    print(f"\n=== DEPLOY COMPLETE ===")
    print(f"Visit: http://{HOST}")

    ssh.close()

if __name__ == "__main__":
    main()
