import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PanelStatus } from "@/types";

type PanelShellProps<T> = {
  title: string;
  description?: string;
  status: PanelStatus<T>;
  loadingMessage?: string;
  children: (data: T) => ReactNode;
};

export function PanelShell<T>({
  title,
  description,
  status,
  loadingMessage = "Loading…",
  children,
}: PanelShellProps<T>) {
  return (
    <Card className="flex min-h-[220px] flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex-1 text-sm leading-relaxed">
        {status.status === "empty" && (
          <p className="text-muted-foreground">{status.message}</p>
        )}
        {status.status === "loading" && (
          <p className="text-muted-foreground">{loadingMessage}</p>
        )}
        {status.status === "error" && (
          <p className="text-destructive">{status.message}</p>
        )}
        {status.status === "ready" && children(status.data)}
      </CardContent>
    </Card>
  );
}
