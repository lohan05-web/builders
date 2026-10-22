# LM Builders

A premium portfolio website for LM Builders (construction company).

## Tech Stack
- [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [lucide-react](https://lucide.dev/)
- [Resend](https://resend.com/) (email delivery for the quote form)
- [@vercel/analytics](https://vercel.com/docs/analytics) (page views + custom events)

## Routes

| Route | Description |
| --- | --- |
| `/` | The single-page site — hero, stats, services, projects, before/after, process, cost estimator, testimonials, about, FAQ, contact. |
| `/projects/[slug]` | A full project page per project (12 of them, all pre-rendered at build time). Hero image, details bar, materials, features, gallery lightbox, prev/next navigation and a quote CTA. |
| `/privacy-policy` | Privacy policy — what is collected, how it is used, sharing, cookies/analytics, retention, rights and how to get in touch. |

Unknown project slugs return a real HTTP 404 and render the branded `app/not-found.tsx` page.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Copy `.env.example` to `.env.local` and fill in the values:
   ```bash
   cp .env.example .env.local
   ```
   - `RESEND_API_KEY` – API key from [resend.com](https://resend.com/api-keys)
   - `CONTACT_TO_EMAIL` – email that receives quote enquiries
   - `CONTACT_FROM_EMAIL` – verified sender in Resend (e.g. `LM Builders <hello@yourdomain.com>`)
   If these are missing, the contact form falls back to `console.log` for local development.

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Editing Content

All editable content lives in the `/data` folder:
| File | What to edit |
| --- | --- |
| `data/site.ts` | Company name, tagline, description, phone/WhatsApp/email/address, working hours, social links, map embed URL, `SITE_URL`, `navLinks` and the privacy-policy `lastUpdated` date. |
| `data/services.ts` | Service cards (icons are mapped by name in the component). |
| `data/projects.ts` | Project gallery, categories, before/after images, plus the per-project `slug`, `description`, `duration`, `budgetRange`, `materials`, `features` and `gallery` used by the detail pages. |
| `data/faqs.ts` | The FAQ questions and answers (shared by the accordion and the FAQ JSON-LD). |
| `data/process.ts` | The 5-step build process. |
| `data/estimator.ts` | Pricing rates (INR), project types, finish levels, and calculation logic. |
| `data/testimonials.ts` | Client testimonials and ratings. |
| `data/about.ts` | Company story, founder, team, and trust badges. |
| `data/contact.ts` | Project type / budget dropdown options and form validation rules. |

### Adding a project
Append an entry to `projects` in `data/projects.ts` with a unique `slug`. The route, the sitemap entry and the prev/next navigation are all generated from that array, so no other file needs to change.

## Adding Real Images

- **Projects / BeforeAfter / About / Testimonials / Hero** – Update the Unsplash/photo URLs in the corresponding `data/*.ts` files. `next.config.mjs` already allows `images.unsplash.com`.
- **Open Graph image** – Replace `app/opengraph-image.tsx` with your own design or swap to a static image in `/public`.
- **Favicon / icons** – Replace `app/icon.svg`, `public/icon.svg`, `app/apple-touch-icon.svg` / `public/apple-touch-icon.svg`, or generate a `favicon.ico` in `/app` or `/public`.

## SEO & Metadata
- Global metadata, Open Graph, Twitter cards, and JSON-LD (LocalBusiness/GeneralContractor) are configured in `app/layout.tsx` and `components/JsonLd.tsx`.
- `app/sitemap.ts` lists the home page, the privacy policy and every project page. `app/robots.ts` points at it.
- Each project page sets its own title, description, canonical URL and Open Graph image via `generateMetadata`.
- The FAQ renders a `FAQPage` JSON-LD block from `data/faqs.ts`.
- There is exactly one `<h1>` per page. Use semantic headings in logical order elsewhere.

## Analytics
- `<Analytics />` lives in `app/layout.tsx`, so every route is tracked.
- Custom events are sent with `track()` from `@vercel/analytics`:
  | Event | Fired from |
  | --- | --- |
  | `get_quote_click` | Hero "Get a Quote" and the estimator CTA |
  | `whatsapp_click` | Floating WhatsApp button |
  | `call_click` | Floating call button, navbar, footer and contact card |
  | `contact_form_submit` | A successful contact-form submission |
  | `project_view_details` | "View Full Details" in the projects lightbox |

## Accessibility & Performance
- All images use `next/image` with appropriate `sizes`. Only the Hero image uses `priority`.
- The Google Maps iframe uses `loading="lazy"`.
- Fonts are loaded via `next/font/google` with `display: "swap"`.
- Animations respect `prefers-reduced-motion`.
- Interactive elements are keyboard-focusable with visible focus rings. Icon-only buttons include `aria-label`s.
- Anchor navigation uses `scroll-margin-top` so the sticky navbar doesn't cover section headings.
- The FAQ accordion exposes `aria-expanded` / `aria-controls` and keeps one panel open at a time.
- The gallery lightbox traps the keyboard (Esc, arrow keys) and locks page scrolling.

## Contact Form
- Client-side validation + server-side validation via shared helpers.
- Honeypot field blocks simple spam bots.
- In-memory rate limiting (5 requests per IP per 10 minutes).
- Emails sent through [Resend](https://resend.com/); falls back to `console.log` if env vars are missing.

## Build & Lint
```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

## Deploy to Vercel
1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project in [Vercel](https://vercel.com/).
3. Add the environment variables from `.env.example` in **Project Settings → Environment Variables**.
4. Update `SITE_URL` in `data/site.ts` to your production domain and redeploy.
5. If using a custom domain, Vercel will handle HTTPS automatically.
6. Analytics works out of the box on Vercel — no extra configuration needed.
