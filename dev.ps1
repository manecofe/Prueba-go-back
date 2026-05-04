# PowerShell script for common development tasks

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('install', 'dev', 'build', 'docker-up', 'docker-down', 'seed', 'reset', 'studio', 'migrate', 'test-api', 'logs', 'clean')]
    [string]$Command = 'help'
)

function Show-Help {
    Write-Host "`n=== Task Manager Backend - Dev Scripts ===" -ForegroundColor Cyan
    Write-Host "`nUsage: .\dev.ps1 <command>`n"
    Write-Host "Available commands:" -ForegroundColor Yellow
    Write-Host "  install      - Install npm dependencies"
    Write-Host "  dev          - Start development server"
    Write-Host "  build        - Build for production"
    Write-Host "  docker-up    - Start Docker containers"
    Write-Host "  docker-down  - Stop Docker containers"
    Write-Host "  seed         - Seed database with sample data"
    Write-Host "  reset        - Reset database (WARNING: deletes all data)"
    Write-Host "  studio       - Open Prisma Studio"
    Write-Host "  migrate      - Run database migrations"
    Write-Host "  test-api     - Test API endpoints"
    Write-Host "  logs         - View Docker container logs"
    Write-Host "  clean        - Clean build files and node_modules"
    Write-Host ""
}

function Install-Dependencies {
    Write-Host "`n📦 Installing dependencies..." -ForegroundColor Green
    npm install
}

function Start-Dev {
    Write-Host "`n🚀 Starting development server..." -ForegroundColor Green
    npm run dev
}

function Build-App {
    Write-Host "`n🔨 Building application..." -ForegroundColor Green
    npm run build
}

function Docker-Up {
    Write-Host "`n🐳 Starting Docker containers..." -ForegroundColor Green
    docker-compose up -d
    Write-Host "`n✅ Containers started!" -ForegroundColor Green
    Write-Host "API: http://localhost:4000" -ForegroundColor Cyan
    Write-Host "Database: postgresql://taskuser:taskpass@localhost:5432/task_manager" -ForegroundColor Cyan
    Write-Host "`nRun '.\dev.ps1 seed' to populate database with sample data" -ForegroundColor Yellow
}

function Docker-Down {
    Write-Host "`n🛑 Stopping Docker containers..." -ForegroundColor Green
    docker-compose down
}

function Seed-Database {
    Write-Host "`n🌱 Seeding database..." -ForegroundColor Green
    npm run db:seed
}

function Reset-Database {
    Write-Host "`n⚠️  WARNING: This will delete all data!" -ForegroundColor Red
    $confirm = Read-Host "Are you sure? (yes/no)"
    if ($confirm -eq "yes") {
        Write-Host "`n🔄 Resetting database..." -ForegroundColor Yellow
        npm run db:reset
    } else {
        Write-Host "`n❌ Operation cancelled" -ForegroundColor Yellow
    }
}

function Open-Studio {
    Write-Host "`n🎨 Opening Prisma Studio..." -ForegroundColor Green
    npm run db:studio
}

function Run-Migrations {
    Write-Host "`n🔄 Running migrations..." -ForegroundColor Green
    npm run db:migrate
}

function Test-API {
    Write-Host "`n🧪 Testing API endpoints..." -ForegroundColor Green
    
    Write-Host "`n1. Health check..." -ForegroundColor Yellow
    curl http://localhost:4000/health
    
    Write-Host "`n`n2. Get all projects..." -ForegroundColor Yellow
    curl http://localhost:4000/api/projects
    
    Write-Host "`n`n3. Get all tasks..." -ForegroundColor Yellow
    curl http://localhost:4000/api/tasks
    
    Write-Host "`n`n✅ API test complete!" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "`n📋 Showing Docker logs..." -ForegroundColor Green
    docker-compose logs -f backend
}

function Clean-All {
    Write-Host "`n🧹 Cleaning build files..." -ForegroundColor Green
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force dist
        Write-Host "✅ Removed dist/" -ForegroundColor Green
    }
    if (Test-Path "node_modules") {
        $confirm = Read-Host "Remove node_modules? (yes/no)"
        if ($confirm -eq "yes") {
            Remove-Item -Recurse -Force node_modules
            Write-Host "✅ Removed node_modules/" -ForegroundColor Green
        }
    }
}

# Execute command
switch ($Command) {
    'install'     { Install-Dependencies }
    'dev'         { Start-Dev }
    'build'       { Build-App }
    'docker-up'   { Docker-Up }
    'docker-down' { Docker-Down }
    'seed'        { Seed-Database }
    'reset'       { Reset-Database }
    'studio'      { Open-Studio }
    'migrate'     { Run-Migrations }
    'test-api'    { Test-API }
    'logs'        { Show-Logs }
    'clean'       { Clean-All }
    default       { Show-Help }
}
