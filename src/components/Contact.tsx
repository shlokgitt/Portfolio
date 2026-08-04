"use client";

const contacts = [
  {
    label: "Email",
    value: "shloksri003@gmail.com",
    href: "mailto:shloksri003@gmail.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 6.5C3 5.67157 3.67157 5 4.5 5H19.5C20.3284 5 21 5.67157 21 6.5V17.5C21 18.3284 20.3284 19 19.5 19H4.5C3.67157 19 3 18.3284 3 17.5V6.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M3.5 6.5L12 13L20.5 6.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "shlokgitt",
    href: "https://github.com/shlokgitt",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.53-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.2.67.8.56A10.51 10.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "shlok-srivastava",
    href: "https://www.linkedin.com/in/shlok-srivastava-549987409/?skipRedirect=true",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45Z" />
      </svg>
    ),
  },
];

export function Contact() {
  return (
    <footer className="footer-section content-section" id="contact">
      <div className="content-inner">
        <p className="section-label">Contact</p>
        <h2 className="section-heading">
          Let&rsquo;s <span className="serif-line">connect</span>
        </h2>

        <div className="contact-links">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.label === "Email" ? undefined : "_blank"}
              rel={c.label === "Email" ? undefined : "noopener noreferrer"}
              className="contact-pill glass"
            >
              <span className="contact-icon">{c.icon}</span>
              <span className="contact-text">
                <span className="contact-label">{c.label}</span>
                <span className="contact-value">{c.value}</span>
              </span>
            </a>
          ))}
        </div>

        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
            color: "var(--color-accent)",
            textAlign: "center",
            marginTop: "3.5rem",
          }}
        >
        </p>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--color-text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginTop: "1rem",
          }}
        >
          © {new Date().getFullYear()} · Crafted with obsessive detail
        </p>
      </div>
    </footer>
  );
}
