#!/usr/bin/env bash
cd "$(dirname "$0")/backend" || exit 1
[ -d venv ] || python3 -m venv venv
source venv/bin/activate
pip install -q -r requirements.txt
python manage.py makemigrations accounts planner
python manage.py migrate
python manage.py runserver
