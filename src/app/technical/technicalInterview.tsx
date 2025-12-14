"use client";

import { useEffect, useState } from "react";

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
  
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [passed, setPassed] = useState<boolean | null>(null);

  const [questionStatus, setQuestionStatus] = useState<boolean[]>(
    questions.map(() => false) // false = incomplete
  );

/* 60-minute timer */
  const [timeLeft, setTimeLeft] = useState(60 * 60);

/* Timer */
  useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft((t) => {
      if (t <= 1) {
        clearInterval(interval);
        setPageState(TIPageState.END);
        return 0;
      }
      return t - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);

  /* Helpers */
  function startInterview(index: number) {
    setCurrentQuestionIndex(index);
    setPageState(TIPageState.ACTIVE);
  }

    function runCode() {
    // Fake execution
    setOutput("This is a temporary output!");
    const didPass = code.includes("+"); // Code contains "+" = pass
    setPassed(didPass);

    if (didPass) {
        setQuestionStatus((prev) => {
        const updated = [...prev];
        updated[currentQuestionIndex] = true; // mark complete
        return updated;
        });
    }
}

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

/* Views */
  switch (pageState) {
    case TIPageState.START:
      return (
        <main className="min-h-screen px-6 py-10">
          
          <div className="flex justify-between max-w-4xl mx-auto items-center">
            <div>
                <h1 className="text-3xl font-bold">
                    Technical Interview
                </h1>
                <p className="text-gray-500 mt-1">
                    Time limit of 60 minutes to complete both questions
                </p>
            </div>
            <span className="font-semibold">
            Time Remaining: {formatTime(timeLeft)}
            </span>
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
                {questionStatus[index] ? (
                    <span className="text-green-600 ml-2">
                    (Complete)
                    </span>
                ) : (
                    <span className="text-gray-400 ml-2">
                    (Incomplete)
                    </span>
                )}
                </span>

                <button
                onClick={() => startInterview(index)}
                className="bg-orange-500 text-white px-4 py-1 rounded"
                >
                Start
                </button>
              </div>
            ))}
          </div>
        </main>
      );

    case TIPageState.ACTIVE:
      return (
        <main className="min-h-screen px-6 py-10">

          {/* Header with Back button + Timer */}
        <div className="flex justify-between max-w-4xl mx-auto items-center">
            <button
            onClick={() => setPageState(TIPageState.START)}
            className="text-sm text-blue-600 underline"
            >
            ← Back to questions
            </button>

            <span className="font-semibold">
              Time Remaining: {formatTime(timeLeft)}
            </span>
          </div>
        <div className="max-w-4xl mx-auto mt-2">
            <button
            onClick={() => setPageState(TIPageState.END)}
            disabled={!questionStatus.some(Boolean)}
            className={`text-sm underline ${
                questionStatus.some(Boolean)
                ? "text-red-600"
                : "text-gray-400 cursor-not-allowed"
            }`}
            >
            Finish Test Early
            </button>
        </div>

          {/* Question */}
          <div className="max-w-4xl mx-auto border rounded p-4 mt-6">
            <p className="text-sm text-gray-700">
              {questions[currentQuestionIndex].prompt}
            </p>
          </div>

          {/* Code + Output */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6 mt-6">
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2">Input</h3>
              <textarea
                className="w-full h-48 border rounded p-2 font-mono text-sm"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
              />
              <button
                onClick={runCode}
                className="mt-3 bg-orange-500 text-white px-4 py-1 rounded"
              >
                Run Code
              </button>
            </div>

            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2">Results</h3>
              <pre className="bg-gray-100 h-32 p-2 rounded text-sm">
                {output || "Output will appear here"}
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
