/**
 * Configuration and shared validation for the "Get Your Free Quote" form.
 *
 * The validation helpers live here (rather than inside the component) so the
 * exact same rules run in the browser AND in the API route handler — the
 * client can never be tricked into sending an invalid payload.
 */

/** The kinds of project a client can ask about. */
export type ContactProjectType =
  | "Residential"
  | "Commercial"
  | "Renovation"
  | "Interiors";

export interface ContactProjectTypeOption {
  /** Value used in the form payload. */
  id: ContactProjectType;
  /** Label shown in the dropdown. */
  label: string;
}

/** Options for the "Project Type" dropdown. */
export const contactProjectTypes: ContactProjectTypeOption[] = [
  { id: "Residential", label: "Residential" },
  { id: "Commercial", label: "Commercial" },
  { id: "Renovation", label: "Renovation" },
  { id: "Interiors", label: "Interiors" },
];

/** An approximate budget band. */
export interface BudgetOption {
  /** Value used in the form payload. */
  id: string;
  /** Label shown in the dropdown. */
  label: string;
}

/**
 * Options for the optional "Approx. Budget" dropdown.
 * Amounts are in INR and grouped the Indian way (lakh / crore).
 */
export const budgetOptions: BudgetOption[] = [
  { id: "under-10-lakh", label: "Under Rs. 10 Lakh" },
  { id: "10-25-lakh", label: "Rs. 10 – 25 Lakh" },
  { id: "25-50-lakh", label: "Rs. 25 – 50 Lakh" },
  { id: "50-lakh-1-crore", label: "Rs. 50 Lakh – 1 Crore" },
  { id: "above-1-crore", label: "Above Rs. 1 Crore" },
  { id: "not-sure", label: "Not sure yet" },
];

/** Every field the quote form holds. */
export interface ContactFormValues {
  /** Full name — required. */
  name: string;
  /** 10-digit Indian mobile number — required. */
  phone: string;
  /** Email address — optional, but validated when present. */
  email: string;
  /** Chosen project type. */
  projectType: ContactProjectType | "";
  /** Chosen budget band — optional. */
  budget: string;
  /** Free-text description of the project — required. */
  message: string;
  /**
   * Honeypot field. Hidden from people, irresistible to bots.
   * If this is ever filled in, the submission is silently discarded.
   */
  website: string;
}

/** Field name -> error message. Absent fields are valid. */
export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

/** The empty form, used as the component's initial state. */
export const emptyContactForm: ContactFormValues = {
  name: "",
  phone: "",
  email: "",
  projectType: "",
  budget: "",
  message: "",
  website: "",
};

/**
 * A valid Indian mobile number: 10 digits starting with 6, 7, 8 or 9.
 */
export const INDIAN_MOBILE_PATTERN = /^[6-9]\d{9}$/;

/** A deliberately simple email shape check. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Strip everything that is not a digit.
 *
 * @param value Raw input.
 */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Reduce a typed phone number to its 10-digit local form.
 *
 * Handles the `+91` / `0` prefixes people tend to type, and ignores any
 * trailing digits once 10 are collected.
 *
 * @param value Raw input.
 */
export function normalisePhone(value: string): string {
  let digits = digitsOnly(value);

  // "+91 98765 43210" -> drop the country code.
  if (digits.length > 10 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  // "098765 43210" -> drop the trunk prefix.
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
}

/**
 * Format a phone number for display while the user types.
 *
 * @param value Raw input.
 * @returns e.g. "98765 43210"
 */
export function formatPhoneInput(value: string): string {
  const digits = normalisePhone(value);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/**
 * Validate the quote form.
 *
 * Name and phone are required; email is optional but must be valid when
 * supplied; the message field must not be empty.
 *
 * @param values The submitted (or partially typed) form values.
 * @returns A map of field name -> error message. Empty when the form is valid.
 */
export function validateContactForm(
  values: Partial<ContactFormValues>,
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  const name = (values.name ?? "").trim();
  const phone = normalisePhone(values.phone ?? "");
  const email = (values.email ?? "").trim();
  const message = (values.message ?? "").trim();

  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length < 2) {
    errors.name = "Please enter your full name.";
  }

  if (!phone) {
    errors.phone = "Please enter your phone number.";
  } else if (!INDIAN_MOBILE_PATTERN.test(phone)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!message) {
    errors.message = "Tell us a little about your project.";
  }

  return errors;
}

/**
 * Whether a set of errors means the form is good to submit.
 *
 * @param errors The result of `validateContactForm`.
 */
export function isContactFormValid(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
