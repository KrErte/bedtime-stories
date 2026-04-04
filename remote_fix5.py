import paramiko
import time

HOST = "37.60.225.35"
USER = "root"
PASS = "irval556"

def run(ssh, cmd, timeout=120):
    print(f"\n>>> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out.strip(): print(out[-2000:])
    if err.strip(): print(f"STDERR: {err[-500:]}")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=15)
print("Connected!")

# Clear Caddy cert cache and restart
print("\n=== Restarting Caddy for fresh cert attempt ===")
run(ssh, "cd /opt/dreamlit && docker compose restart caddy 2>&1")

print("\nWaiting 30s for cert generation...")
time.sleep(30)

# Check caddy logs
print("\n=== Caddy logs (last 15) ===")
run(ssh, "cd /opt/dreamlit && docker compose logs caddy --tail=15 2>&1")

# Test HTTPS
print("\n=== Testing HTTPS ===")
run(ssh, "curl -sk -o /dev/null -w 'https://dreamlit.ee -> %{http_code}\\n' https://dreamlit.ee")
run(ssh, "curl -sk -o /dev/null -w 'https://api.dreamlit.ee/api/health -> %{http_code}\\n' https://api.dreamlit.ee/api/health")
run(ssh, "curl -sk https://api.dreamlit.ee/api/health")

ssh.close()
print("\nDone!")
