# Backend Endpoint Test Report

## Overview
- Project: FarmaidAI Version 2 Backend
- Test date: 2026-03-27
- Test environment:
  - Base URL: http://localhost:5001
  - Database mode: MongoDB connected (from backend logs)
  - Tooling used for execution: PowerShell script + curl for multipart endpoint
- Report generated from automated run across all implemented routes.

## Scope Covered
- Health endpoint
- Auth endpoints
- Farmer profile endpoints
- AI endpoints
- Farmer settings endpoints
- Admin endpoints (farmers, logs, dashboard, settings)

## Summary
- Total endpoints tested: 20
- Passed: 20
- Failed: 0
- Pass rate: 100%

## Endpoint Results

| # | Test Name | Method | Endpoint | Expected | Actual | Result |
|---|---|---|---|---:|---:|---|
| 1 | Health Check | GET | /api/health | 200 | 200 | PASS |
| 2 | Auth Register Farmer | POST | /api/auth/register | 201 | 201 | PASS |
| 3 | Auth Login Farmer | POST | /api/auth/login | 200 | 200 | PASS |
| 4 | Auth Refresh Token Farmer | POST | /api/auth/refresh-token | 200 | 200 | PASS |
| 5 | Users Get Me Farmer | GET | /api/users/me | 200 | 200 | PASS |
| 6 | Users Update Me Farmer | PUT | /api/users/me | 200 | 200 | PASS |
| 7 | AI Predict Crop | POST | /api/predict | 200 | 200 | PASS |
| 8 | AI Detect Disease | POST | /api/detect-disease | 200 | 200 | PASS |
| 9 | Settings Get Me Farmer | GET | /api/settings/me | 200 | 200 | PASS |
| 10 | Settings Update Me Farmer | PUT | /api/settings/me | 200 | 200 | PASS |
| 11 | Auth Login Admin | POST | /api/auth/login | 200 | 200 | PASS |
| 12 | Admin List Farmers | GET | /api/admin/farmers?search=API%20Test&page=1&limit=10 | 200 | 200 | PASS |
| 13 | Admin Get Farmer By Id | GET | /api/admin/farmers/{id} | 200 | 200 | PASS |
| 14 | Admin List Logs | GET | /api/admin/logs?page=1&limit=20 | 200 | 200 | PASS |
| 15 | Admin Dashboard | GET | /api/admin/dashboard | 200 | 200 | PASS |
| 16 | Admin Get Settings | GET | /api/admin/settings | 200 | 200 | PASS |
| 17 | Admin Update Settings | PUT | /api/admin/settings | 200 | 200 | PASS |
| 18 | Admin Delete Farmer | DELETE | /api/admin/farmers/{id} | 200 | 200 | PASS |
| 19 | Auth Logout Farmer | POST | /api/auth/logout | 200 | 200 | PASS |
| 20 | Auth Logout Admin | POST | /api/auth/logout | 200 | 200 | PASS |

## Key Response Validation Notes
- Register returns user object with role, accessToken, and refreshToken.
- Login works for both farmer and admin roles.
- Protected routes correctly work with Authorization header.
- Profile update persists changed fields (location and mainCrops observed in response).
- Crop prediction returns recommendations array and explanation.
- Disease detection multipart endpoint returns disease, confidence, severity, treatment, and prevention.
- Admin settings update persisted dataRetentionDays and apiRateLimit changes in response.
- Admin delete farmer endpoint successfully removed created test farmer.

## Data Setup and Cleanup During Test
- A unique farmer account was created during the test run.
- The created farmer was deleted via admin endpoint during cleanup.
- Both farmer and admin sessions were logged out at the end of test flow.

## Issue Found and Resolved During Testing
- Initial run exposed duplicate refresh token collision in MongoDB due identical token payload timing.
- Resolved by adding unique JWT ID claim to refresh token generation.
- Final rerun confirmed stable behavior and full pass.

## Artifacts
- Automated test script: backend/scripts/test-endpoints.ps1
- Raw JSON result file: backend/test-results.json

## Recommended Next Validation (Optional)
- Add negative tests:
  - Unauthorized access to protected routes without token should return 401.
  - Role mismatch for admin routes using farmer token should return 403.
  - Invalid payload validation cases for auth/profile/settings/AI endpoints.
- Export a Postman collection and environment JSON for team-wide repeatable testing.
