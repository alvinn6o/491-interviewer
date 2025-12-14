"use client";

async function postFeedback() {
  console.log("tried to POST feedback");

  try {
    const content = {
      text: "test content",
    };

    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    console.log("POST successful");
  } catch (err) {
    console.error(err);
  }
}

async function deleteFeedback() {
  console.log("tried to DELETE feedback");

  try {
    await fetch("/api/feedback", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    console.log("DELETE successful");
  } catch (err) {
    console.error(err);
  }
}

export default function SettingsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6">Settings</h1>

      <p className="text-sm text-gray-600 mb-6 text-center">
        Customize your account preferences and defaults.
      </p>

      {/* Settings */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Default Language
          </label>
          <select className="border border-gray-300 rounded-md p-2 text-sm w-full">
            <option>JavaScript</option>
            <option>TypeScript</option>
            <option>Python</option>
            <option>Java</option>
            <option>C#</option>
            <option>C++</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Time Zone
          </label>
          <input
            type="text"
            placeholder="e.g. PST, EST"
            className="border border-gray-300 rounded-md p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button className="px-6 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500">
            Save Settings
          </button>
          <button
            type="button"
            className="px-6 py-2 text-sm text-gray-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Feedback actions */}
      <div className="mt-8 flex justify-center gap-4">
        <button className="orange_button" onClick={postFeedback}>
          Post Feedback
        </button>
        <button className="orange_button" onClick={deleteFeedback}>
          Delete Feedback
        </button>
      </div>
    </>
  );
}
