import paramiko
import time

HOST = "62.171.153.133"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username="root", password="irval556", timeout=30)

def run(cmd):
    print(f"\n>>> {cmd[:150]}")
    _, o, e = ssh.exec_command(cmd, timeout=120)
    out = o.read().decode(errors="replace")
    err = e.read().decode(errors="replace")
    rc = o.channel.recv_exit_status()
    if out.strip():
        lines = out.strip().split("\n")
        for line in lines[-30:]:
            try:
                print(line)
            except:
                print(line.encode("ascii", "replace").decode())
    if rc != 0 and err.strip():
        print(f"ERR: {err.strip()[-500:]}")
    return rc, out

# Fix .env URLs for IP
run("cd /opt/dreamlit && sed -i 's|APP_URL=.*|APP_URL=http://62.171.153.133|' .env")
run("cd /opt/dreamlit && sed -i 's|API_URL=.*|API_URL=http://62.171.153.133/api|' .env")
run("cd /opt/dreamlit && sed -i 's|ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=http://62.171.153.133|' .env")
run("cd /opt/dreamlit && cat .env")

# Check what's using port 80
run("docker ps --format '{{.Names}} {{.Ports}}'")

# Stop any conflicting containers
run("cd /opt/dreamlit && docker compose down 2>/dev/null; true")

# Also stop other projects using port 80
run("docker ps -q | xargs -r docker stop 2>/dev/null; true")

# Start
print("\n=== Starting Dreamlit ===")
run("cd /opt/dreamlit && docker compose up -d")

time.sleep(20)
run("cd /opt/dreamlit && docker compose ps")
run("curl -s -o /dev/null -w 'HTTP %{http_code}' http://localhost:80 || echo 'not ready yet'")
run("cd /opt/dreamlit && docker compose logs --tail=10 backend 2>&1")
run("cd /opt/dreamlit && docker compose logs --tail=10 caddy 2>&1")

print(f"\n=== DONE === Visit: http://{HOST}")
ssh.close()
