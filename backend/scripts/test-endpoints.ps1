$ErrorActionPreference = 'Stop'

$baseUrl = if ($env:BASE_URL) { $env:BASE_URL } else { 'http://localhost:5001' }
$script:results = @()

function Add-Result {
  param(
    [string]$Name,
    [string]$Method,
    [string]$Endpoint,
    [int]$ExpectedStatus,
    [int]$ActualStatus,
    $Response
  )

  $script:results += [PSCustomObject]@{
    name = $Name
    method = $Method
    endpoint = $Endpoint
    expectedStatus = $ExpectedStatus
    actualStatus = $ActualStatus
    passed = ($ExpectedStatus -eq $ActualStatus)
    response = $Response
  }
}

function Invoke-JsonRequest {
  param(
    [string]$Name,
    [string]$Method,
    [string]$Endpoint,
    [int]$ExpectedStatus,
    [hashtable]$Headers = @{},
    $Body = $null
  )

  $url = "$baseUrl$Endpoint"
  try {
    if ($null -ne $Body) {
      $json = $Body | ConvertTo-Json -Depth 10
      $resp = Invoke-WebRequest -Uri $url -Method $Method -Headers $Headers -ContentType 'application/json' -Body $json -UseBasicParsing
    } else {
      $resp = Invoke-WebRequest -Uri $url -Method $Method -Headers $Headers -UseBasicParsing
    }

    $parsed = $null
    try {
      $parsed = $resp.Content | ConvertFrom-Json
    } catch {
      $parsed = $resp.Content
    }

    Add-Result -Name $Name -Method $Method -Endpoint $Endpoint -ExpectedStatus $ExpectedStatus -ActualStatus ([int]$resp.StatusCode) -Response $parsed
    return $parsed
  } catch {
    $statusCode = 0
    $errorBody = $_.Exception.Message

    if ($_.Exception.Response) {
      $statusCode = [int]$_.Exception.Response.StatusCode
      try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $raw = $reader.ReadToEnd()
        $errorBody = $raw
      } catch {
        $errorBody = $_.Exception.Message
      }
    }

    Add-Result -Name $Name -Method $Method -Endpoint $Endpoint -ExpectedStatus $ExpectedStatus -ActualStatus $statusCode -Response $errorBody
    return $null
  }
}

# Prepare dynamic test data
$timestamp = Get-Date -Format 'yyyyMMddHHmmss'
$farmerEmail = "apitest+$timestamp@example.com"
$farmerPassword = 'Test@12345'

# 1) Health
Invoke-JsonRequest -Name 'Health Check' -Method 'GET' -Endpoint '/api/health' -ExpectedStatus 200 | Out-Null

# 2) Register farmer
$register = Invoke-JsonRequest -Name 'Auth Register Farmer' -Method 'POST' -Endpoint '/api/auth/register' -ExpectedStatus 201 -Body @{
  fullName = 'API Test Farmer'
  email = $farmerEmail
  password = $farmerPassword
}

$farmerAccessToken = $register.accessToken
$farmerRefreshToken = $register.refreshToken
$farmerUserId = $register.user.id
$farmerHeaders = @{}
if ($farmerAccessToken) {
  $farmerHeaders['Authorization'] = "Bearer $farmerAccessToken"
}

# 3) Farmer login
$farmerLogin = Invoke-JsonRequest -Name 'Auth Login Farmer' -Method 'POST' -Endpoint '/api/auth/login' -ExpectedStatus 200 -Body @{
  email = $farmerEmail
  password = $farmerPassword
  role = 'farmer'
}
if ($farmerLogin -and $farmerLogin.accessToken) {
  $farmerAccessToken = $farmerLogin.accessToken
  $farmerRefreshToken = $farmerLogin.refreshToken
  $farmerHeaders['Authorization'] = "Bearer $farmerAccessToken"
}

# 4) Refresh token (farmer)
Invoke-JsonRequest -Name 'Auth Refresh Token Farmer' -Method 'POST' -Endpoint '/api/auth/refresh-token' -ExpectedStatus 200 -Body @{
  refreshToken = $farmerRefreshToken
} | Out-Null

# 5) Farmer profile GET/PUT
Invoke-JsonRequest -Name 'Users Get Me Farmer' -Method 'GET' -Endpoint '/api/users/me' -ExpectedStatus 200 -Headers $farmerHeaders | Out-Null
Invoke-JsonRequest -Name 'Users Update Me Farmer' -Method 'PUT' -Endpoint '/api/users/me' -ExpectedStatus 200 -Headers $farmerHeaders -Body @{
  location = 'Ahmedabad, India'
  mainCrops = 'Wheat, Cotton'
} | Out-Null

# 6) Predict + Detect Disease
Invoke-JsonRequest -Name 'AI Predict Crop' -Method 'POST' -Endpoint '/api/predict' -ExpectedStatus 200 -Body @{
  N = 80
  P = 40
  K = 45
  temperature = 28
  humidity = 62
  ph = 6.4
  rainfall = 740
} | Out-Null

# multipart via curl for detect-disease
$tempImage = Join-Path $env:TEMP "farmaid-test-$timestamp.jpg"
[System.IO.File]::WriteAllBytes($tempImage, [byte[]](255,216,255,217))
$curlOutput = curl.exe -s -X POST "$baseUrl/api/detect-disease" -F "image=@$tempImage" -w "`nHTTP_STATUS:%{http_code}`n"
$curlLines = $curlOutput -split "`n"
$httpLine = $curlLines | Where-Object { $_ -like 'HTTP_STATUS:*' } | Select-Object -Last 1
$httpStatus = 0
if ($httpLine) {
  $httpStatus = [int]($httpLine -replace 'HTTP_STATUS:', '')
}
$bodyLines = $curlLines | Where-Object { $_ -notlike 'HTTP_STATUS:*' }
$bodyRaw = ($bodyLines -join "`n").Trim()
$bodyParsed = $bodyRaw
try {
  $bodyParsed = $bodyRaw | ConvertFrom-Json
} catch {
  $bodyParsed = $bodyRaw
}
Add-Result -Name 'AI Detect Disease' -Method 'POST' -Endpoint '/api/detect-disease' -ExpectedStatus 200 -ActualStatus $httpStatus -Response $bodyParsed

# 7) Settings (farmer)
Invoke-JsonRequest -Name 'Settings Get Me Farmer' -Method 'GET' -Endpoint '/api/settings/me' -ExpectedStatus 200 -Headers $farmerHeaders | Out-Null
Invoke-JsonRequest -Name 'Settings Update Me Farmer' -Method 'PUT' -Endpoint '/api/settings/me' -ExpectedStatus 200 -Headers $farmerHeaders -Body @{
  notifications = $true
  twoFactor = $false
  automaticBackups = $true
  cacheSize = '512 MB'
} | Out-Null

# 8) Admin login + admin endpoints
$adminLogin = Invoke-JsonRequest -Name 'Auth Login Admin' -Method 'POST' -Endpoint '/api/auth/login' -ExpectedStatus 200 -Body @{
  email = 'admin@farmaid.ai'
  password = 'admin12345'
  role = 'admin'
}
$adminHeaders = @{}
$adminAccessToken = $adminLogin.accessToken
$adminRefreshToken = $adminLogin.refreshToken
if ($adminAccessToken) {
  $adminHeaders['Authorization'] = "Bearer $adminAccessToken"
}

Invoke-JsonRequest -Name 'Admin List Farmers' -Method 'GET' -Endpoint '/api/admin/farmers?search=API%20Test&page=1&limit=10' -ExpectedStatus 200 -Headers $adminHeaders | Out-Null
if ($farmerUserId) {
  Invoke-JsonRequest -Name 'Admin Get Farmer By Id' -Method 'GET' -Endpoint "/api/admin/farmers/$farmerUserId" -ExpectedStatus 200 -Headers $adminHeaders | Out-Null
}
Invoke-JsonRequest -Name 'Admin List Logs' -Method 'GET' -Endpoint '/api/admin/logs?page=1&limit=20' -ExpectedStatus 200 -Headers $adminHeaders | Out-Null
Invoke-JsonRequest -Name 'Admin Dashboard' -Method 'GET' -Endpoint '/api/admin/dashboard' -ExpectedStatus 200 -Headers $adminHeaders | Out-Null
Invoke-JsonRequest -Name 'Admin Get Settings' -Method 'GET' -Endpoint '/api/admin/settings' -ExpectedStatus 200 -Headers $adminHeaders | Out-Null
Invoke-JsonRequest -Name 'Admin Update Settings' -Method 'PUT' -Endpoint '/api/admin/settings' -ExpectedStatus 200 -Headers $adminHeaders -Body @{
  data = @{ dataRetentionDays = 120; apiRateLimit = 150 }
} | Out-Null

# 9) Cleanup test farmer by admin
if ($farmerUserId) {
  Invoke-JsonRequest -Name 'Admin Delete Farmer' -Method 'DELETE' -Endpoint "/api/admin/farmers/$farmerUserId" -ExpectedStatus 200 -Headers $adminHeaders | Out-Null
}

# 10) Logout flows
Invoke-JsonRequest -Name 'Auth Logout Farmer' -Method 'POST' -Endpoint '/api/auth/logout' -ExpectedStatus 200 -Body @{ refreshToken = $farmerRefreshToken } | Out-Null
Invoke-JsonRequest -Name 'Auth Logout Admin' -Method 'POST' -Endpoint '/api/auth/logout' -ExpectedStatus 200 -Body @{ refreshToken = $adminRefreshToken } | Out-Null

$outputPath = 'a:\FarmaidAI-version2\backend\test-results.json'
$script:results | ConvertTo-Json -Depth 10 | Set-Content -Path $outputPath
Write-Output "Saved results to $outputPath"

$summary = [PSCustomObject]@{
  total = $script:results.Count
  passed = ($script:results | Where-Object { $_.passed }).Count
  failed = ($script:results | Where-Object { -not $_.passed }).Count
}
$summary | ConvertTo-Json -Depth 5 | Write-Output
