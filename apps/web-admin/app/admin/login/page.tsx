"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    toast.info("Login API is not connected yet.");

    setIsLoading(false);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0F172A] px-4 py-10">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#311042]" />

      {/* Decorative glow */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#8B5CF6]/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#6366F1]/20 blur-3xl" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-violet-400/20 bg-[#1E1B4B]/70 p-8 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] shadow-lg shadow-violet-500/20">
            <span className="text-xl font-bold text-white">TM</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-[#CBD5E1]">
            Sign in to manage Tow Me Now.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]"
            >
              Email
            </label>

            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]"
            >
              Password
            </label>

            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-lg shadow-violet-500/20 hover:from-[#7C3AED] hover:to-[#4F46E5]"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Continue"}
          </Button>
        </form>
      </div>
    </main>
  );
}
