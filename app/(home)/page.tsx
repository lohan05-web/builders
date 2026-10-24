import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import BeforeAfter from "@/components/BeforeAfter";
import Process from "@/components/Process";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import CostEstimator from "@/components/CostEstimator";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import {
  projects as localProjects,
  beforeAfter as localBeforeAfter,
} from "@/data/projects";
import { services as localServices } from "@/data/services";
import { testimonials as localTestimonials } from "@/data/testimonials";
import { faqs as localFaqs } from "@/data/faqs";

export const revalidate = 60;

export default function HomePage() {
  const services = localServices;
  const projects = localProjects;
  const beforeAfter = localBeforeAfter;
  const testimonials = localTestimonials;
  const faqs = localFaqs;

  return (
    <>
      <Hero />
      <Services services={services} />
      <Projects projects={projects} />
      <BeforeAfter beforeAfter={beforeAfter} />
      <About />
      <Process />
      <Testimonials testimonials={testimonials} />
      <CostEstimator />
      <FAQ faqs={faqs} />
      <Contact />
    </>
  );
}
