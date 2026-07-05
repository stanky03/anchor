"use client";

import { useSettingsStore } from "@/stores/settingsStore";

export function useAccessibilitySettings() {
  const settings = useSettingsStore();

  return {
    ...settings,
    isCognitiveLoadActive: settings.reduceCognitiveLoad,
  };
}
