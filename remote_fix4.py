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

# Check what global DNS says
run(ssh, "dig +short dreamlit.ee @8.8.8.8")
run(ssh, "dig +short api.dreamlit.ee @8.8.8.8")
run(ssh, "dig +short dreamlit.ee @1.1.1.1")
run(ssh, "dig +short api.dreamlit.ee @1.1.1.1")

ssh.close()
