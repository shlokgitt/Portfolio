"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  MutableRefObject,
} from "react";
import { HeadlineCarousel } from "./HeadlineCarousel";
import { GradientScrims } from "./GradientScrims";

/* ───────────────────────────────────────────────────────
   Types
   ─────────────────────────────────────────────────────── */
interface HeroSequenceProps {
  frameCount: number;
}

/* ───────────────────────────────────────────────────────
   Cover-fit helper (object-fit: cover for canvas)
   ─────────────────────────────────────────────────────── */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const imgRatio = iw / ih;
  const canvasRatio = cw / ch;

  let sx: number, sy: number, sw: number, sh: number;

  if (imgRatio > canvasRatio) {
    // Image wider — crop sides
    sh = ih;
    sw = ih * canvasRatio;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    // Image taller — crop top/bottom
    sw = iw;
    sh = iw / canvasRatio;
    sx = 0;
    sy = (ih - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

/* ───────────────────────────────────────────────────────
   ScrollIndicator — fades out once user starts scrolling
   ─────────────────────────────────────────────────────── */
function ScrollIndicator({
  wrapperRef,
}: {
  wrapperRef: MutableRefObject<HTMLDivElement | null>;
}) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let rafId: number;
    const update = () => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        const wrapperHeight = wrapper.offsetHeight;
        const viewportH = window.innerHeight;
        const scrolled = -rect.top;
        const scrollableDistance = wrapperHeight - viewportH;
        const progress =
          scrollableDistance > 0
            ? Math.max(0, Math.min(1, scrolled / scrollableDistance))
            : 0;
        // Fade out over the first 8% of scroll progress
        setOpacity(Math.max(0, 1 - progress / 0.08));
      }
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [wrapperRef]);

  if (opacity === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "2.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        zIndex: 20,
        opacity,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <span
        style={{
          fontSize: "0.6875rem",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(243,239,232,0.55)",
        }}
      >
        Scroll
      </span>
      {/* Animated chevron */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: "scrollBounce 1.6s ease-in-out infinite" }}
      >
        <path
          d="M4 7l6 6 6-6"
          stroke="rgba(220,160,116,0.85)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ───────────────────────────────────────────────────────
   HeroSequence Component
   ─────────────────────────────────────────────────────── */
export function HeroSequence({ frameCount }: HeroSequenceProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  /* Shared eased progress for headline sync */
  const easedProgressRef = useRef(0);

  /* State */
  const [canvasReady, setCanvasReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  /* Image array */
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef(0);

  /* Playhead smoothing */
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);

  /* Cursor tracking */
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const easedMouseRef = useRef({ x: 0.5, y: 0.5 });

  /* Intersection observer — pause when off-screen */
  const isVisibleRef = useRef(true);

  /* Animation loop ID */
  const rafIdRef = useRef<number>(0);

  /* ─── Detect mobile / reduced-motion ────────────── */
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const mqr = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsMobile(mql.matches);
    setReducedMotion(mqr.matches);

    const handleMobile = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const handleReduced = (e: MediaQueryListEvent) =>
      setReducedMotion(e.matches);
    mql.addEventListener("change", handleMobile);
    mqr.addEventListener("change", handleReduced);
    return () => {
      mql.removeEventListener("change", handleMobile);
      mqr.removeEventListener("change", handleReduced);
    };
  }, []);

  /* ─── Static fallback for mobile / reduced-motion ── */
  const shouldAnimate = !isMobile && !reducedMotion && frameCount > 1;

  /* ─── Resize canvas for high-DPI ────────────────── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  /* ─── Preload images ────────────────────────────── */
  useEffect(() => {
    if (!shouldAnimate) {
      /* Static mode — just load frame 1 */
      const img = new Image();
      img.src = "/hero/frames/frame_0001.jpg";
      img.onload = () => {
        imagesRef.current = [img];
        setCanvasReady(true);
        resizeCanvas();
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const rect = canvas.getBoundingClientRect();
            drawCover(ctx, img, rect.width, rect.height);
          }
        }
      };
      return;
    }

    const images: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = images;
    loadedCountRef.current = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const num = String(i + 1).padStart(4, "0");
      img.src = `/hero/frames/frame_${num}.jpg`;
      img.onload = () => {
        loadedCountRef.current++;

        /* Show first frame immediately — no black flash */
        if (i === 0) {
          setCanvasReady(true);
          resizeCanvas();
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              const rect = canvas.getBoundingClientRect();
              drawCover(ctx, img, rect.width, rect.height);
            }
          }
        }
      };
      images[i] = img;
    }
  }, [frameCount, shouldAnimate, resizeCanvas]);

  /* ─── Window resize ─────────────────────────────── */
  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
      /* Redraw current frame after resize */
      const canvas = canvasRef.current;
      const images = imagesRef.current;
      if (canvas && images.length > 0) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const rect = canvas.getBoundingClientRect();
          const idx = Math.min(
            Math.floor(currentFrameRef.current),
            images.length - 1
          );
          const img = images[idx];
          if (img && img.complete) drawCover(ctx, img, rect.width, rect.height);
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas]);

  /* ─── Intersection Observer ─────────────────────── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  /* ─── Cursor tracking (pre-scroll 3D tilt) ──────── */
  useEffect(() => {
    if (!shouldAnimate) return;

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [shouldAnimate]);

  /* ─── Main animation loop ───────────────────────── */
  useEffect(() => {
    if (!shouldAnimate || !canvasReady) return;

    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !sticky || !wrapper) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const loop = () => {
      rafIdRef.current = requestAnimationFrame(loop);

      /* Skip rendering when off-screen */
      if (!isVisibleRef.current) return;

      /* ── Calculate raw scroll progress ─────────── */
      const rect = wrapper.getBoundingClientRect();
      const wrapperHeight = wrapper.offsetHeight;
      const viewportH = window.innerHeight;
      const scrolled = -rect.top;
      const scrollableDistance = wrapperHeight - viewportH;
      const rawProgress = Math.max(
        0,
        Math.min(1, scrolled / scrollableDistance)
      );

      /* ── Map to floating-point frame position ──── */
      const maxFrame = frameCount - 1;
      targetFrameRef.current = rawProgress * maxFrame;

      /* ── Smooth playhead ───────────────────────── */
      const target = targetFrameRef.current;
      let current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.001) {
        current = target;
      } else {
        current += diff * 0.1;
      }
      currentFrameRef.current = current;

      /* ── Store eased progress for headline sync ── */
      easedProgressRef.current = Math.max(
        0,
        Math.min(1, current / maxFrame)
      );

      /* ── Cross-blend rendering ─────────────────── */
      const images = imagesRef.current;
      const floorIdx = Math.max(0, Math.min(maxFrame, Math.floor(current)));
      const ceilIdx = Math.min(maxFrame, floorIdx + 1);
      const frac = current - floorIdx;

      const canvasRect = canvas.getBoundingClientRect();
      const cw = canvasRect.width;
      const ch = canvasRect.height;

      const floorImg = images[floorIdx];
      const ceilImg = images[ceilIdx];

      if (floorImg && floorImg.complete) {
        ctx.globalAlpha = 1;
        drawCover(ctx, floorImg, cw, ch);
      }

      if (
        ceilImg &&
        ceilImg.complete &&
        ceilIdx !== floorIdx &&
        frac > 0.001
      ) {
        ctx.globalAlpha = frac;
        drawCover(ctx, ceilImg, cw, ch);
        ctx.globalAlpha = 1;
      }

      /* ── 3D cursor tracking (pre-scroll) ───────── */
      if (sticky) {
        const progress = easedProgressRef.current;
        const tiltStrength = Math.max(0, 1 - progress * 15); // fades within first few frames

        if (tiltStrength > 0.001) {
          // Ease mouse coordinates
          easedMouseRef.current.x +=
            (mouseRef.current.x - easedMouseRef.current.x) * 0.06;
          easedMouseRef.current.y +=
            (mouseRef.current.y - easedMouseRef.current.y) * 0.06;

          const mx = (easedMouseRef.current.x - 0.5) * 2; // -1 to 1
          const my = (easedMouseRef.current.y - 0.5) * 2; // -1 to 1

          const rotateX = my * -8 * tiltStrength;
          const rotateY = mx * 8 * tiltStrength;
          const translateX = mx * 12 * tiltStrength;
          const translateY = my * 8 * tiltStrength;
          const scale = 1 + 0.02 * tiltStrength;

          canvas.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px) scale(${scale})`;
        } else {
          canvas.style.transform = "";
        }
      }
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [shouldAnimate, canvasReady, frameCount]);

  /* ─── Render ────────────────────────────────────── */
  return (
    <section ref={wrapperRef} className="hero-wrapper" id="hero">
      <div ref={stickyRef} className="hero-sticky">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="hero-canvas"
          style={{
            opacity: canvasReady ? 1 : 0,
            transition: "opacity 600ms ease",
          }}
        />

        {/* Gradient scrims */}
        <GradientScrims />

        {/* Headlines */}
        <HeadlineCarousel easedProgressRef={easedProgressRef} />

        {/* Scroll indicator */}
        <ScrollIndicator wrapperRef={wrapperRef} />

        {/* Static fallback image for mobile/reduced-motion */}
        {!shouldAnimate && (
          <img
            src="/hero/frames/frame_0001.jpg"
            alt="Hero"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: -1,
            }}
          />
        )}
      </div>
    </section>
  );
}

/* ─── Wrapper that fetches frame count ────────────── */
export default function HeroSequenceLoader() {
  const [frameCount, setFrameCount] = useState<number>(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/frames")
      .then((res) => res.json())
      .then((data) => setFrameCount(data.count))
      .catch(() => setError(true));
  }, []);

  if (error) return null;
  if (frameCount === 0) {
    /* Invisible placeholder to prevent layout shift */
    return (
      <section className="hero-wrapper">
        <div className="hero-sticky" style={{ background: "#000" }} />
      </section>
    );
  }

  return <HeroSequence frameCount={frameCount} />;
}
