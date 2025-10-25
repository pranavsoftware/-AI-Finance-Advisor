# AI Finance Advisor - Start All Services
# Run this script in PowerShell

Write-Host "Starting AI Finance Advisor..." -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongoRunning) {
    Write-Host "WARNING: MongoDB is not running!" -ForegroundColor Red
    Write-Host "   Please start MongoDB or use MongoDB Compass" -ForegroundColor Yellow
    Write-Host "   Connection: mongodb://localhost:27017" -ForegroundColor White
    Write-Host ""
}

# Start Backend
Write-Host "Starting Backend API (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'f:\new Project\backend'; Write-Host 'Backend Server' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 2

# Start ML Service
Write-Host "Starting ML Service (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'f:\new Project\ml-service'; Write-Host 'ML Service' -ForegroundColor Green; python app.py"

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'f:\new Project\frontend'; Write-Host 'Frontend App' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "   ML Service: http://localhost:5000" -ForegroundColor White
Write-Host "   API Docs:   http://localhost:8000/api/docs" -ForegroundColor White
Write-Host ""
Write-Host "Close the terminal windows to stop services" -ForegroundColor Yellow
Write-Host ""
