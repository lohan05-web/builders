import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import JsonLd from "@/components/JsonLd";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { SITE_URL } from "@/data/site";
import { getServices, getSiteSettings } from "@/sanity/lib/fetch";
import { Analytics } from "@vercel/analytics/next";

/**
 * Fonts are self-hosted by next/font (no external requests at runtime).
 * The CSS variables are mapped to Tailwind's `font-sans` / `font-display`.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/**
 * The site is re-rendered in the background every 60 seconds, so a change
 * made in the Sanity Studio appears on the live site within a minute.
 */
export const revalidate = 60;

/**
 * Page metadata, built from the company details stored in Sanity.
 *
 * Falls back to the local `data/site.ts` copy when the CMS is not set up.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${site.name} | ${site.tagline}`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: [
      "construction company",
      "home builder",
      "residential construction",
      "commercial builder",
      "renovation contractor",
      "interior design",
      "project management",
      "structural design",
      "builders in Mumbai",
      site.name,
    ],
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: site.name,
      title: `${site.name} | ${site.tagline}`,
      description: site.description,
      url: SITE_URL,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${site.name} - Premium Construction & Building Services`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} | ${site.tagline}`,
      description: site.description,
      images: ["/opengraph-image"],
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The company details and the services list are resolved once here and
  // handed to the client components as props.
  const [site, services] = await Promise.all([getSiteSettings(), getServices()]);

  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-screen bg-charcoal font-sans text-white antialiased">
        <SiteSettingsProvider settings={site}>
          <JsonLd settings={site} />
          {/* Navbar is global so it stays mounted across every route. */}
          <Navbar />
          <main>{children}</main>
          {/* The footer is global so inner pages share the same quick links. */}
          <Footer services={services} />
          {/* Floating WhatsApp / call buttons sit above every page. */}
          <FloatingButtons />
        </SiteSettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}
