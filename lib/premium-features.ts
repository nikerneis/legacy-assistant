export const PREMIUM_FEATURES = {
  AI_MODES: ["education", "coding", "reflection", "planning", "image", "video"],
  VOICE_ASSISTANT: true,
  EMAIL_GENERATION: true,
  AUTOMATIONS: true,
  ADVANCED_PLANNING: true,
  IMAGE_GENERATION: true,
  VIDEO_ANALYSIS: true,
} as const

export function isPremiumFeature(featureName: keyof typeof PREMIUM_FEATURES): boolean {
  const feature = PREMIUM_FEATURES[featureName]
  return typeof feature === "boolean" ? feature : false
}

export function getRestrictedModes(): string[] {
  return PREMIUM_FEATURES["AI_MODES"] as string[]
}
