"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign up failed.");
      } else {
        setSuccess("Account created! You can now log in.");
        // optional: redirect after success
        // router.push("/login");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

      {/* Signup Form */}
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-4 w-full max-w-sm bg-white p-8 rounded shadow"
      >
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
            {success}
          </p>
        )}

        {/* Email Input */}
        <input
          className="border rounded p-3 w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input */}
        <input
          className="border rounded p-3 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={1}
          required
        />

        {/* Signup Button */}
        <button
          className="orange_button w-full disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
