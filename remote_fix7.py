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

# Test with -L (follow redirects) and -v for verbose
run(ssh, "curl -sLk -o /dev/null -w '%{http_code} %{url_effective}\\n' https://api.dreamlit.ee/api/health 2>&1")
run(ssh, "curl -sLk https://api.dreamlit.ee/api/health 2>&1")
run(ssh, "curl -svk https://api.dreamlit.ee/api/health 2>&1 | head -30")

# Also check frontend content
run(ssh, "curl -sL https://dreamlit.ee 2>&1 | head -5")

ssh.close()
print("Done!")
