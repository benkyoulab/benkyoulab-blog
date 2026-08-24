#!/usr/bin/env bash
BASE="http://localhost:3000"
CJ="$LOCALAPPDATA/Temp/cl3.txt"
rm -f "$CJ"

echo "=== 1. CSRF ==="
CSRF=$(curl -s -c "$CJ" "$BASE/api/auth/csrf" | grep -oE '"csrfToken":"[^"]*"' | cut -d'"' -f4)
echo "CSRF: ${CSRF:0:20}"

echo "=== 2. Login ==="
curl -s -b "$CJ" -c "$CJ" -o /dev/null -w "login: status=%{http_code} loc=%{redirect_url}\n" \
  -X POST "$BASE/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "csrfToken=$CSRF" \
  --data-urlencode "email=admin@benkyoulab.online" \
  --data-urlencode "password=password" \
  --data-urlencode "callbackUrl=$BASE/admin/artikel"

echo "=== 3. Session cookie ==="
grep -i "authjs.session" "$CJ" | head -1 || echo "(none)"

echo "=== 4. Access /admin/artikel ==="
curl -s -b "$CJ" -o /tmp/art.html -w "page status: %{http_code}\n" "$BASE/admin/artikel"

echo "=== 5. Check content ==="
grep -oE 'href="/admin/artikel/[0-9]+/edit"|Edit|🗑|trashed|Harus login|Gagal' /tmp/art.html | head -10 || echo "no matches"