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
    if out.strip(): print(out[-2000:])
    if err.strip(): print(f"STDERR: {err[-500:]}")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=15)

# Test everything
print("=== Final check ===")
run(ssh, "curl -s -o /dev/null -w 'https://dreamlit.ee -> %{http_code}\\n' https://dreamlit.ee")
run(ssh, "curl -s -o /dev/null -w 'https://api.dreamlit.ee/api/health -> %{http_code}\\n' https://api.dreamlit.ee/api/health")
run(ssh, "curl -s https://api.dreamlit.ee/api/health")
run(ssh, "cd /opt/dreamlit && docker compose ps 2>&1")

ssh.close()
