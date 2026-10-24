"use client";

import {
  Armchair,
  Building2,
  ClipboardCheck,
  DraftingCompass,
  Home,
  PaintRoller,
  type LucideIcon,
} from "lucide-react";
import { services as fallbackServices, type Service, type ServiceIconName } from "@/data/services";

const serviceIcons: Record<ServiceIconName, LucideIcon> = {
  Home,
  Building2,
  PaintRoller,
  Armchair,
  DraftingCompass,
  ClipboardCheck,
};

interface ServicesProps {
  services?: Service[];
}

export default function Services({ services }: ServicesProps) {
  const items = services && services.length > 0 ? services : fallbackServices;

  return (
    <section id="services" className="relative w-full bg-navy py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange">
            Services
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            What We Do
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {items.map((service, index) => {
            const Icon = serviceIcons[service.icon] || Home;
            return (
              <li key={service.id} className="h-full">
                <article className="group relative flex h-full min-h-[16rem] flex-col overflow-hidden border border-white/10 bg-navy-light p-6 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-orange/70 hover:shadow-xl hover:shadow-black/20 sm:p-7">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-orange transition-transform duration-300 ease-smooth group-hover:scale-x-100"
                  />

                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-orange/60 text-orange transition-colors duration-300 group-hover:bg-orange group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-display text-lg font-bold tabular-nums text-white/35 transition-colors duration-300 group-hover:text-orange"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-6 min-h-[3.25rem] font-display text-xl font-bold leading-tight text-white">
                    {service.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[#D5DBE5] sm:text-base">
                    {service.description}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
