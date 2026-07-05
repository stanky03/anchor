import type { CSSProperties } from "react";

import { CONTRAST_PRESETS } from "@/lib/design-tokens";
import type { ContrastPreset } from "@/types";

export function getContrastThemeStyles(preset: ContrastPreset): CSSProperties {
  const theme = CONTRAST_PRESETS[preset];

  return {
    backgroundColor: theme.background,
    color: theme.foreground,
    fontFamily: theme.fontFamily,
    letterSpacing: theme.letterSpacing,
    lineHeight: theme.lineHeight,
    "--caption-muted": theme.mutedForeground,
    "--caption-accent": theme.accent,
    "--caption-decision": theme.decision,
    "--caption-action": theme.actionItem,
  } as CSSProperties;
}
