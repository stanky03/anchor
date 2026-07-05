import type { PanelStatus } from "@/types";

export function emptyPanel<T>(message: string): PanelStatus<T> {
  return { status: "empty", message };
}

export function loadingPanel<T>(): PanelStatus<T> {
  return { status: "loading" };
}

export function errorPanel<T>(message: string): PanelStatus<T> {
  return { status: "error", message };
}

export function readyPanel<T>(data: T): PanelStatus<T> {
  return { status: "ready", data };
}

export function isPanelLoading<T>(panel: PanelStatus<T>): boolean {
  return panel.status === "loading";
}

export function getPanelMessage<T>(panel: PanelStatus<T>): string | null {
  if (panel.status === "empty" || panel.status === "error") {
    return panel.message;
  }
  return null;
}
