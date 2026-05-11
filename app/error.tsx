"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Unhandled application error", error);
  }, [error]);

  return (
    <main className="section">
      <div className="shell">
        <div
          className="surface-card"
          style={{
            padding: "2rem",
            maxWidth: "42rem",
            margin: "4rem auto",
          }}
        >
          <p className="eyebrow">Something went wrong</p>
          <h1
            style={{
              fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
              fontSize: "clamp(2rem, 5vw, 3rem)",
              marginBottom: "1rem",
            }}
          >
            The page hit an unexpected error.
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
            We are showing the failure on purpose instead of letting the app fail
            silently. You can retry, or check the console for the logged error
            details.
          </p>
          <button className="button-primary" onClick={reset} type="button">
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
