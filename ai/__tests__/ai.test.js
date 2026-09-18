import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeIssue,
  InputValidationError,
  OutputValidationError,
} from "../index.js";
import { validateAIResult } from "../validate/output.js";
import { analyzeWithFallback } from "../providers/fallback.js";

// Valid electrical issues use the local fallback without an API key.
test("analyzes an electrical issue", async () => {
  const result = await analyzeIssue({
    title: "Fan not working",
    description: "The ceiling fan in room 204 has stopped working.",
  });
  assert.equal(result.category, "Electrical");
  assert.ok(["HIGH", "CRITICAL"].includes(result.priority));
  assert.ok(result.summary);
  assert.ok(result.department);
  assert.equal(result.source, "fallback");
});

// Plumbing keywords map to the plumbing category.
test("analyzes a plumbing issue", async () => {
  const result = await analyzeIssue({
    title: "Water leak",
    description: "Tap in washroom is leaking continuously.",
  });
  assert.equal(result.category, "Plumbing");
});

// Network keywords map to the Wi-Fi / Network category.
test("analyzes a Wi-Fi issue", async () => {
  const result = await analyzeIssue({
    title: "WiFi down",
    description: "No internet in hostel block B.",
  });
  assert.equal(result.category, "Wi-Fi / Network");
});

// Sanitation keywords map to the cleanliness category.
test("analyzes a cleanliness issue", async () => {
  const result = await analyzeIssue({
    title: "Garbage",
    description: "Trash not collected near canteen for 3 days.",
  });
  assert.equal(result.category, "Cleanliness");
});

// Unknown issue text falls back to Other.
test("analyzes a general issue", async () => {
  const result = await analyzeIssue({
    title: "Random issue",
    description: "Something unusual happened.",
  });
  assert.equal(result.category, "Other");
});

// Empty titles are rejected before providers are called.
test("rejects an empty title", async () => {
  await assert.rejects(
    analyzeIssue({ title: "", description: "valid description here" }),
    InputValidationError,
  );
});

// Empty descriptions are rejected before providers are called.
test("rejects an empty description", async () => {
  await assert.rejects(
    analyzeIssue({ title: "Valid title", description: "" }),
    InputValidationError,
  );
});

// Provider categories must use the centralized enum.
test("rejects an invalid AI category", () => {
  assert.throws(
    () => validateAIResult({ category: "Aliens", priority: "LOW", summary: "x", department: "y" }),
    OutputValidationError,
  );
});

// Provider priorities must use the centralized enum.
test("rejects an invalid AI priority", () => {
  assert.throws(
    () => validateAIResult({ category: "Electrical", priority: "SUPER", summary: "x", department: "y" }),
    OutputValidationError,
  );
});

// Provider summaries must contain meaningful text.
test("rejects an empty AI summary", () => {
  assert.throws(
    () => validateAIResult({ category: "Electrical", priority: "LOW", summary: " ", department: "y" }),
    OutputValidationError,
  );
});

// Provider departments must contain meaningful text.
test("rejects an empty department", () => {
  assert.throws(
    () => validateAIResult({ category: "Electrical", priority: "LOW", summary: "x", department: "" }),
    OutputValidationError,
  );
});

// The deterministic fallback returns the shape accepted by output validation.
test("fallback produces valid output", () => {
  const result = analyzeWithFallback({
    title: "Broken chair",
    description: "Chair in classroom 12 is broken.",
  });
  assert.ok(result.category);
  assert.ok(result.priority);
  assert.ok(result.summary);
  assert.ok(result.department);
  assert.equal(result.source, "fallback");
  assert.doesNotThrow(() => validateAIResult({
    category: result.category,
    priority: result.priority,
    summary: result.summary,
    department: result.department,
  }));
});
