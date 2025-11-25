import { google } from "@ai-sdk/google"
import { anthropic } from "@ai-sdk/anthropic"
import type { AiMode } from "./ai-modes"

// Map each AI mode to the best provider for that task
export const AI_MODE_PROVIDERS = {
  assistance: google("gemini-2.0-flash"),
  education: anthropic("claude-3-5-sonnet-20241022"),
  coding: google("gemini-2.0-flash"),
  reflection: anthropic("claude-3-5-sonnet-20241022"),
  planning: google("gemini-2.0-flash"),
  image: google("gemini-2.0-flash"),
  video: google("gemini-2.0-flash"),
} as const

export function getProviderForMode(mode: AiMode) {
  return AI_MODE_PROVIDERS[mode] || AI_MODE_PROVIDERS.assistance
}
