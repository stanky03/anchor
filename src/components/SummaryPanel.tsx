"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCaptionStore } from "@/stores/captionStore";

export function SummaryPanel() {
  const summary = useCaptionStore((state) => state.summary);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wide">
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {summary?.text ??
            "A plain-language summary will update every ~30 seconds during the meeting."}
        </p>
      </CardContent>
    </Card>
  );
}
