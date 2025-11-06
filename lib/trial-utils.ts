// Utility functions to manage trial data migration when user creates account
export function getTrialData() {
  if (typeof window === "undefined") return null

  const conversationKey = "trial_conversations"
  const settingsKey = "trial_settings"

  return {
    conversations: localStorage.getItem(conversationKey),
    settings: localStorage.getItem(settingsKey),
    startDate: localStorage.getItem("legacy_trial_start"),
  }
}

export function clearTrialData() {
  if (typeof window === "undefined") return

  localStorage.removeItem("trial_conversations")
  localStorage.removeItem("trial_settings")
  localStorage.removeItem("legacy_trial_start")
}

export function migrateTrialDataToAccount(userId: string) {
  const trialData = getTrialData()
  if (!trialData) return

  // Store trial data with user ID for migration
  if (trialData.conversations) {
    const key = `user_${userId}_migrated_conversations`
    localStorage.setItem(key, trialData.conversations)
  }

  if (trialData.settings) {
    const key = `user_${userId}_migrated_settings`
    localStorage.setItem(key, trialData.settings)
  }

  clearTrialData()
}
