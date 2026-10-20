"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fraunces, Hanken_Grotesk } from "next/font/google";

const display = Fraunces({ subsets: ["latin"], weight: ["500", "700"] });
const body = Hanken_Grotesk({ subsets: ["latin"] });

const CHURCH_NAME = "Witness for Christ International PH";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A93B]";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TEMPORARY: fake login that always succeeds after a short delay.
      // Replace this block with your real authentication call later, e.g.
      // const res = await fetch("/api/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // if (!res.ok) throw new Error("Invalid email or password.");
      await new Promise((r) => setTimeout(r, 800));

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <main
      className={`${body.className} flex min-h-screen items-center justify-center bg-[#3996e3] px-5 py-12`}
    >
      <div className="w-full max-w-md rounded-lg bg-white/80 p-8 text-[#1B2723] shadow-xl">
        <div className="flex items-center gap-3">
          <Image
            src="/images/church_logo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-auto shrink-0"
          />
          <span className={`${display.className} text-lg font-bold`}>
            {CHURCH_NAME}
          </span>
        </div>

        <h1 className={`${display.className} mt-8 text-3xl font-bold`}>
          Sign in
        </h1>
        <p className="mt-2 text-[#1B2723]/70">
          For church staff and leaders only.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="block font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-2 w-full rounded-md border-2 border-[#3996e3]/20 bg-white px-4 py-3 ${focus}`}
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold">
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-md border-2 border-[#3996e3]/20 bg-white py-3 pl-4 pr-20 ${focus}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
                className={`absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-sm font-semibold text-[#255f8f] ${focus}`}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md bg-[#F2A93B] px-6 py-3 font-semibold text-[#12372F] hover:bg-[#F2C879] disabled:opacity-60 ${focus}`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <Link
          href="/"
          className={`mt-6 inline-block text-sm underline underline-offset-4 ${focus}`}
        >
          Back to website
        </Link>
      </div>
    </main>
  );
}
