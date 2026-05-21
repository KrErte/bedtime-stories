import paramiko

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

# Check if api cert was obtained
run(ssh, "cd /opt/dreamlit && docker compose logs caddy 2>&1 | grep -i 'certificate obtained'")

# Test api internally
run(ssh, "docker exec dreamlit-caddy-1 wget -qO- http://backend:8080/api/health 2>&1")

# Try curl to api via caddy internally
run(ssh, "curl -sk https://api.dreamlit.ee/api/health 2>&1")
run(ssh, "curl -sk http://api.dreamlit.ee/api/health 2>&1")

ssh.close()
