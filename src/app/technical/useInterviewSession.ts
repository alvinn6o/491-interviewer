"use client";

import { useEffect, useRef, useState } from "react";

export type SessionStatus = "idle" | "active" | "paused" | "ended";

export type InterviewSession = {
  sessionId: string;
  startedAt: Date | null;
  status: SessionStatus;
  totalPausedMs: number;
};

type UseInterviewSessionReturn = {
  session: InterviewSession;
  timeLeft: number;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  formatTime: (seconds: number) => string;
};

const INTERVIEW_DURATION_SECONDS = 60 * 60;

function generateSessionId(): string {
  return "session_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
}

export function useInterviewSession(
  onTimeExpired: () => void
): UseInterviewSessionReturn {

  const [session, setSession] = useState<InterviewSession>({
    sessionId: generateSessionId(),
    startedAt: null,
    status: "idle",
    totalPausedMs: 0,
  });

  const [timeLeft, setTimeLeft] = useState(INTERVIEW_DURATION_SECONDS);

  const pausedAtRef = useRef<number | null>(null);

  const statusRef = useRef<SessionStatus>("idle");

  useEffect(() => {
    statusRef.current = session.status;
  }, [session.status]);

  useEffect(() => {
    if (session.status !== "active") {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setSession((prev) => ({ ...prev, status: "ended" }));
          onTimeExpired();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session.status, onTimeExpired]);

  //Pause when user switches tabs or minimizes window
  useEffect(() => {

    // Fires when the tab becomes hidden or visible
    function handleVisibilityChange() {
      if (document.hidden) {
        if (statusRef.current === "active") {
          pausedAtRef.current = Date.now();
          setSession((prev) => ({ ...prev, status: "paused" }));
        }
      } else {
        if (statusRef.current === "paused") {
          let pausedMs = 0;
          if (pausedAtRef.current !== null) {
            pausedMs = Date.now() - pausedAtRef.current;
          }
          pausedAtRef.current = null;
          setSession((prev) => ({
            ...prev,
            status: "active",
            totalPausedMs: prev.totalPausedMs + pausedMs,
          }));
        }
      }
    }

    // Fires when the window loses focus (alt-tab, clicking away)
    function handleWindowBlur() {
      if (statusRef.current === "active") {
        pausedAtRef.current = Date.now();
        setSession((prev) => ({ ...prev, status: "paused" }));
      }
    }

    // Fires when the user comes back to the window
    function handleWindowFocus() {
      if (statusRef.current === "paused") {
        let pausedMs = 0;
        if (pausedAtRef.current !== null) {
          pausedMs = Date.now() - pausedAtRef.current;
        }
        pausedAtRef.current = null;
        setSession((prev) => ({
          ...prev,
          status: "active",
          totalPausedMs: prev.totalPausedMs + pausedMs,
        }));
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    // Cleanup event listeners when component unmounts
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  function startSession() {
    setSession((prev) => ({
      ...prev,
      startedAt: new Date(),
      status: "active",
    }));
  }

  function pauseSession() {
    if (statusRef.current !== "active") {
      return;
    }
    pausedAtRef.current = Date.now();
    setSession((prev) => ({ ...prev, status: "paused" }));
  }

  function resumeSession() {
    if (statusRef.current !== "paused") {
      return;
    }
    let pausedMs = 0;
    if (pausedAtRef.current !== null) {
      pausedMs = Date.now() - pausedAtRef.current;
    }
    pausedAtRef.current = null;
    setSession((prev) => ({
      ...prev,
      status: "active",
      totalPausedMs: prev.totalPausedMs + pausedMs,
    }));
  }

  function endSession() {
    setSession((prev) => ({ ...prev, status: "ended" }));
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ":" + s.toString().padStart(2, "0");
  }

  return {
    session,
    timeLeft,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    formatTime,
  };
}