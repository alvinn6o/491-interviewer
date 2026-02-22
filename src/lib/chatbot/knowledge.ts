export const APP_KNOWLEDGE = {
  appName: "SkillSift",
  about:[
    "SkillSift helps users practice interviews (behavioral + technical), analyze resumes, and track interview sessions and feedback.",
    "Features include: account settings (dark mode, language, timezone), interview practice sessions, session history, and resume analysis reports.",
    "Users sign in and manage their profile and preferences under the Account area.",
    ].join("\n"),

  helpTopics: {
    darkMode: {
      title: "Change dark mode",
      steps: [
        "Go to Account Settings.",
        "Use the Dark Mode toggle to turn it on or off.",
        "Your choice is saved automatically.",
      ],
    },
    language: {
      title: "Change preferred coding language",
      steps: [
        "Go to Account Settings.",
        "Select your preferred language.",
        "Click Save Settings.",
      ],
    },
    timezone: {
      title: "Update time zone",
      steps: [
        "Go to Account Settings.",
        "Edit the Time Zone field.",
        "Click Save Settings.",
      ],
    },
    sessionHistory: {
      title: "View session history",
      steps: [
        "Open Session History from the Account sidebar.",
        "You will see past interview sessions with dates and scores (if available).",
      ],
    },
  },

  rules: [
    "When asked where something is, respond with the route path from APP_ROUTES.",
    "If asked how to do something, return steps from helpTopics when available.",
    "If the question is unclear, ask what page or feature they mean.",
    "Do not invent pages or links not present in APP_ROUTES.",
  ],
} as const;
