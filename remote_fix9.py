import paramiko

HOST = "37.60.225.35"
USER = "root"
PASS = "irval556"

def run(ssh, cmd, timeout=60):
    print(f"\n>>> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out.strip(): print(out)
    if err.strip(): print(f"STDERR: {err[-500:]}")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS, timeout=15)

# Add to /etc/hosts
run(ssh, "grep -q dreamlit.ee /etc/hosts || echo '37.60.225.35 dreamlit.ee api.dreamlit.ee' >> /etc/hosts")
run(ssh, "cat /etc/hosts | grep dreamlit")

# Now test
run(ssh, "curl -sLk -o /dev/null -w 'Frontend: %{http_code}\\n' https://dreamlit.ee")
run(ssh, "curl -sLk -o /dev/null -w 'API health: %{http_code}\\n' https://api.dreamlit.ee/api/health")
run(ssh, "curl -sLk https://api.dreamlit.ee/api/health")

# Test demo endpoint (no auth needed)
run(ssh, "curl -sLk https://api.dreamlit.ee/api/demo 2>&1 | head -5")

ssh.close()
print("\nDone!")
