# CampusFix AI

> AI-powered campus issue reporting and resolution platform built by **TEAM VELOCITY** for HackYatra × EDM 3.0.

## About

CampusFix AI helps students report real problems across their campus and enables authorized staff/admins to track and resolve them.

Students can report issues such as:

* Electrical problems
* Plumbing
* Wi-Fi / Network
* Cleanliness
* Infrastructure
* Security
* Hostel problems
* Classroom problems
* Other campus issues

AI analyzes submitted issues and provides:

* Category
* Priority
* Short summary
* Suggested department

Administrators and staff can manage issues through their complete lifecycle:

```text
OPEN
  ↓
ASSIGNED
  ↓
IN_PROGRESS
  ↓
RESOLVED
  ↓
CLOSED
```

Issues may also be rejected when appropriate.

## Technology

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express
* JavaScript

### Database & Infrastructure

* Supabase PostgreSQL
* Supabase Auth
* Supabase Storage

### AI

* Gemini API
* Local/deterministic fallback

## Team

| Member         | Responsibility              |
| -------------- | --------------------------- |
| Garv Nain      | Team Lead + AI & Full-Stack |
| Rajveer Dhiman | Backend + Software          |
| Gunjan Yadav   | Frontend + UI/UX            |
| Lokesh Malik   | QA + DevOps + Integration   |

## Development

The project follows a strict phased development workflow:

```text
PHASE 0
Clean Setup
   ↓
PHASE 1
Foundation
   ↓
TEAM VERIFICATION
   ↓
PHASE 2
Core Development
   ↓
TEAM VERIFICATION
   ↓
PHASE 3
Integration
   ↓
TEAM VERIFICATION
   ↓
PHASE 4
Testing + Polish
   ↓
PHASE 5
Deployment + Demo
```

A phase is officially complete only after approval from **Garv Nain, Team Lead**.

## Repository Structure

```text
campusfix-ai/
├── frontend/
├── backend/
├── ai/
├── testing/
├── docs/
├── CAMPUSFIX_ARCHITECTURE.md
├── README.md
├── .env.example
└── .gitignore
```

## Architecture

For the complete technical specification, development rules, API contracts, database model, AI architecture, security requirements, team ownership, and phase system, see:

`CAMPUSFIX_ARCHITECTURE.md`

## Development Principles

* Real application, not a final mock/demo.
* Real API communication.
* Real persistent database.
* Real AI integration.
* Secure environment variables.
* Clear ownership of project areas.
* Parallel team development.
* Inspect before modifying.
* Do not guess missing architecture.
* Test before reporting completion.
* No unauthorized changes to another member's work.

## License

Project developed for HackYatra × EDM 3.0 by TEAM VELOCITY.

