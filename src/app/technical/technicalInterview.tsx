"use client";

// Dylan Hartley
// 12/12/2025

import { useEffect, useState } from "react";
import CodeEditor, { getStarterCode, type SupportedLanguage } from "./_components/CodeEditor";
import { useInterviewSession } from "./useInterviewSession";
import type { TestResult } from "~/lib/testHarness";
import type { QuestionSummary } from "~/app/api/questions/route";

/* Page States */
enum TIPageState {
  START,
  ACTIVE,
  END,
}

/* View Switcher */
export default function TechnicalInterviewViewSwitcher() {
  const [pageState, setPageState] = useState<TIPageState>(TIPageState.START);

  // Fetch questions dynamically from API
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [language, setLanguage] = useState<SupportedLanguage>("python");
  const [code, setCode] = useState("");

  // Real per-test-case results from /api/judge
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [compileOutput, setCompileOutput] = useState("");
  const [stderr, setStderr] = useState("");

  const [isRunning, setIsRunning] = useState(false);
  const [questionStatus, setQuestionStatus] = useState<boolean[]>([]);

  // Called by the hook when the 60-minute timer hits zero
  function handleTimeExpired() {
    setPageState(TIPageState.END);
  }

  const { session, timeLeft, startSession, resumeSession, endSession, formatTime } =
    useInterviewSession(handleTimeExpired);

  // Fetch questions from JSON-backed API on mount, initialize starter code
  useEffect(() => {
    fetch("/api/questions")
      .then((r) => r.json())
      .then((data: QuestionSummary[]) => {
        setQuestions(data);
        setQuestionStatus(data.map(() => false));
        if (data[0]) {
          setCode(data[0].starterCode["python"] ?? getStarterCode("python"));
        }
      })
      .catch(console.error);
  }, []);

  /* Helpers */
  const currentQuestion = questions[currentQuestionIndex];

  function handleLanguageChange(newLang: SupportedLanguage) {
    setLanguage(newLang);
    if (currentQuestion) {
      setCode(currentQuestion.starterCode[newLang] ?? getStarterCode(newLang));
    }
  }

  // Start a specific question; kicks off or resumes the session
  function startInterview(index: number) {
    setCurrentQuestionIndex(index);
    const q = questions[index];
    if (q) setCode(q.starterCode[language] ?? getStarterCode(language));
    setTestResults([]);
    setCompileOutput("");
    setStderr("");
    setPageState(TIPageState.ACTIVE);

    if (session.status === "idle") {
      startSession();
    } else if (session.status === "paused") {
      resumeSession();
    }
  }

  // Finish the interview early
  function finishEarly() {
    endSession();
    setPageState(TIPageState.END);
  }

  // Go back to question list; timer keeps running
  function backToQuestions() {
    setPageState(TIPageState.START);
  }

  async function runCode() {
    if (!currentQuestion) return;
    setIsRunning(true);
    setTestResults([]);
    setCompileOutput("");
    setStderr("");

    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code,
          language,
          questionId: currentQuestion.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setStderr(result.error ?? "Unknown error");
        return;
      }

      setTestResults(result.testResults ?? []);
      setCompileOutput(result.compile_output ?? "");
      setStderr(result.stderr ?? "");

      if (result.allPassed) {
        setQuestionStatus((prev) => {
          const next = [...prev];
          next[currentQuestionIndex] = true;
          return next;
        });
      }
    } catch (error) {
      setStderr(error instanceof Error ? error.message : "Failed to execute");
    } finally {
      setIsRunning(false);
    }
  }

  // Colored difficulty badge
  function DifficultyBadge({ difficulty }: { difficulty: string }) {
    let badgeColor = "bg-gray-100 text-gray-600";
    if (difficulty === "Easy") badgeColor = "bg-green-100 text-green-700";
    else if (difficulty === "Medium") badgeColor = "bg-yellow-100 text-yellow-700";
    else if (difficulty === "Hard") badgeColor = "bg-red-100 text-red-600";
    return (
      <span className={"text-xs px-2 py-1 rounded-full font-medium ml-2 " + badgeColor}>
        {difficulty}
      </span>
    );
  }

  // Session status badge
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
              <span className="font-semibold">Time Remaining: {formatTime(timeLeft)}</span>
              <SessionBadge />
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-10 border rounded-lg">
            <div className="bg-orange-500 text-white px-4 py-2 font-semibold">
              Technical Skill Testing
            </div>

            {questions.length === 0 && (
              <div className="px-4 py-6 text-gray-500 text-sm">Loading questions...</div>
            )}

            {questions.map((q, index) => (
              <div
                key={q.id}
                className="flex items-center justify-between px-4 py-4 border-t"
              >
                <span className="flex items-center">
                  Question #{index + 1}: {q.title}
                  <DifficultyBadge difficulty={q.difficulty} />
                  {questionStatus[index] === true ? (
                    <span className="text-green-600 ml-2">(Complete)</span>
                  ) : (
                    <span className="text-gray-400 ml-2">(Incomplete)</span>
                  )}
                </span>
                <button
                  onClick={() => startInterview(index)}
                  className="bg-orange-500 text-white px-4 py-1 rounded ml-4 shrink-0"
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
              <span className="font-semibold">Time Remaining: {formatTime(timeLeft)}</span>
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

          {/* Pause banner */}
          {session.status === "paused" && (
            <div className="max-w-4xl mx-auto mt-4 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded text-sm text-center">
              Timer paused — your session will resume when you return to this tab.
            </div>
          )}

          {/* Question title and difficulty */}
          {currentQuestion && (
            <div className="max-w-4xl mx-auto border rounded p-4 mt-6">
              <div className="flex items-center mb-2">
                <h2 className="font-semibold text-lg">{currentQuestion.title}</h2>
                <DifficultyBadge difficulty={currentQuestion.difficulty} />
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {currentQuestion.description}
              </p>
            </div>
          )}

          {/* Code editor and output panel */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6 mt-6">
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2 text-base">Code</h3>
              <CodeEditor
                language={language}
                value={code}
                onChange={setCode}
                onLanguageChange={handleLanguageChange}
                height="600px"
              />
              <button
                onClick={runCode}
                disabled={isRunning}
                className={`mt-3 px-4 py-1 rounded text-white ${
                  isRunning
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isRunning ? "Running..." : "Run Code"}
              </button>
            </div>

            {/* Test case results */}
            <div className="border rounded p-5 overflow-auto max-h-[720px]">
              <h3 className="font-semibold mb-3 text-base">Test Results</h3>

              {compileOutput && (
                <pre className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4 whitespace-pre-wrap">
                  Compile Error:{"\n"}{compileOutput}
                </pre>
              )}
              {stderr && !compileOutput && (
                <pre className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4 whitespace-pre-wrap">
                  {stderr}
                </pre>
              )}

              {testResults.length === 0 && !compileOutput && !stderr && (
                <p className="text-gray-400">Run your code to see test results</p>
              )}

              {testResults.map((r) => (
                <div
                  key={r.case}
                  className={`mb-4 p-4 rounded border ${
                    r.passed ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-base">
                      Case {r.case}{r.isHidden ? " (hidden)" : ""}
                    </span>
                    <span className={`font-semibold text-base ${r.passed ? "text-green-600" : "text-red-600"}`}>
                      {r.passed ? "Passed ✓" : "Failed ✗"}
                    </span>
                  </div>
                  {r.error ? (
                    <p className="text-red-700 text-sm">{r.error}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-700 mt-1">
                        Expected: <code className="bg-white px-1 py-0.5 rounded border text-sm">{r.expected}</code>
                      </p>
                      {!r.passed && (
                        <p className="text-sm text-gray-700 mt-1">
                          Got: <code className="bg-white px-1 py-0.5 rounded border text-sm">{r.actual}</code>
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}

              {testResults.length > 0 && (
                <p className="text-base font-semibold mt-2">
                  {testResults.filter((r) => r.passed).length} / {testResults.length} passed
                </p>
              )}
            </div>
          </div>
        </main>
      );

    case TIPageState.END:
      return (
        <main className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Interview Complete</h1>
            <ul className="text-sm space-y-2">
              {questions.map((q, idx) => (
                <li key={q.id}>
                  {q.title}:{" "}
                  {questionStatus[idx] ? (
                    <span className="text-green-600 font-semibold">Complete</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Incomplete</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </main>
      );
  }
}
