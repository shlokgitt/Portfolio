"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  github: string;
  live?: string;
  image?: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "Route Resilience",
    tagline: "Real-time Pathfinding & Vulnerability Router",
    description:
      "A routing and pathfinding platform built on real OpenStreetMap data (7,731 nodes, 8,139 edges across Varanasi). Implements Dijkstra, A*, Tarjan's bridge-finding, and betweenness centrality to route around blocked or vulnerable roads in real time, with live weather overlays and a click-to-snap routing mode.",
    tech: [
      "React",
      "Vite",
      "Leaflet",
      "Node.js",
      "Express",
      "Open-Meteo API",
    ],
    github: "https://github.com/shlokgitt/route-resilience-frontend",
    live: "https://route-resilience-frontend-app.vercel.app/",
    image: "/projects/route-resilience.png",
  },
  {
    id: "02",
    title: "NotePulse",
    tagline: "Markdown Note-Taking & Synchronization Platform",
    description:
      "A rich markdown note-taking environment featuring real-time local auto-saving, robust categorization, full-text search, and offline-first capabilities. Leverages custom synchronization routines to securely backup and restore notes across devices.",
    tech: ["React", "Next.js", "Tailwind CSS", "MongoDB", "Node.js", "Express"],
    github: "https://github.com/shlokgitt/note-pulse",
  },
  {
    id: "03",
    title: "Travel Booking",
    tagline: "Cinematic Travel Itinerary Planner & Booking System",
    description:
      "An interactive travel platform for crafting visual itineraries, browsing curated destinations, and managing reservations. Integrated with mock secure payment gateways and location coordinates map visualization.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Leaflet"],
    github: "https://github.com/shlokgitt/web-project",
    live: "https://shlokgitt.github.io/web-project/",
    image: "/projects/travelgo.png",
  },
];

function IconArrowUpRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M17 7H7M17 7V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Staggered entry animation using GSAP ScrollTrigger
    const cards = cardsRef.current?.children;
    if (!cards) return;

    gsap.fromTo(
      cards,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section className="content-section" id="work" ref={sectionRef}>
      <div className="content-inner">
        <p className="section-label">Selected Works</p>
        <h2 className="section-heading">
          Things I&rsquo;ve <span className="serif-line">built</span>
        </h2>

        <div className="project-grid" ref={cardsRef}>
          {projects.map((project, idx) => (
            <article
              className="project-row"
              key={project.title}
              onMouseMove={handleMouseMove}
            >
              {/* Project Image Panel */}
              <div className="project-image-panel">
                <div className="mock-browser glass">
                  <div className="mock-browser-header">
                    <span className="mock-dot"></span>
                    <span className="mock-dot"></span>
                    <span className="mock-dot"></span>
                  </div>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="project-screenshot"
                    />
                  ) : (
                    <div className="project-placeholder-cover">
                      <span className="placeholder-logo-text">NP</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Content Panel */}
              <div className="project-content-panel">
                <div className="project-index">{project.id}</div>
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-tagline">{project.tagline}</p>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="tech-pills">
                  {project.tech.map((t) => (
                    <span className="tech-pill" key={t}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="project-links">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    GitHub <IconArrowUpRight />
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link project-link-primary"
                    >
                      Live Demo <IconArrowUpRight />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

