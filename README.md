# AZ-900 Personal Study Planner (React + Django)

```
az900-study-planner/
├── backend/                 Django REST API
│   ├── config/              settings, urls, wsgi
│   ├── accounts/            custom User (student/teacher), signup, login
│   └── planner/             Block model, plan generator, reports, AI helper
│       └── management/commands/  send_reminders, send_weekly_reports
└── frontend/                React (Vite)
    └── src/ api.js · context/ · components/ · pages/ · styles.css
```

## Quick start (scripts)
- Windows: double-click `start.bat` (or `start.backend.bat`, `start.frontend.bat`, `start.reminders.bat` separately)
- Mac/Linux: `./start.sh` (or the individual `start.*.sh` files)

The reminder script checks every minute, so no cron is needed. Weekly reports: `python manage.py send_weekly_reports`.

## Run manually
### Backend
```
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations accounts planner && python manage.py migrate
python manage.py runserver
```
## Run frontend
```
cd frontend && npm install && npm run dev      # http://localhost:5173
```
## Emails (optional SMTP; otherwise printed in the terminal)
Set EMAIL_HOST, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD (see backend/.env.example), then schedule:
- Every minute: `python manage.py send_reminders`  (emails 30 min before a study block)
- Weekly (Sunday evening): `python manage.py send_weekly_reports`  (student + teacher)

## AI Study Buddy
Set `ANTHROPIC_API_KEY` to enable live answers; otherwise a demo reply is returned.

## Flow
Sign up (teacher first, then students enter the teacher's email) → Planner > Generate plan →
Start a study block → 30-min focus timer → automatic laughter break → Progress page / Teacher page.
