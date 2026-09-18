/**
 * Single source of truth for AI enums and input limits.
 */

export const ALLOWED_CATEGORIES = Object.freeze([
  "Electrical",
  "Plumbing",
  "Wi-Fi / Network",
  "Cleanliness",
  "Infrastructure",
  "Security",
  "Hostel",
  "Classroom",
  "Other",
]);

export const ALLOWED_PRIORITIES = Object.freeze([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

export const DEPARTMENTS = Object.freeze({
  Electrical: "Electrical Maintenance",
  Plumbing: "Plumbing Maintenance",
  "Wi-Fi / Network": "IT / Network Support",
  Cleanliness: "Housekeeping",
  Infrastructure: "Civil / Infrastructure",
  Security: "Campus Security",
  Hostel: "Hostel Administration",
  Classroom: "Academic Facilities",
  Other: "General Administration",
});

export const INPUT_LIMITS = Object.freeze({
  titleMin: 3,
  titleMax: 150,
  descriptionMin: 5,
  descriptionMax: 2000,
  summaryMax: 200,
});

export const AI_TIMEOUT_MS = 8000;
