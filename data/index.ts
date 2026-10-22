export { site, navLinks, stats, whatsappLink, lastUpdated, SITE_URL } from "./site";
export { services } from "./services";
export type { Service, ServiceIconName } from "./services";
export { projects, beforeAfter, formatArea, getProjectBySlug, getAdjacentProjects } from "./projects";
export type { Project, ProjectCategory } from "./projects";
export { faqs } from "./faqs";
export type { FaqItem } from "./faqs";
export { processSteps } from "./process";
export type { ProcessStep, ProcessIconName } from "./process";
export {
  estimatorConfig,
  projectTypes,
  finishLevels,
  calculateEstimate,
  formatINR,
  clampArea,
} from "./estimator";
export type {
  ProjectType,
  FinishLevel,
  ProjectTypeOption,
  FinishOption,
  Estimate,
} from "./estimator";
export { testimonials } from "./testimonials";
export type { Testimonial, Rating } from "./testimonials";
export {
  companyStory,
  founder,
  team,
  trustBadges,
  aboutImage,
} from "./about";
export type {
  CompanyStory,
  Founder,
  TeamMember,
  TrustBadge,
  TrustIconName,
} from "./about";
export {
  contactProjectTypes,
  budgetOptions,
  emptyContactForm,
  validateContactForm,
  isContactFormValid,
  formatPhoneInput,
  normalisePhone,
  INDIAN_MOBILE_PATTERN,
} from "./contact";
export type {
  ContactProjectType,
  ContactProjectTypeOption,
  BudgetOption,
  ContactFormValues,
  ContactFormErrors,
} from "./contact";
