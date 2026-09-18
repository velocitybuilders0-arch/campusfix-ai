# CampusFix AI

## Purpose

CampusFix AI is the analysis layer for CampusFix AI. It converts raw issue text into a structured category, priority, summary, and department for downstream issue management.

## Public API

`analyzeIssue(input)` accepts `{ title, description, image? }` and returns `{ category, priority, summary, department, source }`. The `source` is `"gemini"` for a successful Gemini analysis or `"fallback"` when the deterministic local provider is used.

## Provider chain

Gemini is the primary provider and requires `GEMINI_API_KEY`. When Gemini is unavailable or fails, the module uses a deterministic local fallback. The fallback never claims that Gemini generated its result.

## Enums

`constants.js` is the source of truth for these values.

- Categories: Electrical, Plumbing, Wi-Fi / Network, Cleanliness, Infrastructure, Security, Hostel, Classroom, Other
- Priorities: LOW, MEDIUM, HIGH, CRITICAL

## Running tests

```sh
cd ai && npm test
```

## Adding a provider

Add new providers under `providers/`. They must return the validated result shape and include a `source` tag.
