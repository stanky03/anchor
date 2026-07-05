"use client";

import { create } from "zustand";

import {
  emptyPanel,
  errorPanel,
  loadingPanel,
  readyPanel,
} from "@/lib/panel-state";
import type {
  AskMeetingResponse,
  CatchUpCard,
  CurrentThread,
  MeetingSessionState,
  PanelStatus,
  TranscriptChunk,
  UserActionItem,
} from "@/types";

type MeetingState = {
  sessionState: MeetingSessionState;
  playbackTimeSec: number;
  lostMarkerTimestamp: number | null;
  lostMarkerMessage: string | null;
  transcript: TranscriptChunk[];
  currentThread: PanelStatus<CurrentThread>;
  catchUp: PanelStatus<CatchUpCard>;
  userActionItems: PanelStatus<UserActionItem[]>;
  askResponse: PanelStatus<AskMeetingResponse>;
  transcriptPanel: PanelStatus<TranscriptChunk[]>;
  setSessionState: (sessionState: MeetingSessionState) => void;
  setPlaybackTimeSec: (playbackTimeSec: number) => void;
  setLostMarker: (timestamp: number | null, message?: string | null) => void;
  setTranscript: (transcript: TranscriptChunk[]) => void;
  addTranscriptChunk: (chunk: TranscriptChunk) => void;
  setCurrentThread: (currentThread: PanelStatus<CurrentThread>) => void;
  setCatchUp: (catchUp: PanelStatus<CatchUpCard>) => void;
  setUserActionItems: (items: PanelStatus<UserActionItem[]>) => void;
  setAskResponse: (response: PanelStatus<AskMeetingResponse>) => void;
  setTranscriptPanel: (panel: PanelStatus<TranscriptChunk[]>) => void;
  reset: () => void;
};

const INITIAL_STATE = {
  sessionState: "idle" as MeetingSessionState,
  playbackTimeSec: 0,
  lostMarkerTimestamp: null as number | null,
  lostMarkerMessage: null as string | null,
  transcript: [] as TranscriptChunk[],
  currentThread: emptyPanel<CurrentThread>(
    "Start a meeting to see the current topic.",
  ),
  catchUp: emptyPanel<CatchUpCard>("Catch me up when you lose the thread."),
  userActionItems: emptyPanel<UserActionItem[]>(
    "Nothing flagged for you yet.",
  ),
  askResponse: emptyPanel<AskMeetingResponse>(
    "Pick a prompt once the meeting is running.",
  ),
  transcriptPanel: emptyPanel<TranscriptChunk[]>(
    "Transcript will appear here.",
  ),
};

export const useMeetingStore = create<MeetingState>((set) => ({
  ...INITIAL_STATE,
  setSessionState: (sessionState) => set({ sessionState }),
  setPlaybackTimeSec: (playbackTimeSec) => set({ playbackTimeSec }),
  setLostMarker: (lostMarkerTimestamp, lostMarkerMessage = null) =>
    set({ lostMarkerTimestamp, lostMarkerMessage }),
  setTranscript: (transcript) =>
    set({
      transcript,
      transcriptPanel: transcript.length
        ? readyPanel(transcript)
        : emptyPanel("Transcript will appear here."),
    }),
  addTranscriptChunk: (chunk) =>
    set((state) => {
      const transcript = [...state.transcript, chunk];
      return {
        transcript,
        transcriptPanel: readyPanel(transcript),
      };
    }),
  setCurrentThread: (currentThread) => set({ currentThread }),
  setCatchUp: (catchUp) => set({ catchUp }),
  setUserActionItems: (userActionItems) => set({ userActionItems }),
  setAskResponse: (askResponse) => set({ askResponse }),
  setTranscriptPanel: (transcriptPanel) => set({ transcriptPanel }),
  reset: () => set(INITIAL_STATE),
}));

export const meetingLoading = {
  currentThread: loadingPanel<CurrentThread>(),
  catchUp: loadingPanel<CatchUpCard>(),
  userActionItems: loadingPanel<UserActionItem[]>(),
  askResponse: loadingPanel<AskMeetingResponse>(),
  transcript: loadingPanel<TranscriptChunk[]>(),
};

export const meetingErrors = {
  currentThread: errorPanel<CurrentThread>(
    "Couldn't read the thread. Try Catch me up again.",
  ),
  catchUp: errorPanel<CatchUpCard>("Couldn't generate a catch-up right now."),
  userActionItems: errorPanel<UserActionItem[]>("Couldn't check right now."),
  askResponse: errorPanel<AskMeetingResponse>("That didn't work. Try again."),
  transcript: errorPanel<TranscriptChunk[]>("Transcription unavailable."),
};
