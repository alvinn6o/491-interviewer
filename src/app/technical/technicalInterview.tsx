"use client";

import { useEffect, useState } from "react";
import CodeEditor, { getStarterCode, type SupportedLanguage } from "./_components/CodeEditor";
import { useInterviewSession } from "./useInterviewSession";

/* Page States */
enum TIPageState {
  START,
  ACTIVE,
  END,
}

/* Question Type */
type Question = {
  id: number;
  prompt: string;
};

/* Dummy Fetch */
function fetchTechnicalQuestions(): Question[] {
  return [
    { id: 1, prompt: "Write a function that adds two numbers." },
    { id: 2, prompt: "Reverse a string." },
  ];
}

/* View Switcher */
export default function TechnicalInterviewViewSwitcher() {
  const [pageState, setPageState] = useState<TIPageState>(
    TIPageState.START
  );

/* Shared interview data */
  const [questions] = useState<Question[]>(fetchTechnicalQuestions());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [language, setLanguage] = useState<SupportedLanguage>("python");
  const [code, setCode] = useState(getStarterCode("python"));
  const [output, setOutput] = useState("");
  const [passed, setPassed] = useState<boolean | null>(null);

  // Reset code to starter when language changes
  function handleLanguageChange(newLang: SupportedLanguage) {
    setLanguage(newLang);
    setCode(getStarterCode(newLang));
  }

  const [questionStatus, setQuestionStatus] = useState<boolean[]>(
    questions.map(() => false) // false = incomplete
  );

  function handleTimeExpired() {
    setPageState(TIPageState.END);
  }
  const { session, timeLeft, startSession, resumeSession, endSession, formatTime } =
    useInterviewSession(handleTimeExpired);

  /* Helpers */
  function startInterview(index: number) {
    setCurrentQuestionIndex(index);
    setPageState(TIPageState.ACTIVE);

    if (session.status === "idle") {
      startSession();
    } else if (session.status === "paused") {
      resumeSession();
    }
  }

  function finishEarly() {
    endSession();
    setPageState(TIPageState.END);
  }

  function backToQuestions() {
    setPageState(TIPageState.START);
  }
    // Judge0 language IDs
    const JUDGE0_LANGUAGE_IDS: Record<SupportedLanguage, number> = {
      python: 71,  // Python 3
      cpp: 54,     // C++ (GCC 9.2.0)
    };

    function runCode() {
      // Package code for Judge0 submission
      const payload = {
        source_code: code,
        language_id: JUDGE0_LANGUAGE_IDS[language],
        // stdin: "", // Will be populated with test case input later
      };

      // Display the payload for verification (will be sent to backend later)
      setOutput(JSON.stringify(payload, null, 2));

      // TODO: Replace with actual API call to backend
      // const response = await fetch("/api/judge", {
      //   method: "POST",
      //   body: JSON.stringify({ ...payload, problemId: questions[currentQuestionIndex].id }),
      // });

      // Temporary pass logic for demo
      setPassed(null);
    }

  function SessionBadge() {
    let badgeColor = "bg-gray-200 text-gray-600";
    let badgeText = "Not Started";

    if (session.status === "active") {
      badgeColor = "bg-green-100 text-green-700";
      badgeText = "Session Active";
    } else if (session.status === "paused") {
      badgeColor = "bg-yellow-100 text-yellow-700";
      badgeText = "Paused — return to resume";
    } else if (session.status === "ended") {
      badgeColor = "bg-red-100 text-red-600";
      badgeText = "Session Ended";
    }

    return (
      <span className={"text-xs px-2 py-1 rounded-full font-medium " + badgeColor}>
        {badgeText}
      </span>
    );
  }

/* Views */
switch (pageState) {
    case TIPageState.START:
      return (
        <main className="min-h-screen px-6 py-10">
          <div className="flex justify-between max-w-4xl mx-auto items-center">
            <div>
              <h1 className="text-3xl font-bold">Technical Interview</h1>
              <p className="text-gray-500 mt-1">
                Time limit of 60 minutes to complete both questions
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-semibold">
                Time Remaining: {formatTime(timeLeft)}
              </span>
              <SessionBadge />
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-10 border rounded-lg">
            <div className="bg-orange-500 text-white px-4 py-2 font-semibold">
              Technical Skill Testing
            </div>

            {questions.map((q, index) => (
              <div
                key={q.id}
                className="flex items-center justify-between px-4 py-4 border-t"
              >
                <span>
                  Question #{index + 1}{" "}
                  {questionStatus[index] === true ? (
                    <span className="text-green-600 ml-2">(Complete)</span>
                  ) : (
                    <span className="text-gray-400 ml-2">(Incomplete)</span>
                  )}
                </span>

                <button
                  onClick={() => startInterview(index)}
                  className="bg-orange-500 text-white px-4 py-1 rounded"
                >
                  {session.status === "idle" ? "Start" : "Continue"}
                </button>
              </div>
            ))}
          </div>
        </main>
      );

    case TIPageState.ACTIVE:
      return (
        <main className="min-h-screen px-6 py-10">

          {/* Header with back button and timer */}
          <div className="flex justify-between max-w-4xl mx-auto items-center">
            <button
              onClick={backToQuestions}
              className="text-sm text-blue-600 underline"
            >
              ← Back to questions
            </button>
            <div className="flex flex-col items-end gap-1">
              <span className="font-semibold">
                Time Remaining: {formatTime(timeLeft)}
              </span>
              <SessionBadge />
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-2">
            <button
              onClick={finishEarly}
              disabled={!questionStatus.some(Boolean)}
              className={
                questionStatus.some(Boolean)
                  ? "text-sm underline text-red-600"
                  : "text-sm underline text-gray-400 cursor-not-allowed"
              }
            >
              Finish Test Early
            </button>
          </div>

          {/*show banner when paused*/}
          {session.status === "paused" && (
            <div className="max-w-4xl mx-auto mt-4 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded text-sm text-center">
              Timer paused — your session will resume when you return to this tab.
            </div>
          )}

          {/* Question */}
          <div className="max-w-4xl mx-auto border rounded p-4 mt-6">
            <p className="text-sm text-gray-700">
              {questions[currentQuestionIndex].prompt}
            </p>
          </div>

          {/* Code + Output */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6 mt-6">
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2">Code</h3>
              <CodeEditor
                language={language}
                value={code}
                onChange={setCode}
                onLanguageChange={handleLanguageChange}
                height="300px"
              />
              <button
                onClick={runCode}
                className="mt-3 bg-orange-500 text-white px-4 py-1 rounded"
              >
                Run Code
              </button>
            </div>

            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2">Results (Judge0 Payload)</h3>
              <pre className="bg-gray-100 h-64 p-2 rounded text-sm overflow-auto whitespace-pre-wrap">
                {output || "Click 'Run Code' to see test of results sent to backend"}
              </pre>

              <div className="mt-4 text-sm">
                {passed === null && <p>Run code to see results</p>}
                {passed && (
                  <p className="text-green-600">
                    Case Test Passed ✅
                  </p>
                )}
                {passed === false && (
                  <p className="text-red-600">
                    Case Test Failed ❌
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      );

      {/* End View + Summary */}
    case TIPageState.END:
        return (
            <main className="min-h-screen flex items-center justify-center">

            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6">
                Interview Complete
                </h1>
                <ul className="text-sm space-y-2">
                {questionStatus.map((done, idx) => (
                    <li key={idx}>
                    Question #{idx + 1}:{" "}
                    {done ? (
                        <span className="text-green-600 font-semibold">
                        Complete
                        </span>
                    ) : (
                        <span className="text-red-600 font-semibold">
                        Incomplete
                        </span>
                    )}
                    </li>
                ))}
                </ul>

            </div>
        </main>
      );
  }
}
