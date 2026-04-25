"use client";

// Tutorial.tsx
// Guided tour using Driver.js — highlights navbar elements with popovers

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "skillsift-tutorial-seen";

export default function Tutorial() {
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const router = useRouter();

  // Load Driver.js CSS from CDN on mount
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Show welcome modal on first visit
  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setIsWelcomeOpen(true);
    }
  }, []);

  async function startTour() {
    setIsWelcomeOpen(false);
    localStorage.setItem(STORAGE_KEY, "true");

    // Navigate to home first so all nav elements are visible
    router.push("/");

    // Wait for navigation and DOM to settle
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Dynamically import Driver.js so it only loads client-side
    const { driver } = await import("driver.js");

    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: "rgba(0,0,0,0.5)",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      steps: [
        {
          element: "#nav-resume",
          popover: {
            title: "Resume Scanner",
            description:
              "Upload your resume here to get an ATS score and detailed feedback. Companies use automated systems to filter resumes — this tool helps you make sure yours gets through.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#nav-behavioral",
          popover: {
            title: "Behavioral Interview",
            description:
              "Practice your soft skills with an AI-powered behavioral interview. Your responses are evaluated for clarity, tone, and professionalism in real time.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#nav-technical",
          popover: {
            title: "Technical Interview",
            description:
              "Sharpen your coding skills with real LeetCode-style problems. You get two questions of different difficulty levels and 60 minutes to solve them. The timer pauses if you leave the tab.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#nav-jobs",
          popover: {
            title: "Job Tracker",
            description:
              "Keep track of all the jobs you have applied to. Log application statuses, interview dates, and notes all in one place.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#nav-history",
          popover: {
            title: "History",
            description:
              "View all your past interview sessions and resume analyses. Resume sessions you left mid-way, check your submitted code, and track your progress over time.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#nav-account",
          popover: {
            title: "Account",
            description:
              "Access your account settings and log out from here.",
            side: "bottom",
            align: "end",
          },
        },
      ],
    });

    driverObj.drive();
  }

  function skipTutorial() {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsWelcomeOpen(false);
  }

  function openTour() {
    startTour().catch(console.error);
  }

  return (
    <>
      {/* Take the Tour button — always visible on home page */}
      <button
        onClick={openTour}
        className="inline-block rounded-full border border-orange-500 px-6 py-2 text-sm text-orange-500 hover:bg-orange-50 transition-colors"
      >
        Take the Tour
      </button>

      {/* First visit welcome modal */}
      {isWelcomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold">Welcome to SkillSift!</h2>
              <p className="mb-8 text-sm text-gray-600">
                SkillSift helps you prepare for job interviews with AI-powered
                tools. Would you like a quick tour of what you can do here?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => void startTour()}
                  className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
                >
                  Yes, show me around
                </button>
                <button
                  onClick={skipTutorial}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  No thanks, I will explore on my own
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
