"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function Home() {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  // RETRIEVE: Fetch all messages from Neon database
  const { data: messages, refetch } = api.demo.getMessages.useQuery();

  // SAVE: Insert new message into Neon database
  const saveMessage = api.demo.saveMessage.useMutation({
    onSuccess: () => {
      setAuthor("");
      setMessage("");
      refetch();
    },
  });

  // DELETE: Clear all messages
  const clearAll = api.demo.clearAll.useMutation({
    onSuccess: () => refetch(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (author.trim() && message.trim()) {
      saveMessage.mutate({ author, message });
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold">SkillSift - Database Demo</h1>
        <p className="mb-8 text-gray-400">
          Save and retrieve data from Neon PostgreSQL and Prisma
        </p>

        {/* SAVE FORM */}
        <form onSubmit={handleSubmit} className="mb-8 rounded bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-green-400">
            SAVE to Database
          </h2>
          <div className="mb-4">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full rounded bg-gray-700 px-4 py-2 text-white"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message"
              className="w-full rounded bg-gray-700 px-4 py-2 text-white"
            />
          </div>
          <button
            type="submit"
            disabled={saveMessage.isPending}
            className="rounded bg-green-600 px-6 py-2 font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {saveMessage.isPending ? "Saving..." : "Save to Database"}
          </button>
        </form>

        {/* RETRIEVE DISPLAY */}
        <div className="mb-8 rounded bg-gray-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-blue-400">
              RETRIEVE from Database
            </h2>
            <button
              onClick={() => clearAll.mutate()}
              className="rounded bg-red-600 px-4 py-1 text-sm hover:bg-red-700"
            >
              Clear All
            </button>
          </div>

          {messages?.length === 0 && (
            <p className="text-gray-400">No messages yet. Add one above!</p>
          )}

          <ul className="space-y-2">
            {messages?.map((msg) => (
              <li key={msg.id} className="rounded bg-gray-700 p-3">
                <span className="font-semibold text-purple-400">
                  {msg.author}:
                </span>{" "}
                {msg.message}
                <span className="ml-2 text-sm text-gray-500">
                  (ID: {msg.id}, {new Date(msg.createdAt).toLocaleString()})
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CODE EXPLANATION */}
        <div className="rounded bg-gray-800 p-6 text-sm">
          <h3 className="mb-2 font-semibold text-yellow-400">
            Code Flow (for demo):
          </h3>
          <p className="mb-1 text-gray-300">
            <strong className="text-green-400">SAVE:</strong> Form → tRPC
            mutation → Prisma db.demoMessage.create() → Neon PostgreSQL
          </p>
          <p className="text-gray-300">
            <strong className="text-blue-400">RETRIEVE:</strong> tRPC query →
            Prisma db.demoMessage.findMany() → Neon PostgreSQL → Display
          </p>
        </div>
      </div>
    </main>
  );
}
