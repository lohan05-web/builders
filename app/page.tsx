import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import BeforeAfter from "@/components/BeforeAfter";
import Process from "@/components/Process";
import CostEstimator from "@/components/CostEstimator";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import FaqJsonLd from "@/components/FaqJsonLd";
import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Projects />
      <BeforeAfter />
      <Process />
      <CostEstimator />
      <Testimonials />
      <About />
      <FAQ />
      <FaqJsonLd />
      <Contact />
    </>
  );
}
