import paramiko, time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("62.171.153.133", username="root", password="irval556", timeout=30)

def run(cmd):
    print(f">>> {cmd[:120]}")
    _, o, e = ssh.exec_command(cmd, timeout=120)
    out = o.read().decode(errors="replace")
    rc = o.channel.recv_exit_status()
    if out.strip():
        for line in out.strip().split("\n")[-20:]:
            try: print(line)
            except: pass
    return rc, out

# Kill the rogue caddy process
run("kill $(lsof -t -i:80) 2>/dev/null; true")
run("kill $(lsof -t -i:443) 2>/dev/null; true")
time.sleep(2)

# Also stop system caddy if installed
run("systemctl stop caddy 2>/dev/null; systemctl disable caddy 2>/dev/null; true")

# Verify ports free
run("ss -tlnp | grep ':80\\|:443'")

# Stop and restart dreamlit fully
run("cd /opt/dreamlit && docker compose down")
time.sleep(3)
run("cd /opt/dreamlit && docker compose up -d")
time.sleep(20)
run("cd /opt/dreamlit && docker compose ps")
run("curl -s -o /dev/null -w 'HTTP %{http_code}' http://localhost:80")
run("cd /opt/dreamlit && docker compose logs --tail=5 caddy 2>&1")

print(f"\nVisit: http://62.171.153.133")
ssh.close()
