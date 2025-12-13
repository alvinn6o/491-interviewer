"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  // React state store user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle Login form submission
  async function handleLogin(event: React.FormEvent) {
    event.preventDefault(); // Prevent browser reload
    alert("Logging in!");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-sm bg-white p-8 rounded shadow"
      >
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
          required
        />

        {/* Login Button */}
        <button className="orange_button w-full" type="submit">
          Login
        </button>

        <p className="text-sm text-center mt-2">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 underline">
            Sign Up
          </Link>
        </p>
      </form>
    </main>
  );
}
