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

# Flush DNS cache
run(ssh, "systemd-resolve --flush-caches 2>/dev/null; resolvectl flush-caches 2>/dev/null; echo 'cache flushed'")

# Restart systemd-resolved
run(ssh, "systemctl restart systemd-resolved 2>/dev/null; echo done")

# Now test
run(ssh, "dig +short api.dreamlit.ee")
run(ssh, "curl -sLk -o /dev/null -w 'api health: %{http_code}\\n' https://api.dreamlit.ee/api/health")
run(ssh, "curl -sLk https://api.dreamlit.ee/api/health")

ssh.close()
print("Done!")
