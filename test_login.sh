#!/usr/bin/env bash
BASE="https://benkyoulab-blog.vercel.app"
CJ="$LOCALAPPDATA/Temp/cj5.txt"
rm -f "$CJ"
# Get CSRF token
CSRF=$(curl -s -c "$CJ" "$BASE/api/auth/csrf" | grep -oE '"csrfToken":"[^"]*"' | cut -d'"' -f4)
echo "CSRF: $CSRF"
# Perform login
curl -s -b "$CJ" -c "$CJ" -o /dev/null -w "HTTP STATUS: %{http_code}\\nREDIRECT: %{redirect_url}\\n" \
  -X POST "$BASE/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "csrfToken=$CSRF" \
  --data-urlencode "email=admin@benkyoulab.online" \
  --data-urlencode "password=password" \
  --data-urlencode "callbackUrl=$BASE/admin"
# Check for session cookie
SESSION_COOKIE=$(grep -i authjs "$CJ" | head -1)
echo "SESSION COOKIE: $SESSION_COOKIE"