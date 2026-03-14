"use client";

// Dylan Hartley
// 12/12/2025

import { useState } from "react";
import CodeEditor, { getStarterCode, type SupportedLanguage } from "./_components/CodeEditor";
import { useInterviewSession } from "./useInterviewSession";
import allQuestions from "../../../prisma/data/consolidated-questions.json";

/* Page States */
enum TIPageState {
  START,
  ACTIVE,
  END,
}

/* Question Type */
type Question = {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  starterCode: {
    python?: string;
    cpp?: string;
    java?: string;
    csharp?: string;
  };
};


//Randomly selects two questions from different difficulty tiers.
//Valid pairings: Easy+Medium, Easy+Hard, Medium+Hard.
function pickTwoQuestions(): Question[] {
  const easy = allQuestions.filter((q) => q.difficulty === "Easy") as Question[];
  const medium = allQuestions.filter((q) => q.difficulty === "Medium") as Question[];
  const hard = allQuestions.filter((q) => q.difficulty === "Hard") as Question[];

  // Randomly pick one item from an array
  function pickRandom(arr: Question[]): Question {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index]!;
  }

  // Randomly choose which difficulty pairing to use
  const pairings = [
    [easy, medium],
    [easy, hard],
    [medium, hard],
  ];

  // Filter out any pairings where one of the tiers is empty
  const validPairings = pairings.filter(
    (pair) => pair[0]!.length > 0 && pair[1]!.length > 0
  );

  // Pick a random valid pairing
  const chosenPairing = validPairings[Math.floor(Math.random() * validPairings.length)]!;

  const question1 = pickRandom(chosenPairing[0]!);
  const question2 = pickRandom(chosenPairing[1]!);

  return [question1, question2];
}

/* View Switcher */
export default function TechnicalInterviewViewSwitcher() {

  const [pageState, setPageState] = useState<TIPageState>(TIPageState.START);

  // Pick two questions once when the component first mounts
  const [questions] = useState<Question[]>(pickTwoQuestions());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [language, setLanguage] = useState<SupportedLanguage>("python");

  // Load the starter code for the first question in the selected language
  // Falls back to CodeEditor's generic starter code if the question doesn't have one
  const [code, setCode] = useState(
    questions[0]?.starterCode?.python ?? getStarterCode("python")
  );

  const [output, setOutput] = useState("");
  const [passed, setPassed] = useState<boolean | null>(null);

  const [questionStatus, setQuestionStatus] = useState<boolean[]>(
    questions.map(() => false)
  );

  // Called by the hook when the 60 minute timer hits zero
  function handleTimeExpired() {
    setPageState(TIPageState.END);
  }

  const { session, timeLeft, startSession, resumeSession, endSession, formatTime } =
    useInterviewSession(handleTimeExpired);

  // When the language changes, reload the starter code for the current question
  function handleLanguageChange(newLang: SupportedLanguage) {
    setLanguage(newLang);
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      const starter = currentQuestion.starterCode[newLang];
      setCode(starter ?? getStarterCode(newLang));
    }
  }

  // Start a specific question, also kicks off the session on first entry
  function startInterview(index: number) {
    setCurrentQuestionIndex(index);
    setPageState(TIPageState.ACTIVE);

    // Load the starter code for the selected question in the current language
    const selectedQuestion = questions[index];
    if (selectedQuestion) {
      const starter = selectedQuestion.starterCode[language];
      setCode(starter ?? getStarterCode(language));
    }

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

  // Go back to question list, timer keeps running
  function backToQuestions() {
    setPageState(TIPageState.START);
  }

  // Judge0 language IDs
  const JUDGE0_LANGUAGE_IDS: Record<SupportedLanguage, number> = {
    python: 71,
    cpp: 54,
  };

  function runCode() {
    const payload = {
      source_code: code,
      language_id: JUDGE0_LANGUAGE_IDS[language],
    };
    setOutput(JSON.stringify(payload, null, 2));
    setPassed(null);
  }

  // Returns a colored difficulty badge for a question
  function DifficultyBadge({ difficulty }: { difficulty: string }) {
    let badgeColor = "bg-gray-100 text-gray-600";

    if (difficulty === "Easy") {
      badgeColor = "bg-green-100 text-green-700";
    } else if (difficulty === "Medium") {
      badgeColor = "bg-yellow-100 text-yellow-700";
    } else if (difficulty === "Hard") {
      badgeColor = "bg-red-100 text-red-600";
    }

    return (
      <span className={"text-xs px-2 py-1 rounded-full font-medium ml-2 " + badgeColor}>
        {difficulty}
      </span>
    );
  }

  // Small badge that shows the current session status in the header
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

          {/* Show a banner when the session is paused */}
          {session.status === "paused" && (
            <div className="max-w-4xl mx-auto mt-4 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded text-sm text-center">
              Timer paused — your session will resume when you return to this tab.
            </div>
          )}

          {/* Question title and difficulty */}
          <div className="max-w-4xl mx-auto border rounded p-4 mt-6">
            <div className="flex items-center mb-2">
              <h2 className="font-semibold text-lg">
                {questions[currentQuestionIndex]?.title}
              </h2>
              <DifficultyBadge difficulty={questions[currentQuestionIndex]?.difficulty ?? ""} />
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {questions[currentQuestionIndex]?.description}
            </p>
          </div>

          {/* Code editor and output panel */}
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
                {passed === true && (
                  <p className="text-green-600">Case Test Passed ✅</p>
                )}
                {passed === false && (
                  <p className="text-red-600">Case Test Failed ❌</p>
                )}
              </div>
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
              {questionStatus.map((done, idx) => (
                <li key={idx}>
                  {questions[idx]?.title ?? "Question #" + (idx + 1)}:{" "}
                  {done === true ? (
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
