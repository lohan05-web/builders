import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Ruler,
  Timer,
  Wallet,
} from "lucide-react";
import { getAdjacentProjects, getProjectBySlug, getProjects } from "@/sanity/lib/fetch";
import { SITE_URL } from "@/data/site";
import ProjectGallery from "@/components/ProjectGallery";

interface ProjectPageProps {
  params: { slug: string };
}

/**
 * Every known project page is pre-rendered at build time and then
 * refreshed in the background every 60 seconds.
 */
export const revalidate = 60;

/**
 * New slugs are rendered on demand, so a project added in the Sanity
 * Studio goes live without a redeploy. Unknown slugs still return a real
 * HTTP 404 (the branded `app/not-found.tsx` page is rendered).
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const allProjects = await getProjects();

  return allProjects.map((project) => ({ slug: project.slug }));
}

/** Per-project title, description and Open Graph image. */
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  // An unknown slug is a 404. Throwing from `generateMetadata` (outside the
  // page component) lets Next.js answer with a real HTTP 404 status and
  // render the branded `app/not-found.tsx` page on its own.
  if (!project) {
    notFound();
  }

  const description = project.description.split("\n")[0];

  return {
    title: project.title,
    description,
    alternates: {
      canonical: `${SITE_URL}/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} | LM Builders`,
      description,
      url: `${SITE_URL}/projects/${project.slug}`,
      images: [{ url: project.image, width: 2000, height: 1333 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | LM Builders`,
      description,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  // Branded 404 for unknown slugs.
  if (!project) {
    notFound();
  }

  const { prev, next } = await getAdjacentProjects(project.slug);

  const details = [
    { icon: MapPin, label: "Location", value: project.location },
    { icon: Ruler, label: "Area", value: `${project.area.toLocaleString("en-IN")} sq.ft` },
    { icon: CalendarDays, label: "Year", value: String(project.year) },
    { icon: Timer, label: "Duration", value: project.duration },
    { icon: Wallet, label: "Budget", value: project.budgetRange },
  ];

  return (
    <>
      {/* ===================== Hero ===================== */}
      <section id="home" className="relative w-full overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={project.image}
            alt={project.imageAlt || project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Dark gradient so the copy stays readable. */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/60" />
        </div>

        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:px-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-white/45 sm:text-sm">
              <li>
                <Link href="/" className="transition-colors duration-300 hover:text-gold">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="text-white/25">/</span>
              </li>
              <li>
                <Link href="/#projects" className="transition-colors duration-300 hover:text-gold">
                  Projects
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="text-white/25">/</span>
              </li>
              <li className="text-gold" aria-current="page">
                {project.title}
              </li>
            </ol>
          </nav>

          {/* Title block */}
          <div className="mt-8 max-w-3xl">
            <span className="inline-block rounded-sm border border-gold/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
              {project.category}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {project.title}
            </h1>
            <p className="mt-5 flex items-center gap-2 text-sm text-white/60 sm:text-base">
              <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
              {project.location}
            </p>
          </div>
        </div>
      </section>

      {/* ===================== Details bar ===================== */}
      <section className="border-y border-white/10 bg-charcoal-900">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/5 sm:grid-cols-3 lg:grid-cols-5">
          {details.map((item) => (
            <div key={item.label} className="bg-charcoal-900 px-5 py-7 sm:px-7">
              <dt className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                <item.icon className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                {item.label}
              </dt>
              <dd className="mt-2 font-display text-base text-white sm:text-lg">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ===================== Description ===================== */}
      <section className="w-full bg-charcoal py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Copy */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                About This Project
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-white/60">
                {project.description.split("\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Materials + features */}
            <div className="space-y-10">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
                  Materials
                </h3>
                <span aria-hidden="true" className="mt-3 block h-px w-10 bg-gold" />
                <ul className="mt-5 space-y-3">
                  {project.materials.map((material) => (
                    <li key={material} className="flex items-start gap-3 text-sm text-white/60">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold"
                      />
                      {material}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
                  Features
                </h3>
                <span aria-hidden="true" className="mt-3 block h-px w-10 bg-gold" />
                <ul className="mt-5 space-y-3">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-white/60">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Gallery ===================== */}
      <section className="w-full bg-charcoal-900 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Gallery
          </h2>
          <ProjectGallery images={project.gallery} title={project.title} />
        </div>
      </section>

      {/* ===================== CTA + next/prev ===================== */}
      <section className="w-full bg-charcoal py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* Gold CTA */}
          <div className="flex flex-col items-start justify-between gap-8 rounded-sm border border-gold/30 bg-charcoal-800 p-8 sm:flex-row sm:items-center sm:p-12">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Like What You See?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
                Tell us about your project and we will prepare a detailed,
                no-obligation quote within 48 hours.
              </p>
            </div>
            <Link
              href="/#contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-gold px-8 py-4 text-sm font-semibold tracking-wide text-charcoal transition-all duration-300 ease-smooth hover:bg-gold-light hover:shadow-xl hover:shadow-gold/25"
            >
              Get a Quote for a Similar Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Prev / next project navigation */}
          <nav
            aria-label="Project navigation"
            className="mt-10 grid gap-4 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group flex items-center gap-4 rounded-sm border border-white/10 px-6 py-5 transition-colors duration-300 hover:border-gold/50"
              >
                <ArrowLeft
                  className="h-5 w-5 shrink-0 text-gold transition-transform duration-300 ease-smooth group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-widest text-white/40">
                    Previous Project
                  </span>
                  <span className="mt-1 block font-display text-base text-white transition-colors duration-300 group-hover:text-gold sm:text-lg">
                    {prev.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}

            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group flex items-center justify-end gap-4 rounded-sm border border-white/10 px-6 py-5 text-right transition-colors duration-300 hover:border-gold/50 sm:col-start-2"
              >
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-widest text-white/40">
                    Next Project
                  </span>
                  <span className="mt-1 block font-display text-base text-white transition-colors duration-300 group-hover:text-gold sm:text-lg">
                    {next.title}
                  </span>
                </span>
                <ArrowRight
                  className="h-5 w-5 shrink-0 text-gold transition-transform duration-300 ease-smooth group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
          </nav>
        </div>
      </section>
    </>
  );
}
