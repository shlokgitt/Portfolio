"use client";

import { useEffect, useRef, MutableRefObject } from "react";

/* ── Headline data ──────────────────────────────────── */
const HEADLINES = [
  { lines: ["Form Dissolves Into", "Pure Emotion"] },
  { lines: ["Every Surface Catches", "The Light"] },
  { lines: ["Nothing Remains", "But Beauty"] },
];

interface Props {
  easedProgressRef: MutableRefObject<number>;
}

/* ── 3D Cylinder Carousel ──────────────────────────── */
export function HeadlineCarousel({ easedProgressRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const facesRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const FACE_COUNT = HEADLINES.length;
    const ANGLE_PER_FACE = 360 / FACE_COUNT; // 120°
    const RADIUS = 120; // px — cylinder radius

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      const progress = easedProgressRef.current; // 0 → 1
      /* Map progress to rotation: full scroll = cycle through all beats */
      const totalRotation = progress * ANGLE_PER_FACE * (FACE_COUNT - 1);

      facesRef.current.forEach((face, i) => {
        if (!face) return;

        const faceAngle = i * ANGLE_PER_FACE - totalRotation;
        const radians = (faceAngle * Math.PI) / 180;

        const ty = Math.sin(radians) * RADIUS;
        const tz = Math.cos(radians) * RADIUS - RADIUS;
        const rotX = -faceAngle;

        /* Visibility: only show faces roughly facing the viewer */
        const normalizedAngle =
          ((faceAngle % 360) + 360) % 360;
        const isFacing =
          normalizedAngle < 90 || normalizedAngle > 270;
        const opacity = isFacing
          ? Math.max(0, 1 - Math.abs(Math.sin(radians)) * 0.7)
          : 0;

        face.style.transform = `translateY(${ty}px) translateZ(${tz}px) rotateX(${rotX}deg)`;
        face.style.opacity = String(opacity);
      });
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [easedProgressRef]);

  return (
    <div ref={containerRef} className="headline-container">
      <div className="headline-cylinder">
        {HEADLINES.map((headline, i) => (
          <div
            key={i}
            ref={(el) => {
              facesRef.current[i] = el;
            }}
            className="headline-face headline-beat"
            style={{ position: i === 0 ? "relative" : "absolute" }}
          >
            {headline.lines.map((line, j) => (
              <div
                key={j}
                className={
                  j === headline.lines.length - 1 ? "serif-line" : ""
                }
              >
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
