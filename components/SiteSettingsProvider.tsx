"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteSettings } from "@/sanity/lib/types";

/**
 * The context that carries the company details to the client components.
 *
 * The root layout is a Server Component, so it reads the settings from
 * Sanity (or from the local fallback) and hands them down once — the
 * navbar, footer, contact panel and floating buttons then all share the
 * same values without each one fetching on its own.
 */
const SiteSettingsContext = createContext<SiteSettings | null>(null);

interface SiteSettingsProviderProps {
  /** The company details, resolved on the server. */
  settings: SiteSettings;
  /** The page content. */
  children: ReactNode;
}

/**
 * Provide the company details to every client component below it.
 */
export function SiteSettingsProvider({
  settings,
  children,
}: SiteSettingsProviderProps) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

/**
 * Read the company details from the context.
 *
 * @throws When used outside of `<SiteSettingsProvider>`.
 */
export function useSite(): SiteSettings {
  const settings = useContext(SiteSettingsContext);

  if (!settings) {
    throw new Error(
      "useSite() must be called inside <SiteSettingsProvider>.",
    );
  }

  return settings;
}
