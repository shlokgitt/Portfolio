import { Navigation } from "@/components/Navigation";
import HeroSequenceLoader from "@/components/HeroSequence";
import { Work } from "@/components/Work";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main>
      {/* Navigation */}
      <Navigation />

      {/* Hero — 600vh pinned scroll-driven animation */}
      <HeroSequenceLoader />

      {/* Work */}
      <Work />

      {/* About */}
      <About />

      {/* Contact / Footer */}
      <Contact />
    </main>
  );
}
