@echo off
cd /d "%~dp0backend"
if not exist venv ( python -m venv venv )
call venv\Scripts\activate
pip install -q -r requirements.txt
python manage.py makemigrations accounts planner
python manage.py migrate
echo Backend running at http://localhost:8000
python manage.py runserver
