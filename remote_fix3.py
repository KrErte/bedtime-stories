import paramiko
import time

HOST = "37.60.225.35"
USER = "root"
PASS = "irval556"

def run(ssh, cmd, timeout=300):
    print(f"\n>>> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode()
    err = stderr.read().decode()
    exit_code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out[-3000:] if len(out) > 3000 else out)
    if err.strip():
        print(f"STDERR: {err[-1000:]}")
    if exit_code != 0:
        print(f"Exit code: {exit_code}")
    return exit_code, out, err

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
print(f"Connecting to {HOST}...")
ssh.connect(HOST, username=USER, password=PASS, timeout=15)
print("Connected!")

# Pull latest
print("\n=== Pull and rebuild backend ===")
run(ssh, "cd /opt/dreamlit && git pull", timeout=60)

# Reset DB volume (fresh start) and rebuild backend
print("\n=== Rebuilding backend ===")
run(ssh, "cd /opt/dreamlit && docker compose down 2>&1", timeout=60)
run(ssh, "docker volume rm dreamlit_pg-data 2>/dev/null; echo 'db volume cleared'")
run(ssh, "cd /opt/dreamlit && docker compose build backend 2>&1 | tail -10", timeout=600)

print("\n=== Starting everything ===")
run(ssh, "cd /opt/dreamlit && docker compose up -d 2>&1", timeout=120)

print("\n=== Waiting 30s for startup ===")
time.sleep(30)

run(ssh, "cd /opt/dreamlit && docker compose ps 2>&1")

print("\n=== Backend logs ===")
run(ssh, "cd /opt/dreamlit && docker compose logs backend --tail=15 2>&1")

print("\n=== Testing ===")
run(ssh, "curl -s -o /dev/null -w 'Caddy port 80: %{http_code}\\n' http://localhost:80 2>&1 || echo 'port 80 not responding'")
run(ssh, "curl -s -o /dev/null -w 'Backend health: %{http_code}\\n' http://localhost:8080/api/health 2>&1 || echo 'backend not responding'")
# Test via docker network
run(ssh, "docker exec dreamlit-caddy-1 wget -qO- http://frontend:80 2>&1 | head -3 || echo 'caddy->frontend failed'")
run(ssh, "docker exec dreamlit-caddy-1 wget -qO- http://backend:8080/api/health 2>&1 || echo 'caddy->backend failed'")

ssh.close()
print("\nDone!")
