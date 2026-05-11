export default function Loading() {
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
          <p className="eyebrow">Loading</p>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Preparing the page...
          </p>
        </div>
      </div>
    </main>
  );
}
