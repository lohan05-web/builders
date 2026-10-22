import type { Metadata } from "next";

/**
 * The embedded Sanity Studio.
 *
 * The Studio is a private admin tool — it must never appear in search
 * results, so the route opts out of indexing.
 */
export const metadata: Metadata = {
  title: "Content Studio",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

/**
 * The Studio is a browser application, so the route is served as a static
 * shell and hydrated on the client.
 */
export const dynamic = "force-static";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
