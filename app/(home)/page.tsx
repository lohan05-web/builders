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
import {
  getBeforeAfter,
  getFaqs,
  getProjects,
  getServices,
  getSiteSettings,
  getTeam,
  getTestimonials,
} from "@/sanity/lib/fetch";

/**
 * The home page is re-rendered in the background every 60 seconds, so a
 * change made in the Sanity Studio appears on the live site within a
 * minute.
 */
export const revalidate = 60;

export default async function HomePage() {
  // Everything is fetched on the server and handed to the client
  // components as props — the browser never talks to Sanity directly.
  const [site, services, projects, testimonials, faqs, team, beforeAfter] =
    await Promise.all([
      getSiteSettings(),
      getServices(),
      getProjects(),
      getTestimonials(),
      getFaqs(),
      getTeam(),
      getBeforeAfter(),
    ]);

  return (
    <>
      <Hero />
      <Stats stats={site.stats} />
      <Services services={services} />
      <Projects projects={projects} />
      <BeforeAfter beforeAfter={beforeAfter} />
      <Process />
      <CostEstimator />
      <Testimonials testimonials={testimonials} />
      <About team={team} />
      <FAQ faqs={faqs} />
      <FaqJsonLd faqs={faqs} />
      <Contact />
    </>
  );
}
