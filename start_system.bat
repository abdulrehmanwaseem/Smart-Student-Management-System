@echo off
echo Starting Smart Student Management System...
echo.

echo Starting API Server (FastAPI)...
start "API Server" cmd /k "cd /d API && python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for API to start...
timeout /t 3 /nobreak > nul

echo Starting React Frontend...
start "React App" cmd /k "cd /d UI && npm run dev"

echo.
echo System is starting up!
echo API Server: http://localhost:8000
echo React App: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul