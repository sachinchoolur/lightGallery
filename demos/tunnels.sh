#!/usr/bin/env bash
# Public Cloudflare quick tunnels for the demo apps and the vanilla rig, so
# they can be opened on phones and tablets from any network.
#
#   demos/tunnels.sh start    start missing dev servers, then one tunnel each
#   demos/tunnels.sh status   print the tunnel URLs and process state
#   demos/tunnels.sh qr       print a QR code per URL (needs qrencode)
#   demos/tunnels.sh stop     stop everything this script started
#
# Quick tunnel URLs are random and change on every start. The Vite configs
# already allow *.trycloudflare.com hosts. The Angular app consumes the built
# packages, so rebuild them after changing library code.
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STATE="${LG_TUNNEL_STATE:-$HOME/.cache/lightgallery-demo-tunnels}"
mkdir -p "$STATE"

# name|port|server command, run from the repo root
TARGETS=(
    "react|3003|npx pnpm@9.15.0 --filter lg-demo-react-app dev"
    "vue|3004|npx pnpm@9.15.0 --filter lg-demo-vue-app dev"
    "angular|3005|npx pnpm@9.15.0 --filter lg-demo-angular-app dev"
    "vanilla|5177|npx vite --config dev-vanilla/vite.config.ts"
)

listening() { lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }
alive() { [ -f "$1" ] && kill -0 "$(cat "$1")" 2>/dev/null; }
tunnel_url() {
    grep -Eo 'https://[a-z0-9-]+\.trycloudflare\.com' "$STATE/$1-tunnel.log" 2>/dev/null | head -1
}
wait_for() { # seconds, command...
    local seconds=$1
    shift
    local i
    for ((i = 0; i < seconds * 2; i++)); do
        "$@" && return 0
        sleep 0.5
    done
    return 1
}
has_url() { [ -n "$(tunnel_url "$1")" ]; }
# Run a command in its own session, so closing the terminal (or whatever ran
# this script) does not take the servers and tunnels down with it.
detach() {
    exec perl -MPOSIX -e 'POSIX::setsid() >= 0 or die "setsid: $!"; exec @ARGV or die "exec: $!"' -- nohup "$@"
}
kill_tree() {
    local child
    for child in $(pgrep -P "$1"); do kill_tree "$child"; done
    kill "$1" 2>/dev/null
}

start() {
    local target name port command
    for target in "${TARGETS[@]}"; do
        IFS='|' read -r name port command <<<"$target"
        if listening "$port"; then
            echo "$name: server already listening on $port"
        else
            echo "$name: starting server on $port"
            (cd "$ROOT" && detach $command </dev/null >"$STATE/$name-server.log" 2>&1) &
            echo $! >"$STATE/$name-server.pid"
        fi
    done
    for target in "${TARGETS[@]}"; do
        IFS='|' read -r name port command <<<"$target"
        if ! wait_for 180 listening "$port"; then
            echo "$name: server did not come up, see $STATE/$name-server.log"
            continue
        fi
        if alive "$STATE/$name-tunnel.pid" && has_url "$name"; then
            echo "$name: tunnel already running"
            continue
        fi
        (detach cloudflared tunnel --no-autoupdate --url "http://127.0.0.1:$port" \
            </dev/null >"$STATE/$name-tunnel.log" 2>&1) &
        echo $! >"$STATE/$name-tunnel.pid"
    done
    for target in "${TARGETS[@]}"; do
        IFS='|' read -r name port command <<<"$target"
        wait_for 60 has_url "$name" || echo "$name: no tunnel URL yet, see $STATE/$name-tunnel.log"
    done
    status
}

status() {
    local target name port command server tunnel
    printf '%-8s %-5s %-7s %-7s %s\n' app port server tunnel url
    for target in "${TARGETS[@]}"; do
        IFS='|' read -r name port command <<<"$target"
        listening "$port" && server=up || server=down
        alive "$STATE/$name-tunnel.pid" && tunnel=up || tunnel=down
        printf '%-8s %-5s %-7s %-7s %s\n' "$name" "$port" "$server" "$tunnel" "$(tunnel_url "$name")"
    done
    tunnel_url react >/dev/null && echo "Pages: #combinations #sizes #thumbnails #video #justified #mixed (vanilla: #images #zoom #video ...)"
}

qr() {
    command -v qrencode >/dev/null || { echo "qrencode is not installed (brew install qrencode)"; return 1; }
    local target name port command url
    for target in "${TARGETS[@]}"; do
        IFS='|' read -r name port command <<<"$target"
        url="$(tunnel_url "$name")"
        [ -n "$url" ] || continue
        echo "$name  $url"
        qrencode -t ansiutf8 "$url"
    done
}

stop() {
    local pidfile
    for pidfile in "$STATE"/*.pid; do
        [ -e "$pidfile" ] || continue
        alive "$pidfile" && kill_tree "$(cat "$pidfile")"
        rm -f "$pidfile"
    done
    echo "Stopped the servers and tunnels this script started."
}

case "${1:-status}" in
start) start ;;
status) status ;;
qr) qr ;;
stop) stop ;;
*)
    echo "usage: demos/tunnels.sh start|status|qr|stop"
    exit 1
    ;;
esac
