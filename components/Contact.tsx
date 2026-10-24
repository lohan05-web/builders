"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { track } from "@vercel/analytics";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Send,
} from "lucide-react";
import {
  budgetOptions,
  contactProjectTypes,
  emptyContactForm,
  formatPhoneInput,
  isContactFormValid,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from "@/data/contact";
import { useSite } from "@/components/SiteSettingsProvider";
import { socialIcons, socialLabels, type SocialNetwork } from "./SocialIcons";

/** The order fields are checked in, so the first error can be focused. */
const FIELD_ORDER: (keyof ContactFormValues)[] = [
  "name",
  "phone",
  "email",
  "projectType",
  "budget",
  "message",
];

/** The networks shown in the contact panel, in display order. */
const SOCIAL_NETWORKS: SocialNetwork[] = [
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
];

/** Status of the quote form. */
type FormStatus = "idle" | "submitting" | "success" | "error";

/** Shared styling for every text input, select and textarea. */
const FIELD_CLASSES =
  "w-full min-h-[44px] rounded-sm border bg-navy px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-200 focus:border-orange focus:ring-2 focus:ring-orange/40";

/** Props for the small `Field` wrapper. */
interface FieldProps {
  /** Id of the control — also used for the `label`'s `htmlFor`. */
  id: string;
  /** Visible label. */
  label: string;
  /** Marks the field as required. */
  required?: boolean;
  /** Marks the field as optional. */
  optional?: boolean;
  /** Validation message shown below the control. */
  error?: string;
  /** Extra classes on the wrapper (used for the full-width rows). */
  className?: string;
  /** The control itself. */
  children: ReactNode;
}

/**
 * A labelled form row with an inline error message.
 */
function Field({
  id,
  label,
  required,
  optional,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-widest text-white/70"
      >
        {label}
        {required ? (
          <span className="text-orange" aria-hidden="true">
            *
          </span>
        ) : null}
        {optional ? (
          <span className="text-[10px] font-normal normal-case tracking-normal text-white/40">
            optional
          </span>
        ) : null}
      </label>

      <div className="mt-2">{children}</div>

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            key={error}
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.25 }}
            role="alert"
            className="flex items-start gap-1.5 overflow-hidden pt-2 text-xs text-red-400"
          >
            <AlertCircle
              className="mt-px h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  /** The company details, resolved on the server and shared via context. */
  const site = useSite();
  /** Current field values. */
  const [values, setValues] = useState<ContactFormValues>(emptyContactForm);
  /** Inline validation messages. */
  const [errors, setErrors] = useState<ContactFormErrors>({});
  /** Where the form is in its lifecycle. */
  const [status, setStatus] = useState<FormStatus>("idle");
  /** Message coming back from the server. */
  const [serverMessage, setServerMessage] = useState("");

  /**
   * Update one field and clear its error as soon as the user edits it.
   *
   * @param field The field being edited.
   */
  const handleChange =
    (field: keyof ContactFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const raw = event.target.value;
      const value = field === "phone" ? formatPhoneInput(raw) : raw;

      setValues((previous) => ({ ...previous, [field]: value }));

      setErrors((previous) => {
        if (!previous[field]) return previous;
        const next = { ...previous };
        delete next[field];
        return next;
      });
    };

  /**
   * Validate a single field once the user leaves it.
   *
   * @param field The field that lost focus.
   */
  const handleBlur =
    (field: keyof ContactFormValues) => () => {
      const single = validateContactForm({
        [field]: values[field],
      } as Partial<ContactFormValues>);

      setErrors((previous) => {
        const next = { ...previous };
        if (single[field]) {
          next[field] = single[field];
        } else {
          delete next[field];
        }
        return next;
      });
    };

  /**
   * Validate and submit the form.
   *
   * @param event The form submit event.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateContactForm(values);
    setErrors(validation);

    if (!isContactFormValid(validation)) {
      // Move the caret to the first field that needs attention.
      const firstInvalid = FIELD_ORDER.find((field) => validation[field]);
      if (firstInvalid) {
        document.getElementById(firstInvalid)?.focus();
      }
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string; errors?: ContactFormErrors }
        | null;

      if (!response.ok || !data?.ok) {
        setStatus("error");
        setServerMessage(
          data?.message ?? "Something went wrong. Please try again in a moment.",
        );
        if (data?.errors) setErrors(data.errors);
        return;
      }

      setStatus("success");
      setServerMessage(data.message ?? "Thanks — your enquiry has been received.");
      track("contact_form_submit", { success: "true" });
    } catch {
      setStatus("error");
      setServerMessage(
        "We could not reach the server. Please check your connection and try again.",
      );
    }
  };

  /** Reset the form so another enquiry can be sent. */
  const resetForm = () => {
    setValues(emptyContactForm);
    setErrors({});
    setStatus("idle");
    setServerMessage("");
  };

  const isSubmitting = status === "submitting";

  return (
    <section
      id="contact"
      className="relative w-full scroll-mt-20 bg-navy py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* --- Section heading ------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-orange">
            Contact Us
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Get Your Free Quote
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            Tell us about your project and we will come back with a detailed,
            no-obligation estimate within one working day.
          </p>
        </motion.div>

        {/* --- Form + details --------------------------------------------- */}
        <div className="mt-10 grid gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-12">
          {/* --------------------------- Quote form ------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-sm border border-white/10 bg-navy-light/70 p-5 sm:p-8 lg:p-9"
          >
            <AnimatePresence mode="wait" initial={false}>
              {status === "success" ? (
                /* --- Success state ---------------------------------- */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                  className="flex min-h-[420px] flex-col items-center justify-center py-8 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-orange/60 bg-orange/10 text-orange">
                    <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold text-white">
                    Enquiry received
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                    {serverMessage ||
                      "Thanks — your enquiry has been received."}{" "}
                    Our team will get back to you within one working day.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-8 min-h-[44px] rounded-sm border border-white/20 px-7 py-3 text-sm font-semibold tracking-wide text-white/90 transition-colors duration-200 hover:border-orange hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                  >
                    Send another enquiry
                  </button>
                </motion.div>
              ) : (
                /* --- The form ----------------------------------------- */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Name */}
                    <Field id="name" label="Name" required error={errors.name}>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your full name"
                        value={values.name}
                        onChange={handleChange("name")}
                        onBlur={handleBlur("name")}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={`${FIELD_CLASSES} ${
                          errors.name
                            ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/30"
                            : "border-white/15"
                        }`}
                      />
                    </Field>

                    {/* Phone */}
                    <Field id="phone" label="Phone" required error={errors.phone}>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={11}
                        placeholder="98765 43210"
                        value={values.phone}
                        onChange={handleChange("phone")}
                        onBlur={handleBlur("phone")}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        className={`${FIELD_CLASSES} ${
                          errors.phone
                            ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/30"
                            : "border-white/15"
                        }`}
                      />
                    </Field>

                    {/* Email */}
                    <Field id="email" label="Email" optional error={errors.email}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={values.email}
                        onChange={handleChange("email")}
                        onBlur={handleBlur("email")}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className={`${FIELD_CLASSES} ${
                          errors.email
                            ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/30"
                            : "border-white/15"
                        }`}
                      />
                    </Field>

                    {/* Project type */}
                    <Field id="projectType" label="Project Type" error={errors.projectType}>
                      <div className="relative">
                        <select
                          id="projectType"
                          name="projectType"
                          value={values.projectType}
                          onChange={handleChange("projectType")}
                          onBlur={handleBlur("projectType")}
                          aria-invalid={Boolean(errors.projectType)}
                          aria-describedby={errors.projectType ? "projectType-error" : undefined}
                          className={`${FIELD_CLASSES} appearance-none pr-11 ${
                            errors.projectType
                              ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/30"
                              : "border-white/15"
                          }`}
                        >
                          <option value="">Select a project type</option>
                          {contactProjectTypes.map((option) => (
                            <option
                              key={option.id}
                              value={option.id}
                              className="bg-charcoal-900"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          aria-hidden="true"
                          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                        />
                      </div>
                    </Field>

                    {/* Budget */}
                    <Field id="budget" label="Approx. Budget" optional>
                      <div className="relative">
                        <select
                          id="budget"
                          name="budget"
                          value={values.budget}
                          onChange={handleChange("budget")}
                          className={`${FIELD_CLASSES} appearance-none pr-11 border-white/15`}
                        >
                          <option value="">Select a budget range</option>
                          {budgetOptions.map((option) => (
                            <option
                              key={option.id}
                              value={option.id}
                              className="bg-charcoal-900"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          aria-hidden="true"
                          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                        />
                      </div>
                    </Field>

                    {/* Message */}
                    <Field
                      id="message"
                      label="Message"
                      required
                      error={errors.message}
                      className="sm:col-span-2"
                    >
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Tell us about your site, the scope of work and your timeline."
                        value={values.message}
                        onChange={handleChange("message")}
                        onBlur={handleBlur("message")}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "message-error" : undefined}
                        className={`${FIELD_CLASSES} resize-y ${
                          errors.message
                            ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/30"
                            : "border-white/15"
                        }`}
                      />
                    </Field>
                  </div>

                  {/* --- Honeypot -------------------------------------- */}
                  {/* Hidden from people, filled in by bots. The server
                      discards any submission that arrives with a value. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden"
                  >
                    <label htmlFor="website" aria-hidden="true" tabIndex={-1} className="sr-only">
                      Leave this field empty
                    </label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.website}
                      onChange={handleChange("website")}
                    />
                  </div>

                  {/* --- Submit ------------------------------------------ */}
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-sm bg-orange px-8 py-4 text-sm font-semibold tracking-wide text-white transition-all duration-200 hover:bg-orange-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-orange sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2
                            className="h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                          Sending…
                        </>
                      ) : (
                        <>
                          Request My Free Quote
                          <Send className="h-4 w-4" aria-hidden="true" />
                        </>
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {status === "error" ? (
                        <motion.p
                          key="error"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25 }}
                          role="alert"
                          className="mt-4 flex items-start gap-2 text-sm text-red-400"
                        >
                          <AlertCircle
                            className="mt-0.5 h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          {serverMessage}
                        </motion.p>
                      ) : null}
                    </AnimatePresence>

                    <p className="mt-4 text-xs text-white/50">
                      By submitting, you agree to our{" "}
                      <Link
                        href="/privacy-policy"
                        className="underline underline-offset-2 transition-colors duration-200 hover:text-orange focus:outline-none focus-visible:text-orange"
                      >
                        Privacy Policy
                      </Link>
                      . We never share your details. No spam, ever.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* --------------------------- Details + map ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="rounded-sm border border-white/10 bg-navy-light/70 p-5 sm:p-7 lg:p-8">
              <h3 className="font-display text-2xl font-bold text-white">
                Talk to us directly
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Prefer to talk? Our project managers are on site and on the
                phone from Monday to Saturday.
              </p>

              <ul className="mt-8 space-y-6">
                {/* Address */}
                <li className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-orange/60 text-orange">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                      Office
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/85">
                      {site.address.full}
                    </p>
                    <a
                      href={site.map.placeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-orange transition-colors duration-200 hover:text-orange-hover focus:outline-none focus-visible:text-orange"
                    >
                      <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                      Get directions
                    </a>
                  </div>
                </li>

                {/* Phone */}
                <li className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-orange/60 text-orange">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                      Phone
                    </p>
                    <a
                      href={`tel:${site.phoneHref}`}
                      onClick={() => track("call_click", { location: "contact" })}
                      className="mt-1.5 block text-sm text-white/85 transition-colors duration-200 hover:text-orange focus:outline-none focus-visible:text-orange"
                    >
                      {site.phone}
                    </a>
                  </div>
                </li>

                {/* Email */}
                <li className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-orange/60 text-orange">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                      Email
                    </p>
                    <a
                      href={`mailto:${site.email}`}
                      className="mt-1.5 block break-all text-sm text-white/85 transition-colors duration-200 hover:text-orange focus:outline-none focus-visible:text-orange"
                    >
                      {site.email}
                    </a>
                  </div>
                </li>

                {/* Working hours */}
                <li className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-orange/60 text-orange">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                      Working hours
                    </p>
                    <dl className="mt-1.5 space-y-1">
                      {site.workingHours.map((slot) => (
                        <div
                          key={slot.days}
                          className="flex flex-wrap gap-x-3 text-sm text-white/85"
                        >
                          <dt className="min-w-[130px] text-white/65">{slot.days}</dt>
                          <dd>{slot.hours}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              </ul>

              {/* Social icons */}
              <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-7">
                {SOCIAL_NETWORKS.map((network) => {
                  const Icon = socialIcons[network];
                  return (
                    <a
                      key={network}
                      href={site.social[network]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${site.name} on ${socialLabels[network]}`}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all duration-200 ease-smooth hover:border-orange hover:bg-orange/10 hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* --- Google Map --------------------------------------------- */}
            <div className="mt-8 overflow-hidden rounded-sm border border-white/10 bg-charcoal-600">
              <iframe
                src={site.map.embedUrl}
                title={`${site.name} office location`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-[320px] w-full border-0 invert-[0.92] hue-rotate-180"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
