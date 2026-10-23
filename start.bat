@echo off
start "Backend" cmd /k "%~dp0start.backend.bat"
start "Frontend" cmd /k "%~dp0start.frontend.bat"
start "Reminders" cmd /k "%~dp0start.reminders.bat"
timeout /t 8 >nul
start http://localhost:5173
