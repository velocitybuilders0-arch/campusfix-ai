# CAMPUSFIX AI

## System Architecture & Development Specification

**Team:** TEAM VELOCITY
**Hackathon:** HackYatra × EDM 3.0
**Duration:** 24 Hours
**Project Type:** Real AI-powered campus issue reporting and resolution platform
**Repository:** `velocitybuilders0-arch/campusfix-ai`

---

# 1. PROJECT VISION

CampusFix AI is a real-time campus issue reporting and resolution platform.

Students can report problems occurring around campus, hostels, classrooms, infrastructure, networks, sanitation facilities, and other university services.

The platform uses AI to analyze submitted issues and automatically determine:

* Category
* Priority
* Short summary
* Responsible department

Administrators/staff can then manage the issue throughout its lifecycle.

The system must use real persistent data and real API communication.

### Core flow

Student
↓
React Frontend
↓
Express REST API
↓
Authentication / Authorization
↓
PostgreSQL / Supabase
↓
AI Analysis
↓
Issue Created
↓
Admin Dashboard
↓
Assignment
↓
Status Updates
↓
Resolution
↓
Closure

---

# 2. PRIMARY USERS

## Student

Students can:

* Register/login
* Submit an issue
* Add title
* Add description
* Upload an optional image
* View their submitted issues
* Search/filter their issues
* Open issue details
* Track status
* View updates
* Receive resolution information

## Admin / Staff

Authorized staff can:

* Login
* View all issues
* Search issues
* Filter issues
* Open issue details
* Assign issues
* Change issue status
* Add updates
* Resolve issues
* Close issues
* Reject invalid issues

---

# 3. ISSUE LIFECYCLE

Primary lifecycle:

OPEN
→ ASSIGNED
→ IN_PROGRESS
→ RESOLVED
→ CLOSED

Alternative:

OPEN
→ REJECTED

### Status meanings

**OPEN**
Issue has been submitted and is awaiting assignment.

**ASSIGNED**
Issue has been assigned to a responsible staff member/department.

**IN_PROGRESS**
Work has started.

**RESOLVED**
Staff has completed the required work.

**CLOSED**
Issue has been confirmed/closed.

**REJECTED**
Issue has been rejected because it is invalid, inappropriate, duplicate, or otherwise not actionable.

---

# 4. PRIORITY LEVELS

Allowed priorities:

* LOW
* MEDIUM
* HIGH
* CRITICAL

AI may suggest a priority, but the backend must validate the value.

Administrative users may change the priority when appropriate.

---

# 5. ISSUE CATEGORIES

Initial allowed categories:

* Electrical
* Plumbing
* Wi-Fi / Network
* Cleanliness
* Infrastructure
* Security
* Hostel
* Classroom
* Other

The category list should be centralized rather than duplicated throughout the application.

---

# 6. DEPARTMENTS

Initial department mapping may include:

* Electrical Maintenance
* Plumbing Maintenance
* IT / Network Support
* Housekeeping
* Civil / Infrastructure
* Security
* Hostel Administration
* Academic / Classroom Support
* General Administration

AI can suggest a department.

The backend remains responsible for validating the resulting value.

---

# 7. TECHNOLOGY STACK

## Frontend

* React
* Vite
* JavaScript
* CSS

Responsibilities:

* User interface
* Form handling
* Client-side validation
* API communication
* Authentication UI
* Issue dashboards
* Admin dashboard
* Loading/error/empty states
* Responsive design

---

## Backend

* Node.js
* Express
* JavaScript

Responsibilities:

* REST APIs
* Authentication verification
* Authorization
* Input validation
* Issue management
* Database communication
* AI orchestration
* Image/storage integration
* Error handling
* Security

---

## Database

Supabase PostgreSQL.

Supabase may additionally provide:

* Authentication
* PostgreSQL database
* Storage

The application should avoid creating unnecessary custom infrastructure when Supabase can provide the required functionality.

---

## AI

Primary provider:

Gemini API/free-tier option where available.

AI responsibilities:

* Issue classification
* Priority suggestion
* Summary generation
* Department suggestion

AI output must be structured and validated by the backend.

---

# 8. HIGH-LEVEL ARCHITECTURE

```text
┌─────────────────────────────┐
│       Student / Admin       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       React + Vite UI       │
└──────────────┬──────────────┘
               │ HTTPS / REST
               ▼
┌─────────────────────────────┐
│       Express Backend       │
│                             │
│ Auth / Validation / Routes  │
│ Issue Service / AI Service  │
└───────┬───────────┬─────────┘
        │           │
        ▼           ▼
┌────────────┐  ┌─────────────┐
│ Supabase   │  │ Gemini API  │
│ PostgreSQL │  │             │
│ Auth       │  │ AI Analysis │
│ Storage    │  │             │
└────────────┘  └─────────────┘
```

---

# 9. PROJECT STRUCTURE

Initial structure:

```text
campusfix-ai/
│
├── frontend/
│
├── backend/
│
├── ai/
│
├── testing/
│
├── docs/
│
├── CAMPUSFIX_ARCHITECTURE.md
├── README.md
├── .gitignore
└── .env.example
```

The exact internal structure may evolve, but changes must remain consistent with this architecture.

---

# 10. OWNERSHIP

## Garv — Team Lead + AI & Full-Stack

Owns:

* Overall architecture
* AI layer
* Shared foundation
* Cross-component decisions
* Integration decisions
* Critical fixes
* Final technical approval

Primary branch:

```text
garv-main
```

---

## Rajveer — Backend + Software Developer

Owns:

```text
backend/
```

Responsibilities:

* Express server
* REST APIs
* Validation
* Database integration
* Issue CRUD
* Authentication middleware integration
* Authorization
* Issue updates
* Error handling

Primary branch:

```text
rajveer-main
```

---

## Gunjan — Frontend + UI/UX

Owns:

```text
frontend/
```

Responsibilities:

* React application
* UI/UX
* Student interface
* Admin dashboard
* Forms
* Issue cards/details
* Status visualization
* Responsive design
* Loading/error/empty states

Primary branch:

```text
gunjan-main
```

---

## Lokesh — QA + DevOps + Integration Support

Owns:

```text
testing/
docs/
```

Responsibilities:

* API testing
* Integration testing
* Test cases
* Regression testing
* Environment verification
* Deployment preparation
* Git/branch verification
* Documentation support
* Final QA

Primary branch:

```text
lokesh-main
```

Lokesh must not modify another member's implementation simply to fix a failing test.

Failures should first be reported to the responsible owner.

---

# 11. GIT WORKFLOW

Main branch:

```text
main
```

Team branches:

```text
garv-main
rajveer-main
gunjan-main
lokesh-main
```

Rules:

1. Work on your own branch.
2. Do not randomly work directly on `main`.
3. Do not modify another member's owned folder without Garv's approval.
4. Inspect before modifying.
5. Never blindly overwrite existing work.
6. Never force push unless Garv explicitly approves.
7. Never rewrite shared Git history.
8. Keep commits focused and understandable.
9. Pull/rebase/merge only according to the team's agreed integration process.
10. Verify changes before opening a PR.

---

# 12. DEVELOPMENT PRINCIPLE

Development should be parallel wherever reasonably possible.

Avoid:

```text
Backend complete
↓
Frontend waits
↓
Frontend complete
↓
QA starts
```

Instead:

```text
Shared contracts
       ↓
 ┌─────┼─────┐
 ▼     ▼     ▼
API   UI    Tests
 │     │     │
 └─────┼─────┘
       ▼
   Integration
```

Temporary mock fixtures may be used during development to allow parallel work.

Mocks are not the final implementation.

---

# 13. API CONTRACT

Base API:

```text
/api
```

## Health

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "CampusFix API is running"
}
```

---

## AI Analysis

```http
POST /api/ai/analyze
```

Input:

```json
{
  "title": "Fan not working",
  "description": "The ceiling fan in room 204 has stopped working."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "category": "Electrical",
    "priority": "High",
    "summary": "Ceiling fan is not functioning in Room 204",
    "department": "Electrical Maintenance"
  }
}
```

The backend must validate the AI response before returning it.

---

## Create Issue

```http
POST /api/issues
```

Input should contain the required issue information.

Possible fields:

```json
{
  "title": "Fan not working",
  "description": "The ceiling fan in room 204 has stopped working.",
  "image_url": null
}
```

The backend should:

1. Validate input.
2. Authenticate the user.
3. Analyze the issue.
4. Validate AI output.
5. Store the issue.
6. Return the created issue.

---

## Get Issues

```http
GET /api/issues
```

Supports appropriate filtering/search parameters when implemented.

Students should only receive issues they are authorized to view.

Admins/staff may access the broader issue list according to their permissions.

---

## Get Issue

```http
GET /api/issues/:id
```

Returns the requested issue if the authenticated user has permission.

---

## Update Issue

```http
PATCH /api/issues/:id
```

Used for authorized changes such as:

* Priority
* Category
* Department
* Assignment
* Status

The backend must validate status transitions and authorization.

---

## Add Issue Update

```http
POST /api/issues/:id/updates
```

Used to add staff/user-visible progress updates.

Example:

```json
{
  "message": "Electrician has been assigned to inspect the fan."
}
```

---

## Delete Issue

```http
DELETE /api/issues/:id
```

Deletion must be restricted to authorized users.

Where practical, administrative workflows should prefer status-based resolution/rejection over destructive deletion.

---

# 14. DATABASE MODEL

The approved architecture uses PostgreSQL through Supabase.

## users

Conceptual fields:

```text
id
name
email
role
created_at
updated_at
```

Roles:

```text
STUDENT
ADMIN
STAFF
```

Authentication credentials should be handled by Supabase Auth rather than stored as plaintext passwords in the application database.

---

## issues

Core fields:

```text
id
user_id
title
description
image_url
category
priority
ai_summary
department
status
assigned_to
created_at
updated_at
```

Relationships:

```text
users 1 ──── * issues
```

---

## issue_updates

Core fields:

```text
id
issue_id
message
status
created_at
```

Relationships:

```text
issues 1 ──── * issue_updates
```

The final SQL schema must preserve the logical model above.

---

# 15. DATABASE RULES

Database access must use parameterized/safe queries or the official Supabase client.

Never construct unsafe SQL using raw user input.

Required considerations:

* Foreign keys
* Appropriate indexes
* Timestamps
* Valid role values
* Valid status values
* Valid priority values
* Required fields
* Referential integrity

The exact database migration/schema should be documented before implementation.

---

# 16. AUTHENTICATION

If authentication is implemented, Supabase Auth is the preferred authentication mechanism.

The frontend should authenticate the user.

The backend must not blindly trust user-provided role information.

Authorization must be enforced server-side.

Example:

```text
Student
→ Can create/view own issues

Staff/Admin
→ Can manage authorized issues

Admin
→ Can perform administrative operations
```

Exact permission rules must be implemented consistently across frontend and backend.

---

# 17. IMAGE UPLOAD

Images are optional.

Preferred implementation:

```text
Frontend
↓
Supabase Storage
↓
Stored image
↓
Issue references image URL/path
```

Rules:

* Validate file type.
* Validate file size.
* Do not trust the filename.
* Do not store image binary data directly inside PostgreSQL unless specifically required.
* Do not use fake image URLs in the final application.
* Handle upload failures gracefully.

---

# 18. AI ARCHITECTURE

AI processing should be isolated from normal issue CRUD logic.

Conceptual flow:

```text
Issue Input
    ↓
Input Validation
    ↓
AI Service
    ↓
Gemini
    ↓
Structured Response
    ↓
Output Validation
    ↓
Normalized AI Result
    ↓
Issue Creation
```

Expected result:

```json
{
  "category": "Electrical",
  "priority": "High",
  "summary": "Ceiling fan is not functioning in Room 204",
  "department": "Electrical Maintenance"
}
```

---

# 19. AI VALIDATION

The backend must verify:

### Category

Must belong to the approved category list.

### Priority

Must be:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

### Department

Must belong to the approved department list or an explicitly supported fallback.

### Summary

Must be a valid non-empty string.

Malformed AI output must never directly enter the database.

---

# 20. AI FAILURE HANDLING

The application must not completely fail when the AI provider is unavailable.

Possible fallback sequence:

```text
Gemini available
      ↓
Use AI analysis

Gemini unavailable
      ↓
Local deterministic fallback
      ↓
Return valid structured result
```

The fallback should be clearly separated from the primary AI implementation.

The fallback must not pretend that an unavailable external model generated the result.

---

# 21. ENVIRONMENT VARIABLES

Secrets must be stored through environment variables.

Possible variables include:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
```

Only variables actually required by the implementation should be added.

Rules:

* Never commit `.env`.
* Never commit API keys.
* Never expose server-only secrets to the browser.
* `.env.example` may contain variable names but must contain no real secrets.

---

# 22. ERROR HANDLING

All API errors should use a consistent structure.

Example:

```json
{
  "success": false,
  "error": {
    "message": "Invalid issue title"
  }
}
```

The frontend must handle:

* Network errors
* API errors
* Authentication errors
* Validation errors
* AI failures
* Upload failures
* Empty results
* Loading states

---

# 23. FRONTEND UX REQUIREMENTS

The frontend should provide:

* Responsive layout
* Clear navigation
* Issue creation form
* AI analysis feedback
* Issue list
* Issue detail page
* Status visualization
* Search
* Filters
* Loading states
* Empty states
* Error states
* Success feedback
* Accessible form controls

The interface should feel like a serious SaaS/product prototype rather than a basic CRUD college assignment.

---

# 24. ADMIN DASHBOARD

The dashboard should provide:

* Total issues
* Open issues
* In-progress issues
* Resolved issues
* Critical/high-priority issues
* Search
* Filtering
* Issue details
* Assignment
* Status management
* Update history

Dashboard statistics must come from real backend/database data.

No hardcoded final statistics.

---

# 25. TESTING STRATEGY

Testing should cover:

## Unit testing

* AI validation
* Fallback logic
* Input validation
* Utility functions

## API testing

* Health endpoint
* AI endpoint
* Issue creation
* Issue retrieval
* Issue update
* Issue deletion
* Issue updates
* Authentication/authorization

## Integration testing

Verify:

```text
Frontend
↓
Backend
↓
Database
```

and:

```text
Issue
↓
AI
↓
Validated result
↓
Database
```

## UI testing

Verify:

* Forms
* Navigation
* Loading states
* Error states
* Empty states
* Responsive behavior

---

# 26. SECURITY

Never commit:

* API keys
* Passwords
* Tokens
* `.env` files containing secrets
* Service-role credentials

Additional requirements:

* Validate all user input.
* Validate AI output.
* Enforce authorization on the backend.
* Restrict image uploads.
* Avoid exposing server secrets.
* Use HTTPS in deployed environments.
* Do not trust frontend-only permissions.

---

# 27. DEPLOYMENT

Preferred deployment strategy should use free-tier services where practical.

Potential architecture:

```text
Frontend → Vercel / Netlify
Backend  → Render / equivalent free-tier platform
Database → Supabase
Storage  → Supabase Storage
AI       → Gemini free-tier where available
```

The final deployment platform will be selected based on current availability, limits, and hackathon practicality.

Deployment should not begin until the application passes integration and QA checks.

---

# 28. PHASE SYSTEM

## PHASE 0 — Clean Setup

Goal:

* Repository
* Branches
* Architecture
* Documentation
* Environment strategy
* Ownership

No feature development.

---

## PHASE 1 — Foundation

Parallel work begins.

Expected areas:

* Project foundations
* Backend skeleton
* Frontend skeleton
* Database preparation
* AI service foundation
* Testing strategy
* Development documentation

No member should wait unnecessarily for another member.

---

## PHASE 2 — Core Development

Build the primary functionality:

* Authentication
* Issue creation
* AI analysis
* Database persistence
* Issue listing
* Issue details
* Status management
* Updates
* Core UI

---

## PHASE 3 — Integration

Connect:

```text
Frontend
↕
Backend
↕
Database
↕
AI
↕
Storage/Auth
```

Resolve contract mismatches.

---

## PHASE 4 — Testing + Polish

Focus on:

* Bugs
* Validation
* Security
* Responsive UI
* Error states
* Loading states
* UX polish
* API testing
* Regression testing

---

## PHASE 5 — Deployment + Demo

Finalize:

* Production deployment
* Environment variables
* README
* Demo flow
* Presentation
* Screenshots
* Final QA
* Backup/demo contingency

---

# 29. PHASE APPROVAL RULE

A phase is NOT officially complete when an AI coding assistant says it is complete.

Each member may report:

```text
MY WORK FOR PHASE X IS COMPLETE
```

Garv performs team verification.

Only Garv can declare:

```text
PHASE X APPROVED
```

The team must not officially begin the next phase until Garv approves the current phase.

---

# 30. DEEPSEEK AGENT RULES

DeepSeek must:

1. Understand the entire project.
2. Understand the complete architecture.
3. Understand all team responsibilities.
4. Know its own branch.
5. Know its owned folders.
6. Inspect before modifying.
7. Never guess missing architecture.
8. Never invent API contracts.
9. Never invent database fields.
10. Never modify another member's owned component without approval.
11. Never commit secrets.
12. Test its changes.
13. Report blockers.
14. Stop when its assigned phase work is complete.
15. Never declare the entire project complete.
16. Never declare a phase officially approved.

Only Garv controls phase approval.

---

# 31. BLOCKER PROTOCOL

If an agent encounters a blocker:

```text
BLOCKER
What I was trying to do:
What failed:
Exact error:
What I inspected:
What I believe is missing:
What decision is required:
```

Do not silently work around an architectural conflict.

---

# 32. CHANGE CONTROL

Any significant change to:

* API contracts
* Database schema
* Authentication model
* Folder ownership
* AI response format
* Issue lifecycle
* Technology stack

must be communicated to Garv before implementation.

If a new requirement conflicts with this architecture, stop and report the conflict.

---

# 33. DEFINITION OF DONE

A feature is considered complete only when:

* Code exists
* Correct owner implemented it
* No unauthorized files were modified
* Validation exists where necessary
* Error handling exists
* Tests/checks pass
* API contract is respected
* No secrets are committed
* Existing functionality is not unnecessarily broken
* Changes are documented where appropriate
* Garv/team verification is complete

---

# 34. FINAL PRODUCT PRINCIPLE

CampusFix AI should demonstrate:

```text
REAL USER
    ↓
REAL UI
    ↓
REAL AUTHENTICATION
    ↓
REAL API
    ↓
REAL DATABASE
    ↓
REAL AI
    ↓
REAL ISSUE MANAGEMENT
    ↓
REAL STATUS UPDATES
    ↓
REAL ADMIN WORKFLOW
```

The objective is not to maximize the number of technologies.

The objective is to deliver a coherent, reliable, demonstrable AI-powered campus issue resolution platform within the 24-hour hackathon.

---

# 35. ARCHITECTURE AUTHORITY

This document is the team's initial technical source of truth.

When implementation details are unclear:

1. Inspect this document.
2. Inspect the existing repository.
3. Inspect relevant code/contracts.
4. Report unresolved ambiguity to Garv.
5. Do not guess.

Any future architectural change must be deliberate and communicated to the team.
