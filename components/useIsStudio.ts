"use client";

import { usePathname } from "next/navigation";

/**
 * True while the embedded Sanity Studio is open.
 *
 * The Studio lives at `/studio` and needs the whole browser window, so the
 * public site chrome (navbar, footer, floating buttons) hides itself while
 * the admin panel is on screen.
 */
export function useIsStudio(): boolean {
  const pathname = usePathname();

  return pathname?.startsWith("/studio") ?? false;
}
