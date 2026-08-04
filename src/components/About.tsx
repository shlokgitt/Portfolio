"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const skills = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "Firebase",
  "C++ / DSA",
  "Git & GitHub",
];

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const elements = containerRef.current?.querySelectorAll("p, span.tech-pill");
    if (!elements) return;

    gsap.fromTo(
      elements,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section className="content-section" id="about">
      <div className="content-inner content-inner-narrow" ref={containerRef}>
        <p className="section-label">About</p>
        <h2 className="section-heading">
          A bit about <span className="serif-line">me</span>
        </h2>

        <div className="about-body">
          <p>
            I&rsquo;m Shlok, a second-year B.Tech CSE student at ABES
            Engineering College, Ghaziabad. I work mainly across the
            JavaScript stack — React and Node.js on the frontend and backend
            — and spend a good chunk of my time outside coursework on
            open-source contributions and hackathons.
          </p>
          <p>
            I built <strong>Route Resilience</strong>, a real-time routing
            and pathfinding platform running graph algorithms like Dijkstra,
            A*, and Tarjan&rsquo;s bridge-finding over real OpenStreetMap
            data. Alongside that, I&rsquo;ve contributed bug fixes to several
            open-source projects (go-eazy, interview-iq, and rydex) as part
            of the Enginow Open Source Hackathon, hosted on Unstop.
          </p>
          <p>
            I&rsquo;m still early in this — learning as I build, and more
            interested in understanding why something works than just
            getting it to work.
          </p>
        </div>

        <div className="skills-row">
          {skills.map((s) => (
            <span className="tech-pill" key={s}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

