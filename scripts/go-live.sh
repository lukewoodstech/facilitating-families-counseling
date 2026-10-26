#!/usr/bin/env bash
# Flip the site from lukewoodstech.github.io/facilitating-families-counseling/
# to https://facilitatingfamiliescounseling.com once Emree's DNS points at GitHub Pages.
#
# Run it as many times as you like; every step is idempotent.
#   scripts/go-live.sh            # check DNS, then flip + deploy + enforce HTTPS
#   scripts/go-live.sh --check    # only report DNS state, change nothing
set -euo pipefail

REPO="lukewoodstech/facilitating-families-counseling"
DOMAIN="facilitatingfamiliescounseling.com"
WORKFLOW="deploy.yml"
GH_IPS=(185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153)
WWW_TARGET="lukewoodstech.github.io."

check_only=false
[[ "${1:-}" == "--check" ]] && check_only=true

say()  { printf '\n\033[1m%s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
bad()  { printf '  \033[31m✗\033[0m %s\n' "$*"; }

# ---------------------------------------------------------------- DNS check
say "DNS for $DOMAIN (asking Google's resolver so we see the public state)"
dns_ok=true

apex=$(dig +short A "$DOMAIN" @8.8.8.8 | sort)
if [[ -z "$apex" ]]; then
  bad "no A records on the apex yet"; dns_ok=false
else
  for ip in "${GH_IPS[@]}"; do
    if grep -qx "$ip" <<<"$apex"; then ok "A $ip"; else bad "A $ip missing"; dns_ok=false; fi
  done
  while read -r ip; do
    [[ -n "$ip" ]] && ! printf '%s\n' "${GH_IPS[@]}" | grep -qx "$ip" && { bad "stray A record $ip (remove it)"; dns_ok=false; }
  done <<<"$apex"
fi

www=$(dig +short CNAME "www.$DOMAIN" @8.8.8.8)
if [[ "$www" == "$WWW_TARGET" ]]; then ok "CNAME www → $www"
else bad "CNAME www is '${www:-unset}', want $WWW_TARGET"; dns_ok=false; fi

mx=$(dig +short MX "$DOMAIN" @8.8.8.8 | wc -l | tr -d ' ')
if [[ "$mx" -gt 0 ]]; then ok "MX records still present ($mx), mail is safe"
else bad "MX records are GONE, Emree's email will break. Stop and fix DNS first."; dns_ok=false; fi

if ! $dns_ok; then
  echo
  echo "DNS is not ready. Nothing was changed. Re-run after the records propagate (usually minutes, up to 48h)."
  exit 1
fi
$check_only && { echo; echo "DNS looks right. Run without --check to go live."; exit 0; }

# ------------------------------------------------------- GitHub Pages domain
say "Setting the custom domain on GitHub Pages"
current=$(gh api "repos/$REPO/pages" --jq '.cname // ""')
if [[ "$current" == "$DOMAIN" ]]; then ok "already set to $DOMAIN"
else gh api -X PUT "repos/$REPO/pages" -f cname="$DOMAIN" >/dev/null && ok "set to $DOMAIN"; fi

# ------------------------------------------------- build for the root path
say "Switching the build to the root path"
if [[ "$(gh variable get CUSTOM_DOMAIN_ENABLED -R "$REPO" 2>/dev/null || true)" == "true" ]]; then
  ok "CUSTOM_DOMAIN_ENABLED already true"
else
  gh variable set CUSTOM_DOMAIN_ENABLED --body true -R "$REPO" && ok "CUSTOM_DOMAIN_ENABLED=true"
fi

say "Deploying"
gh workflow run "$WORKFLOW" -R "$REPO"
sleep 5
run_id=$(gh run list -R "$REPO" --workflow "$WORKFLOW" -L 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$run_id" -R "$REPO" --exit-status && ok "deployed (run $run_id)"

# ------------------------------------------------------------------- HTTPS
say "Waiting for GitHub to issue the TLS certificate (can take a few minutes)"
for _ in $(seq 1 40); do
  state=$(gh api "repos/$REPO/pages" --jq '.https_certificate.state // "none"')
  if [[ "$state" == "approved" || "$state" == "issued" ]]; then
    ok "certificate $state"
    break
  fi
  printf '  … certificate state: %s\n' "$state"
  sleep 15
done

if gh api "repos/$REPO/pages" --jq '.https_enforced' | grep -q true; then
  ok "HTTPS already enforced"
else
  if gh api -X PUT "repos/$REPO/pages" -F https_enforced=true >/dev/null 2>&1; then ok "HTTPS enforced"
  else bad "could not enforce HTTPS yet (cert not ready). Re-run this script in a few minutes, it will finish the job."; fi
fi

say "Final check"
for url in "https://$DOMAIN/" "https://www.$DOMAIN/" "https://$DOMAIN/about"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 20 "$url" || echo "000")
  if [[ "$code" == "200" ]]; then ok "$url → $code"; else bad "$url → $code"; fi
done
echo
echo "Done. Old preview URL now redirects to the domain. Next: in Google Sites, unpublish or remove the"
echo "custom-URL mapping so Emree isn't confused by two sites; optional: verify the domain at"
echo "https://github.com/settings/pages (Add a domain) to lock it to your account."
