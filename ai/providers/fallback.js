import { DEPARTMENTS } from "../constants.js";

const CATEGORY_KEYWORDS = [
  ["Security", ["theft", "stolen", "intruder", "suspicious", "harassment", "unsafe", "security guard", "cctv", "broken lock"]],
  ["Electrical", ["fan", "light", "bulb", "electricity", "power", "socket", "switch", "wiring", "short circuit", "voltage", "fuse", "plug"]],
  ["Plumbing", ["tap", "water leak", "leakage", "pipe", "toilet", "flush", "drain", "plumbing", "geyser", "tank", "clog"]],
  ["Wi-Fi / Network", ["wifi", "wi-fi", "internet", "network", "lan", "router", "ethernet", "no signal", "slow internet"]],
  ["Cleanliness", ["dirty", "garbage", "trash", "waste", "cleaning", "dust", "smell", "unhygienic", "litter", "sweep"]],
  ["Hostel", ["hostel", "warden", "dorm", "room allotment", "mess", "roommate"]],
  ["Classroom", ["classroom", "projector", "board", "bench", "desk", "lecture hall", "smart class"]],
  ["Infrastructure", ["wall", "ceiling", "roof", "floor", "broken window", "door", "paint", "building", "chair", "table"]],
];

const PRIORITY_KEYWORDS = [
  ["CRITICAL", ["fire", "spark", "gas leak", "electric shock", "collapse", "emergency", "danger", "flood", "exposed wire"]],
  ["HIGH", ["not working", "broken", "stopped working", "urgent", "immediately", "severe", "major", "outage", "no water", "no power"]],
  ["MEDIUM", ["slow", "intermittent", "sometimes", "minor damage", "occasionally", "partial"]],
];

function containsKeyword(text, keyword) {
  return text.includes(keyword);
}

function capitalizeSummary(value) {
  const summary = value.trim().slice(0, 200);
  return summary ? summary[0].toUpperCase() + summary.slice(1) : "Campus issue";
}

/**
 * Analyze an issue with a deterministic local fallback.
 * @param {{ title: string, description: string, image?: string | null }} input
 * @returns {{ category: string, priority: string, summary: string, department: string, source: "fallback" }}
 */
export function analyzeWithFallback(input) {
  const text = `${input.title} ${input.description}`.toLowerCase();
  const category = CATEGORY_KEYWORDS.find(([, keywords]) =>
    keywords.some((keyword) => containsKeyword(text, keyword)),
  )?.[0] ?? "Other";
  const priority = PRIORITY_KEYWORDS.find(([, keywords]) =>
    keywords.some((keyword) => containsKeyword(text, keyword)),
  )?.[0] ?? "LOW";
  const summary = capitalizeSummary(input.title || input.description.slice(0, 100));

  return {
    category,
    priority,
    summary,
    department: DEPARTMENTS[category],
    source: "fallback",
  };
}
