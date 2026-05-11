import Link from "next/link";

export default function NotFound() {
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
          <p className="eyebrow">404</p>
          <h1
            style={{
              fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
              fontSize: "clamp(2rem, 5vw, 3rem)",
              marginBottom: "1rem",
            }}
          >
            This page does not exist.
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
            The route was not found. Use the homepage to continue.
          </p>
          <Link className="button-primary" href="/">
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
