#!/usr/bin/env bash
# Starts backend, frontend and the reminder loop together. Ctrl+C stops all.
D="$(cd "$(dirname "$0")" && pwd)"
trap 'kill 0' EXIT
bash "$D/start.backend.sh" & bash "$D/start.frontend.sh" & bash "$D/start.reminders.sh" &
wait
