import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import JsonLd from "@/components/JsonLd";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { SITE_URL, site as localSite } from "@/data/site";
import { Analytics } from "@vercel/analytics/next";

/**
 * Fonts are self-hosted by next/font (no external requests at runtime).
 * The CSS variables are mapped to Tailwind's `font-sans` / `font-display`.
 */
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const site = localSite;

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
  const site = localSite;

  return (
    <html lang="en" className={`${dmSans.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-screen bg-navy font-sans text-white antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-orange focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <SiteSettingsProvider settings={site}>
          <JsonLd settings={site} />
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <FloatingButtons />
        </SiteSettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}
