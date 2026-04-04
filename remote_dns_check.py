import paramiko
import time

HOST = "37.60.225.35"
USER = "root"
PASS = "irval556"

def run(ssh, cmd, timeout=60):
    print(f"\n>>> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode()
    err = stderr.read().decode()
    exit_code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out)
    if err.strip():
        print(f"STDERR: {err[-500:]}")
    return exit_code, out, err

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=15)
print("Connected!")

# Check DNS
print("\n=== DNS Check ===")
run(ssh, "dig +short dreamlit.ee A 2>/dev/null || nslookup dreamlit.ee 2>&1 | tail -3")
run(ssh, "dig +short api.dreamlit.ee A 2>/dev/null || nslookup api.dreamlit.ee 2>&1 | tail -3")

# Check HTTPS
print("\n=== HTTPS Check ===")
run(ssh, "curl -s -o /dev/null -w 'https://dreamlit.ee -> %{http_code}\\n' https://dreamlit.ee 2>&1 || echo 'not ready yet'")
run(ssh, "curl -s -o /dev/null -w 'https://api.dreamlit.ee/api/health -> %{http_code}\\n' https://api.dreamlit.ee/api/health 2>&1 || echo 'not ready yet'")

# Check Caddy logs for cert
print("\n=== Caddy logs ===")
run(ssh, "cd /opt/dreamlit && docker compose logs caddy --tail=20 2>&1")

ssh.close()
