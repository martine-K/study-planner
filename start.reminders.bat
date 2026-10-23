@echo off
rem Checks every minute and emails students 30 minutes before a study session.
cd /d "%~dp0backend"
call venv\Scripts\activate
:loop
python manage.py send_reminders
timeout /t 60 /nobreak >nul
goto loop
