"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getToken, setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.replace("/profile");
    }
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError(
          res.status === 401
            ? "Invalid username or password."
            : "Something went wrong. Please try again."
        );
        return;
      }

      const data = await res.json();
      setToken(data.token);
      router.push("/profile");
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page-center">
      <div className="card">
        <div className="brand-mark" aria-hidden="true">C</div>
        <h1>Sign In</h1>
        <p className="subtitle">Welcome back. Enter your credentials to continue.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in\u2026" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
