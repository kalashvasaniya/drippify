"use client"
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

function PasswordInner() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get("from") || "/";

  useEffect(() => {
    setError("");
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace(from);
      } else {
        const data = await res.json().catch(() => ({ message: "Invalid password" }));
        setError(data.message || "Invalid password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Enter Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-600"
              placeholder="••••••••"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg py-2 font-semibold"
          >
            {loading ? "Verifying..." : "Unlock"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function PasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black text-white flex items-center justify-center p-4">Loading...</main>}>
      <PasswordInner />
    </Suspense>
  );
}


