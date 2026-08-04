"use client";

export function GradientScrims() {
  return (
    <>
      {/* Left scrim */}
      <div
        className="scrim-left"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 5,
        }}
        aria-hidden="true"
      />
      {/* Right scrim */}
      <div
        className="scrim-right"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 5,
        }}
        aria-hidden="true"
      />
      {/* Top scrim */}
      <div
        className="scrim-top"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "35%",
          pointerEvents: "none",
          zIndex: 5,
        }}
        aria-hidden="true"
      />
      {/* Bottom scrim */}
      <div
        className="scrim-bottom"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          pointerEvents: "none",
          zIndex: 5,
        }}
        aria-hidden="true"
      />
    </>
  );
}
