# SOC2 Compass — Start both backend and frontend in parallel
Write-Host "Starting SOC2 Compass..." -ForegroundColor Cyan

$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; npm run dev" -PassThru
$frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm run dev" -PassThru

Write-Host ""
Write-Host "✅ Backend  → http://localhost:3001" -ForegroundColor Green
Write-Host "✅ Frontend → http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
