import { SITE_URL, site as localSite } from "@/data/site";

type SiteSettings = typeof localSite;

interface JsonLdProps {
  settings?: SiteSettings;
}

export default function JsonLd({ settings: site = localSite }: JsonLdProps) {
  const openingHours = site.workingHours.map((slot) => {
    if (slot.days === "Sunday") return "Su By Appointment";
    if (slot.days === "Saturday") return "Sa 09:00-17:00";
    return "Mo-Fr 09:00-19:00";
  });

  const sameAs = Object.values(site.social).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "LocalBusiness"],
    name: site.name,
    description: site.description,
    url: SITE_URL,
    telephone: site.phoneHref,
    email: site.email,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "00:00",
        closes: "00:00",
        description: "By appointment only",
      },
    ],
    openingHours,
    sameAs,
    priceRange: "$$",
    areaServed: {
      "@type": "City",
      name: "Mumbai",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
