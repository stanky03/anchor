"use client";

import { AccessibilityPanel } from "@/components/AccessibilityPanel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type SettingsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Accessibility</SheetTitle>
          <SheetDescription>
            Make the app work for you — name for mention detection, theme,
            text size, and caption comfort.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-6">
          <AccessibilityPanel />
        </div>
      </SheetContent>
    </Sheet>
  );
}
