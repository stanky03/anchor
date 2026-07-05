"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  CAPTION_DELAY_OPTIONS,
  FONT_SIZE_DEFAULT,
} from "@/lib/design-tokens";
import type { ContrastPreset, ReadingLevel, UserAccessibilitySettings } from "@/types";

const COGNITIVE_LOAD_DEFAULTS = {
  fontSize: 24,
  captionDelaySec: 5,
  contrastPreset: "dark-calm" as ContrastPreset,
};

type SettingsState = UserAccessibilitySettings & {
  setReadingLevel: (readingLevel: ReadingLevel) => void;
  setFontSize: (fontSize: number) => void;
  setCaptionDelaySec: (captionDelaySec: number) => void;
  setContrastPreset: (contrastPreset: ContrastPreset) => void;
  setReduceCognitiveLoad: (reduceCognitiveLoad: boolean) => void;
  reset: () => void;
};

const DEFAULT_SETTINGS: UserAccessibilitySettings = {
  readingLevel: "original",
  fontSize: FONT_SIZE_DEFAULT,
  captionDelaySec: CAPTION_DELAY_OPTIONS[0],
  contrastPreset: "default",
  reduceCognitiveLoad: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setReadingLevel: (readingLevel) => set({ readingLevel }),
      setFontSize: (fontSize) => set({ fontSize }),
      setCaptionDelaySec: (captionDelaySec) => set({ captionDelaySec }),
      setContrastPreset: (contrastPreset) => set({ contrastPreset }),
      setReduceCognitiveLoad: (reduceCognitiveLoad) => {
        if (reduceCognitiveLoad) {
          set({
            reduceCognitiveLoad: true,
            ...COGNITIVE_LOAD_DEFAULTS,
          });
          return;
        }

        set({ reduceCognitiveLoad: false });
      },
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: "flexv2-accessibility-settings",
      partialize: (state) => ({
        readingLevel: state.readingLevel,
        fontSize: state.fontSize,
        captionDelaySec: state.captionDelaySec,
        contrastPreset: state.contrastPreset,
        reduceCognitiveLoad: state.reduceCognitiveLoad,
      }),
    },
  ),
);

