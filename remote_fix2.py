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

# Find what's using port 80 and 443
print("\n=== Finding conflicting services on ports 80, 443 ===")
run(ssh, "ss -tlnp | grep -E ':80|:443'")
run(ssh, "systemctl list-units --type=service --state=running | grep -iE 'nginx|apache|httpd|caddy'")

# Stop conflicting web servers
print("\n=== Stopping conflicting web servers ===")
run(ssh, "systemctl stop nginx 2>/dev/null; systemctl disable nginx 2>/dev/null; echo 'nginx stopped'")
run(ssh, "systemctl stop apache2 2>/dev/null; systemctl disable apache2 2>/dev/null; echo 'apache stopped'")
run(ssh, "systemctl stop httpd 2>/dev/null; systemctl disable httpd 2>/dev/null; echo 'httpd stopped'")

# Kill anything still on 80/443
run(ssh, "fuser -k 80/tcp 2>/dev/null; fuser -k 443/tcp 2>/dev/null; echo 'ports freed'")
time.sleep(2)

# Restart caddy container
print("\n=== Starting Caddy ===")
run(ssh, "cd /opt/dreamlit && docker compose up -d 2>&1", timeout=60)

time.sleep(10)

# Check
print("\n=== Status ===")
run(ssh, "cd /opt/dreamlit && docker compose ps 2>&1")

print("\n=== Testing endpoints ===")
run(ssh, "curl -s -o /dev/null -w 'Frontend: %{http_code}\\n' http://localhost:80")
run(ssh, "curl -s http://localhost:80 2>&1 | head -5")

# Check backend logs
print("\n=== Backend logs (last 30 lines) ===")
run(ssh, "cd /opt/dreamlit && docker compose logs backend --tail=30 2>&1")

ssh.close()
print("\nDone!")
