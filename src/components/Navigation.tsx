"use client";

import { useEffect, useRef, useState } from "react";

export function Navigation() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* Subtle entrance — fade in after mount */
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: "1.25rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
      id="main-nav"
    >
      <div
        className="nav-pill"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          padding: "0.625rem 1rem 0.625rem 1.5rem",
        }}
      >
        {/* Brand Wordmark */}
        <a
          href="#"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.125rem",
            fontStyle: "italic",
            color: "var(--color-text)",
            textDecoration: "none",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
          id="brand-link"
        >
          Portfolio
        </a>

        {/* Nav Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <a href="#work" className="nav-link" id="nav-work">
            Work
          </a>
          <a href="#about" className="nav-link" id="nav-about">
            About
          </a>
          <a href="#contact" className="nav-link" id="nav-contact">
            Contact
          </a>
        </div>

        {/* CTA */}
        <a href="#" className="cta-button" id="nav-cta">
          Experience
        </a>
      </div>
    </nav>
  );
}
