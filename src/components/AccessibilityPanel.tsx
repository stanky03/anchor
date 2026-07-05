"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  CAPTION_DELAY_OPTIONS,
  CONTRAST_PRESETS,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  READING_LEVEL_OPTIONS,
} from "@/lib/design-tokens";
import { useSettingsStore } from "@/stores/settingsStore";

export function AccessibilityPanel() {
  const {
    readingLevel,
    fontSize,
    captionDelaySec,
    contrastPreset,
    reduceCognitiveLoad,
    setReadingLevel,
    setFontSize,
    setCaptionDelaySec,
    setContrastPreset,
    setReduceCognitiveLoad,
  } = useSettingsStore();

  const readingLevelIndex = READING_LEVEL_OPTIONS.findIndex(
    (option) => option.value === readingLevel,
  );

  return (
    <section
      aria-label="Accessibility settings"
      className="space-y-5 rounded-lg border p-4"
    >
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Accessibility
      </h2>

      <div className="space-y-3">
        <Label htmlFor="reading-level">Reading level</Label>
        <Slider
          id="reading-level"
          min={0}
          max={READING_LEVEL_OPTIONS.length - 1}
          step={1}
          value={[readingLevelIndex >= 0 ? readingLevelIndex : 2]}
          onValueChange={([value]) => {
            const option = READING_LEVEL_OPTIONS[value ?? 2];
            if (option) setReadingLevel(option.value);
          }}
        />
        <p className="text-sm text-muted-foreground">
          {READING_LEVEL_OPTIONS[readingLevelIndex]?.label ?? "Original"}
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="font-size">Font size ({fontSize}px)</Label>
        <Slider
          id="font-size"
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          step={2}
          value={[fontSize]}
          onValueChange={([value]) => setFontSize(value ?? fontSize)}
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="caption-delay">Caption delay</Label>
        <Select
          value={String(captionDelaySec)}
          onValueChange={(value) => setCaptionDelaySec(Number(value))}
        >
          <SelectTrigger id="caption-delay" className="w-full">
            <SelectValue placeholder="Select delay" />
          </SelectTrigger>
          <SelectContent>
            {CAPTION_DELAY_OPTIONS.map((seconds) => (
              <SelectItem key={seconds} value={String(seconds)}>
                {seconds === 0 ? "Live (no delay)" : `${seconds} seconds`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="contrast-preset">Contrast preset</Label>
        <Select
          value={contrastPreset}
          onValueChange={(value) =>
            setContrastPreset(value as typeof contrastPreset)
          }
        >
          <SelectTrigger id="contrast-preset" className="w-full">
            <SelectValue placeholder="Select contrast" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(CONTRAST_PRESETS).map((preset) => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <Label htmlFor="cognitive-load">Reduce cognitive load</Label>
          <p className="text-xs text-muted-foreground">
            Slower roll, 2 lines max, hide filler words, calmer UI
          </p>
        </div>
        <Switch
          id="cognitive-load"
          checked={reduceCognitiveLoad}
          onCheckedChange={setReduceCognitiveLoad}
        />
      </div>
    </section>
  );
}
