import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AI_TIMEOUT_MS,
  ALLOWED_CATEGORIES,
  ALLOWED_PRIORITIES,
} from "../constants.js";
import { ProviderError, ProviderUnavailableError } from "../errors.js";
import { parseProviderResponse } from "../parse.js";
import { validateAIResult } from "../validate/output.js";

/**
 * Analyze an issue with Google's Gemini provider.
 * @param {{ title: string, description: string, image?: string | null }} input
 * @returns {Promise<{ category: string, priority: string, summary: string, department: string, source: "gemini" }>}
 */
export async function analyzeWithGemini(input) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    throw new ProviderUnavailableError("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });
  const prompt = `Analyze this campus issue and return STRICT JSON with exactly these keys: category, priority, summary, department.
Allowed categories: ${ALLOWED_CATEGORIES.join(", ")}.
Allowed priorities: ${ALLOWED_PRIORITIES.join(", ")}.
Return ONLY valid JSON. No markdown. No explanation.
Title: ${input.title}
Description: ${input.description}`;

  let responseText;
  try {
    const timeoutError = new Error("Gemini request timed out");
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(timeoutError), AI_TIMEOUT_MS);
    });
    const response = await Promise.race([model.generateContent(prompt), timeout]);
    responseText = response.response.text();
  } catch (error) {
    if (error === undefined) {
      throw new ProviderError("Gemini request failed", error);
    }
    if (error.message === "Gemini request timed out") {
      throw new ProviderError("Gemini request timed out", error);
    }
    throw new ProviderError("Gemini request failed", error);
  }

  const parsed = parseProviderResponse(responseText);
  const validated = validateAIResult(parsed);
  return { ...validated, source: "gemini" };
}
