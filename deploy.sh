#!/bin/bash
# Roomies Deployment Script
# Deployments:
# - Landing page (Astro): http://localhost:3000
# - Webapp (Next.js): http://localhost:3001

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LANDING_DIR="$SCRIPT_DIR/landing"
WEBAPP_DIR="$SCRIPT_DIR/webapp"
PID_DIR="/tmp/roomies"
mkdir -p "$PID_DIR"

case "${1:-start}" in
  start)
    echo "Starting Roomies deployments..."

    # Landing page - static Astro build
    if ! kill "$(cat "$PID_DIR/landing.pid" 2>/dev/null)" 2>/dev/null; then
      nohup python3 -m http.server 3000 --directory "$LANDING_DIR/dist" \
        > "$PID_DIR/landing.log" 2>&1 &
      echo $! > "$PID_DIR/landing.pid"
      echo "  Landing: http://localhost:3000"
    fi

    # Webapp - Next.js server
    if ! kill "$(cat "$PID_DIR/webapp.pid" 2>/dev/null)" 2>/dev/null; then
      cd "$WEBAPP_DIR" && \
        nohup node_modules/.bin/next start --port 3001 --hostname 0.0.0.0 \
        > "$PID_DIR/webapp.log" 2>&1 &
      WEBAPP_PID=$!
      echo "$WEBAPP_PID" > "$PID_DIR/webapp.pid"
      sleep 2
      echo "  Webapp: http://localhost:3001"
    fi
    ;;
  stop)
    echo "Stopping Roomies deployments..."
    for pidf in landing webapp; do
      if [ -f "$PID_DIR/${pidf}.pid" ]; then
        kill "$(cat "$PID_DIR/${pidf}.pid")" 2>/dev/null || true
        rm "$PID_DIR/${pidf}.pid"
      fi
    done
    echo "Done."
    ;;
  restart)
    "$0" stop
    sleep 1
    "$0" start
    ;;
  status)
    echo "Roomies deployment status:"
    for entry in "landing:3000" "webapp:3001"; do
      name="${entry%%:*}"
      port="${entry##*:}"
      HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port" 2>/dev/null || echo "000")
      if [ "$HTTP_CODE" = "200" ]; then
        echo "  ${name}: running (http://localhost:$port)"
      else
        echo "  ${name}: not running"
      fi
    done
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
