"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Unhandled root error", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
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
              <p className="eyebrow">Critical error</p>
              <h1
                style={{
                  fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  marginBottom: "1rem",
                }}
              >
                The app could not render.
              </h1>
              <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
                This is the global fallback for root-level failures. The error is
                logged to the console so it does not fail silently.
              </p>
              <button className="button-primary" onClick={reset} type="button">
                Try again
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

