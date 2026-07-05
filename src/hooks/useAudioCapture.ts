"use client";

import { useCallback, useState } from "react";

export function useAudioCapture() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startMicrophoneCapture = useCallback(async () => {
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setStream(mediaStream);
      return mediaStream;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Microphone capture failed";
      setError(message);
      throw err;
    }
  }, []);

  const stopCapture = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setError(null);
  }, [stream]);

  return {
    stream,
    error,
    startMicrophoneCapture,
    stopCapture,
  };
}
