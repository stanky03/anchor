"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/userStore";

export function UserNameField() {
  const userName = useUserStore((state) => state.userName);
  const setUserName = useUserStore((state) => state.setUserName);

  return (
    <div className="flex min-w-[220px] flex-col gap-2">
      <Label htmlFor="user-name" className="text-sm text-muted-foreground">
        Your name
      </Label>
      <Input
        id="user-name"
        value={userName}
        onChange={(event) => setUserName(event.target.value)}
        placeholder="For mention detection"
        autoComplete="name"
      />
    </div>
  );
}
