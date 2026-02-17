"use client";

import { useEffect, useState } from "react";
import CodeEditor, { getStarterCode, type SupportedLanguage } from "./_components/CodeEditor";

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

/* testing Fetch */
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
  const [isRunning, setIsRunning] = useState(false);

  // Reset code to starter when language changes
  function handleLanguageChange(newLang: SupportedLanguage) {
    setLanguage(newLang);
    setCode(getStarterCode(newLang));
  }

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

    async function runCode() {
      setIsRunning(true);
      setOutput("Executing code...");
      setPassed(null);

      const payload = {
        source_code: code,
        language: language, // Piston uses language name directly
      };

      try {
        const response = await fetch("/api/judge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          setOutput(`Error: ${result.error}`);
          setPassed(false);
          return;
        }

        // Format the output
        let outputText = "";
        outputText += `Status: ${result.status}\n`;
        outputText += `Time: ${result.time || "N/A"}s\n`;
        outputText += `Memory: ${result.memory || "N/A"} KB\n`;
        outputText += `─────────────────────\n`;

        if (result.compile_output) {
          outputText += `Compile Output:\n${result.compile_output}\n`;
        }
        if (result.stdout) {
          outputText += `stdout:\n${result.stdout}\n`;
        }
        if (result.stderr) {
          outputText += `stderr:\n${result.stderr}\n`;
        }
        if (!result.stdout && !result.stderr && !result.compile_output) {
          outputText += "(No output)";
        }

        setOutput(outputText);

        // Mock pass/fail based on execution status
        const isAccepted = result.status === "Accepted";
        setPassed(isAccepted);

      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : "Failed to execute"}`);
        setPassed(false);
      } finally {
        setIsRunning(false);
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
                disabled={isRunning}
                className={`mt-3 px-4 py-1 rounded text-white ${
                  isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isRunning ? "Running..." : "Run Code"}
              </button>
            </div>

            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2">Execution Output</h3>
              <pre className="bg-gray-100 h-64 p-2 rounded text-sm overflow-auto whitespace-pre-wrap">
                {output || "Click 'Run Code' to execute your code"}
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
