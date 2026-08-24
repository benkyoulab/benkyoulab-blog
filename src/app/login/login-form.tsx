"use client";

import { useActionState } from "react";

export default function LoginForm({
  action,
}: {
  action: (state: { error?: string }, fd: FormData) => Promise<{ error?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100"
          placeholder="admin@benkyoulab.online"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100"
          placeholder="••••••••"
        />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-red-600 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
      >
        {pending ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
