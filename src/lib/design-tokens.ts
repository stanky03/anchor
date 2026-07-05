import type { ContrastPreset } from "@/types";

export type ContrastTheme = {
  id: ContrastPreset;
  label: string;
  background: string;
  foreground: string;
  mutedForeground: string;
  accent: string;
  decision: string;
  actionItem: string;
  fontFamily: string;
  letterSpacing: string;
  lineHeight: string;
};

export const CONTRAST_PRESETS: Record<ContrastPreset, ContrastTheme> = {
  default: {
    id: "default",
    label: "Light minimal",
    background: "#ffffff",
    foreground: "#1a1a1a",
    mutedForeground: "#525252",
    accent: "#2563eb",
    decision: "#7c3aed",
    actionItem: "#059669",
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    letterSpacing: "normal",
    lineHeight: "1.6",
  },
  high: {
    id: "high",
    label: "High contrast",
    background: "#000000",
    foreground: "#ffff00",
    mutedForeground: "#ffff99",
    accent: "#00ffff",
    decision: "#ff00ff",
    actionItem: "#00ff00",
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    letterSpacing: "normal",
    lineHeight: "1.6",
  },
  "dark-calm": {
    id: "dark-calm",
    label: "Dark calm",
    background: "#1e1e2e",
    foreground: "#cdd6f4",
    mutedForeground: "#a6adc8",
    accent: "#89b4fa",
    decision: "#cba6f7",
    actionItem: "#a6e3a1",
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    letterSpacing: "normal",
    lineHeight: "1.6",
  },
  dyslexia: {
    id: "dyslexia",
    label: "Dyslexia-friendly",
    background: "#fdf6e3",
    foreground: "#333333",
    mutedForeground: "#555555",
    accent: "#268bd2",
    decision: "#6c71c4",
    actionItem: "#859900",
    fontFamily: "OpenDyslexic, var(--font-geist-sans), system-ui, sans-serif",
    letterSpacing: "0.05em",
    lineHeight: "1.8",
  },
};

export const FONT_SIZE_MIN = 16;
export const FONT_SIZE_MAX = 32;
export const FONT_SIZE_DEFAULT = 20;

export const CAPTION_DELAY_OPTIONS = [0, 3, 5, 10] as const;

export const READING_LEVEL_OPTIONS = [
  { value: "grade6" as const, label: "Grade 6" },
  { value: "grade8" as const, label: "Grade 8" },
  { value: "original" as const, label: "Original" },
];
