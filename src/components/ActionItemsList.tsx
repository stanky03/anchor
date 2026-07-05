"use client";

import { ListTodo } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimestamp } from "@/lib/captions";
import { useCaptionStore } from "@/stores/captionStore";

export function ActionItemsList() {
  const actionItems = useCaptionStore((state) => state.actionItems);

  return (
    <Card className="rounded-2xl border border-l-4 border-l-section-tasks bg-section-tasks-tint ring-0">
      <CardHeader className="pb-2">
        <CardTitle
          asChild
          className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-section-tasks"
        >
          <h2>
            <ListTodo className="size-4" aria-hidden />
            Action items
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {actionItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Detected tasks will appear here.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {actionItems.map((item) => (
              <li key={item.id} className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>
                  {item.assignee ? (
                    <>
                      <strong>{item.assignee}</strong>
                      {" → "}
                    </>
                  ) : null}
                  {item.task}{" "}
                  <Badge variant="outline" className="ml-1 align-middle">
                    {formatTimestamp(item.timestamp)}
                  </Badge>
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
