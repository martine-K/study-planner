#!/usr/bin/env bash
cd "$(dirname "$0")/backend" || exit 1
source venv/bin/activate
while true; do python manage.py send_reminders; sleep 60; done
