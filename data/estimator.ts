/**
 * Pricing configuration for the cost estimator.
 *
 * Everything the estimator needs lives here — the component reads rates,
 * bounds and labels from this file and never hardcodes a number.
 */

/** The kinds of project the estimator can price. */
export type ProjectType =
  | "Residential"
  | "Commercial"
  | "Renovation"
  | "Interiors";

/** The three material/finish tiers a client can pick. */
export type FinishLevel = "Basic" | "Standard" | "Premium";

export interface ProjectTypeOption {
  id: ProjectType;
  label: string;
  /** Short line shown under the button label. */
  description: string;
}

export interface FinishOption {
  id: FinishLevel;
  label: string;
  /** Short line shown under the button label. */
  description: string;
}

/**
 * The pricing table: rate per sq.ft in INR, indexed by project type and
 * then by finish level. Edit these numbers to change the site.
 */
export const estimatorConfig = {
  /** Cost per sq.ft in INR for each project type x finish level. */
  rates: {
    Residential: { Basic: 1800, Standard: 2200, Premium: 2800 },
    Commercial: { Basic: 1500, Standard: 1900, Premium: 2500 },
    Renovation: { Basic: 900, Standard: 1200, Premium: 1600 },
    Interiors: { Basic: 700, Standard: 1100, Premium: 1500 },
  } satisfies Record<ProjectType, Record<FinishLevel, number>>,

  /**
   * Percentage spread used to turn one rate into a min-max range.
   * 10 means the estimate is shown as roughly +/-10% of the base cost.
   */
  rangePercent: 10,

  /** Area input bounds, in sq.ft. */
  minArea: 100,
  maxArea: 100000,

  /** Area the estimator starts on, in sq.ft. */
  defaultArea: 1200,
};

/** Button-group options for the project type. */
export const projectTypes: ProjectTypeOption[] = [
  {
    id: "Residential",
    label: "Residential",
    description: "Homes, villas and apartments",
  },
  {
    id: "Commercial",
    label: "Commercial",
    description: "Offices, retail and warehouses",
  },
  {
    id: "Renovation",
    label: "Renovation",
    description: "Full remodels and redevelopments",
  },
  {
    id: "Interiors",
    label: "Interiors",
    description: "Fit-outs and interior finishes",
  },
];

/** Card options for the finish level. */
export const finishLevels: FinishOption[] = [
  {
    id: "Basic",
    label: "Basic",
    description: "Solid essentials, proven materials, clean finishes",
  },
  {
    id: "Standard",
    label: "Standard",
    description: "Mid-range fittings with durable, low-maintenance specs",
  },
  {
    id: "Premium",
    label: "Premium",
    description: "Luxury materials, bespoke joinery and detailing",
  },
];

/** A calculated estimate, in INR. */
export interface Estimate {
  /** Lower bound of the range. */
  min: number;
  /** Upper bound of the range. */
  max: number;
  /** Midpoint, used for the per-sq.ft summary. */
  base: number;
  /** Rate per sq.ft that was applied. */
  rate: number;
}

/**
 * Calculate the cost range for a project.
 *
 * @param area    Built-up area in sq.ft.
 * @param type    Project type.
 * @param finish  Finish level.
 */
export function calculateEstimate(
  area: number,
  type: ProjectType,
  finish: FinishLevel,
): Estimate {
  const rate = estimatorConfig.rates[type][finish];
  const base = area * rate;
  const spread = base * (estimatorConfig.rangePercent / 100);

  return {
    min: Math.round(base - spread),
    max: Math.round(base + spread),
    base: Math.round(base),
    rate,
  };
}

/**
 * Format a rupee amount the Indian way (lakh/crore grouping),
 * e.g. 2400000 -> "Rs. 24,00,000".
 */
export function formatINR(value: number): string {
  return `Rs. ${Math.round(value).toLocaleString("en-IN")}`;
}

/**
 * Clamp a raw area input into the allowed range.
 * Anything unparseable falls back to the minimum.
 */
export function clampArea(value: number): number {
  if (!Number.isFinite(value)) return estimatorConfig.minArea;
  return Math.min(
    estimatorConfig.maxArea,
    Math.max(estimatorConfig.minArea, Math.round(value)),
  );
}
