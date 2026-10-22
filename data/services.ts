/**
 * Service catalogue for the LM Builders site.
 *
 * `icon` stores the lucide-react icon *name* rather than the component
 * itself, so this file stays free of React/JSX imports. The name is mapped
 * to a real component in `components/Services.tsx` via `ServiceIconName`.
 */

/** Union of every lucide icon name used by the services. */
export type ServiceIconName =
  | "Home"
  | "Building2"
  | "PaintRoller"
  | "Armchair"
  | "DraftingCompass"
  | "ClipboardCheck";

export interface Service {
  /** Stable slug — also used as the React key and any future anchor id. */
  id: string;
  /** Card heading. */
  title: string;
  /** One or two line summary shown under the title. */
  description: string;
  /** lucide-react icon name (see `ServiceIconName`). */
  icon: ServiceIconName;
}

export const services: Service[] = [
  {
    id: "residential-construction",
    title: "Residential Construction",
    description:
      "Custom homes and multi-unit developments built to the highest structural and finishing standards.",
    icon: "Home",
  },
  {
    id: "commercial-buildings",
    title: "Commercial Buildings",
    description:
      "Office, retail and warehouse spaces engineered for safety, efficiency and long-term value.",
    icon: "Building2",
  },
  {
    id: "renovation",
    title: "Renovation",
    description:
      "Full teardown-to-turnkey remodels that give tired properties a brand new life.",
    icon: "PaintRoller",
  },
  {
    id: "interior-design",
    title: "Interior Design",
    description:
      "Thoughtfully planned interiors with premium finishes, tailored to how you actually live.",
    icon: "Armchair",
  },
  {
    id: "structural-design",
    title: "Structural Design",
    description:
      "Engineered structural drawings and calculations that keep every build safe and sound.",
    icon: "DraftingCompass",
  },
  {
    id: "project-management",
    title: "Project Management",
    description:
      "Clear budgets, honest timelines and proactive communication from foundation to handover.",
    icon: "ClipboardCheck",
  },
];
