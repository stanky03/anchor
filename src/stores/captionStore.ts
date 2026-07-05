"use client";

import { create } from "zustand";

import type {
  ActionItem,
  CaptionChunk,
  MeetingMode,
  MeetingSummary,
} from "@/types";

type CaptionState = {
  mode: MeetingMode;
  isCapturing: boolean;
  isDemoMode: boolean;
  captions: CaptionChunk[];
  actionItems: ActionItem[];
  summary: MeetingSummary | null;
  playbackTimeSec: number;
  setMode: (mode: MeetingMode) => void;
  setIsCapturing: (isCapturing: boolean) => void;
  setIsDemoMode: (isDemoMode: boolean) => void;
  addCaption: (chunk: CaptionChunk) => void;
  setCaptions: (captions: CaptionChunk[]) => void;
  setActionItems: (actionItems: ActionItem[]) => void;
  setSummary: (summary: MeetingSummary | null) => void;
  setPlaybackTimeSec: (playbackTimeSec: number) => void;
  reset: () => void;
};

const INITIAL_STATE = {
  mode: "idle" as MeetingMode,
  isCapturing: false,
  isDemoMode: false,
  captions: [] as CaptionChunk[],
  actionItems: [] as ActionItem[],
  summary: null as MeetingSummary | null,
  playbackTimeSec: 0,
};

export const useCaptionStore = create<CaptionState>((set) => ({
  ...INITIAL_STATE,
  setMode: (mode) => set({ mode }),
  setIsCapturing: (isCapturing) => set({ isCapturing }),
  setIsDemoMode: (isDemoMode) => set({ isDemoMode }),
  addCaption: (chunk) =>
    set((state) => ({ captions: [...state.captions, chunk] })),
  setCaptions: (captions) => set({ captions }),
  setActionItems: (actionItems) => set({ actionItems }),
  setSummary: (summary) => set({ summary }),
  setPlaybackTimeSec: (playbackTimeSec) => set({ playbackTimeSec }),
  reset: () => set(INITIAL_STATE),
}));
