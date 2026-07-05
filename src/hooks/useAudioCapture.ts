"use client";

import { useCallback, useState } from "react";

export type AudioCaptureSource = "tab" | "file" | null;

export function useAudioCapture() {
  const [source, setSource] = useState<AudioCaptureSource>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const stopCapture = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setFile(null);
    setSource(null);
    setError(null);
  }, [stream]);

  const startTabCapture = useCallback(async () => {
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);
      setSource("tab");

      mediaStream.getVideoTracks()[0]?.addEventListener("ended", () => {
        mediaStream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setFile(null);
        setSource(null);
      });

      return mediaStream;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Tab audio capture failed";
      setError(message);
      throw err;
    }
  }, []);

  const startFileCapture = useCallback(async (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);
    setSource("file");
    return selectedFile;
  }, []);

  return {
    source,
    error,
    stream,
    file,
    startTabCapture,
    startFileCapture,
    stopCapture,
  };
}
