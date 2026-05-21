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

# Stop existing postgres on host if any
print("\n=== Stopping conflicting services ===")
run(ssh, "systemctl stop postgresql 2>/dev/null; systemctl disable postgresql 2>/dev/null; echo done")

# Pull latest
print("\n=== Pulling latest code ===")
run(ssh, "cd /opt/dreamlit && git pull")

# Restart
print("\n=== Restarting containers ===")
run(ssh, "cd /opt/dreamlit && docker compose down 2>&1")
run(ssh, "cd /opt/dreamlit && docker compose up -d 2>&1", timeout=120)

# Wait and check
print("\n=== Waiting 15 seconds for services... ===")
time.sleep(15)
run(ssh, "cd /opt/dreamlit && docker compose ps 2>&1")
run(ssh, "cd /opt/dreamlit && docker compose logs --tail=20 2>&1")

print("\n=== Checking HTTP ===")
run(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost:80 2>&1 || echo 'frontend not ready'")
run(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/api/health 2>&1 || echo 'backend not ready'")

ssh.close()
print("\nDone!")
