import { SITE_URL } from "@/data/site";
import { projects } from "@/data/projects";

export const revalidate = 86400;

export default function sitemap() {
  const now = new Date().toISOString();

  const staticRoutes = [
    { url: SITE_URL, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly" as const, priority: 0.6 },
  ];

  const projectRoutes = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes.map((route) => ({ ...route, lastModified: now })),
    ...projectRoutes,
  ];
}
