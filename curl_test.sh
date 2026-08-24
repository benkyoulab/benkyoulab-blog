#!/usr/bin/env bash
BASE="http://localhost:3000"
CJ="$LOCALAPPDATA/Temp/cjal.txt"
rm -f "$CJ"

echo "=== 1. CSRF token ==="
CSRF=$(curl -s -c "$CJ" "$BASE/api/auth/csrf" | grep -oE '"csrfToken":"[^"]*"' | cut -d'"' -f4)
echo "CSRF: ${CSRF:0:16}..."

echo "=== 2. Login ==="
HTTP=$(curl -s -b "$CJ" -c "$CJ" -o /dev/null -w "%{http_code} %{redirect_url}" -X POST "$BASE/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "csrfToken=$CSRF" \
  --data-urlencode "email=admin@benkyoulab.online" \
  --data-urlencode "password=password" \
  --data-urlencode "callbackUrl=$BASE/admin/artikel")
echo "login: $HTTP"

echo "=== 3. Fetch admin/artikel list (with cookie) ==="
HTML=$(curl -s -b "$CJ" "$BASE/admin/artikel")
echo "contains Edit button: $(grep -c 'Edit' <<< "$HTML")"
echo "contains DeleteButton (🗑️): $(grep -c '🗑️' <<< "$HTML")"
echo "contains table row: $(grep -cE 'border-b border-gray-50' <<< "$HTML")"
echo "error msg: $(grep -oE 'Harus login|Email atau password salah|Gagal|not-found|cannot' <<< "$HTML" | head -1)"

echo "=== 4. Create a draft article via savePost server action ==="
CSRF2=$(curl -s -b "$CJ" -c "$CJ" "$BASE/admin/artikel/baru" | grep -oE '"csrfToken":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "page csrf ok"

echo "=== Cookie jar contents ==="
grep -E "authjs|session" "$CJ" 2>/dev/null || echo "(no auth cookies found)"