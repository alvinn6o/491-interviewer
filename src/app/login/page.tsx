// Justin Do
// 12/12/2025

"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // React state store user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle Login form submission
  async function handleLogin(event: React.FormEvent) {
    event.preventDefault(); // Prevent browser reload
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400">

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-sm bg-white p-8 rounded shadow"
      >

      {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <img
            src="/images/landing/skill-skift-card.png"
            alt="SkillSift Card"
            className="h-16 w-auto mb-1"
          />
          <h1 className="text-2xl font-semibold">Login</h1>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
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
          required
        />

        {/* Login Button */}
        <button
          className="orange_button w-full disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Remeber me? */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              className="accent-orange-500"
            />
            Remember me?
          </label>

          <Link href="/forgot-password" title="Recover password" className="text-blue-600 hover:underline">
          Forgot password?
        </Link>
        </div>

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
