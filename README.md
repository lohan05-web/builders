# LM Builders

A premium portfolio website for LM Builders (construction company).

## Tech Stack
- [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [lucide-react](https://lucide.dev/)
- [Sanity](https://www.sanity.io/) (headless CMS + the embedded content Studio at `/studio`)
- [Resend](https://resend.com/) (email delivery for the quote form)
- [@vercel/analytics](https://vercel.com/docs/analytics) (page views + custom events)

## Routes

| Route | Description |
| --- | --- |
| `/` | The single-page site — hero, stats, services, projects, before/after, process, cost estimator, testimonials, about, FAQ, contact. |
| `/projects/[slug]` | A full project page per project (pre-rendered at build time and refreshed every 60 seconds). Hero image, details bar, materials, features, gallery lightbox, prev/next navigation and a quote CTA. |
| `/privacy-policy` | Privacy policy — what is collected, how it is used, sharing, cookies/analytics, retention, rights and how to get in touch. |
| `/studio` | The embedded **Sanity Studio** — where the client edits the content. Hidden from search engines and from the sitemap. |

Unknown project slugs return a real HTTP 404 and render the branded `app/not-found.tsx` page.

> **Why is the home page in `app/(home)/`?** The loading UI lives in `app/(home)/loading.tsx` instead of `app/loading.tsx`. A `loading.tsx` wraps its route in a `<Suspense>` boundary, and once a response starts streaming Next.js can no longer change the status code — a `notFound()` would then answer with a `200` and the 404 UI (a "soft 404"). Keeping the boundary inside the route group leaves `/projects/[slug]` and `/privacy-policy` outside it, so their `notFound()` calls still produce a real HTTP 404. Route groups do not change the URL, so `/` is still the home page.

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

   The Sanity variables are only needed for the CMS — see **Content Studio (Sanity CMS)** below.

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Content Studio (Sanity CMS)

The site is powered by [Sanity](https://www.sanity.io/). The Studio is **embedded in the website** at `/studio`, so the client edits the content in the browser — no separate tool, no second login.

### How the content flows

```
Sanity Studio (/studio)  →  GROQ queries  →  Server Components  →  props  →  Client Components
                (Sanity)     (sanity/lib)     (app/**/page.tsx)              (components/*)
                                        ↘ fallback: /data/*.ts
```

- Every page and component reads its content **on the server** and passes it down as props. The browser never talks to Sanity directly.
- The GROQ queries live in `sanity/lib/queries.ts`; the data-access layer is `sanity/lib/fetch.ts`.
- The old `/data/*.ts` files are kept as a **fallback**. If `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing, if Sanity is unreachable, or if a collection is still empty, the site quietly serves the local data. The site therefore never breaks because of the CMS.

### 1. Create a Sanity project

1. Sign up at [sanity.io/manage](https://www.sanity.io/manage) and create a project (the free plan is fine).
2. Copy the **Project ID** from *Project settings*.
3. Keep the dataset as `production` (the default) or set another name — just use the same value in the env vars.

### 2. Add the environment variables

Add these to `.env.local` (local) and to Vercel (production):

| Variable | Where to get it | Needed for |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | *Project settings* in sanity.io/manage | The Studio and every GROQ query |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` | The Studio and every GROQ query |
| `SANITY_API_READ_TOKEN` | *API tokens* in your project — "Viewer" permission | Only for **private** datasets; leave empty for a public one |
| `SANITY_API_WRITE_TOKEN` | *API tokens* in your project — "Editor" permission | Only used by `npm run seed`. **Never commit it** and never add it to the client side |

> `.env.local` is already in `.gitignore`. A real token must never be committed.

### 3. Allow the domain in Sanity (CORS)

The Studio talks to Sanity from the browser, so the domain has to be allowed:

1. In sanity.io/manage → your project → **API → CORS origins**.
2. Add the origin of the website, e.g. `http://localhost:3000` for local work and `https://yourdomain.com` for production.
3. Tick **"Use credentials"** (the Studio sends the session cookie) and add `sanity.io` / `api.sanity.io` as allow-list members if the form asks for them.
4. Press **Save**. Changes apply immediately.

Without this the Studio loads but every request is blocked by the browser.

### 4. Open the Studio

Start the dev server and go to [http://localhost:3000/studio](http://localhost:3000/studio):

1. Log in with the Sanity account that owns the project.
2. The sidebar is arranged as **Site Settings → Projects → Services → Testimonials → FAQs → Team → Before / After**.
3. Edit a document and press **Publish**.

> If the environment variables are still missing, `/studio` shows a short setup guide instead of the Studio.

Changes appear on the live site within about a minute — the pages use ISR with a 60-second revalidation window.

### 5. Seed the Studio with the current content

To load the content that currently lives in `/data` into Sanity (so the client does not start with an empty panel):

```bash
# with the photos uploaded as well (slower)
npm run seed

# text content only — much faster
npm run seed -- --skip-images
```

The script reads `data/site.ts`, `data/services.ts`, `data/projects.ts`, `data/testimonials.ts`, `data/faqs.ts` and `data/about.ts`, and creates the matching documents. It only ever creates or replaces documents it owns, so running it twice will not duplicate anything.

Requirements: `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_API_WRITE_TOKEN` in `.env.local`. The script runs on Node's built-in TypeScript support — no extra tooling to install.

### 6. Deploy to Vercel

1. Import the repository in Vercel.
2. Add **all** the environment variables from `.env.example` under **Project Settings → Environment Variables** (Production + Preview).
3. Add the Vercel domain to the Sanity **CORS origins** (step 3 above) — otherwise the Studio cannot load on the live domain.
4. Deploy. The Studio is available at `https://yourdomain.com/studio`.

### Content that is **not** in the CMS

The build process, the cost estimator, the company story / founder / trust badges, the map embed URL and the contact-form options stay in `/data/*.ts` — they are structural parts of the site rather than editable content.

## Editing Content

Content is edited in the **Sanity Studio** at `/studio` (see above). The `/data` folder is kept as the offline fallback and as the source the seed script imports from:

| File | What to edit |
| --- | --- |
| `data/site.ts` | Fallback copy of the company name, tagline, description, phone/WhatsApp/email/address, working hours, social links, map embed URL, `SITE_URL`, `navLinks` and the privacy-policy `lastUpdated` date. |
| `data/services.ts` | Fallback copy of the service cards (icons are mapped by name in the component). |
| `data/projects.ts` | Fallback copy of the project gallery, categories, before/after images, plus the per-project `slug`, `description`, `duration`, `budgetRange`, `materials`, `features` and `gallery` used by the detail pages. |
| `data/faqs.ts` | Fallback copy of the FAQ questions and answers (shared by the accordion and the FAQ JSON-LD). |
| `data/process.ts` | The 5-step build process. |
| `data/estimator.ts` | Pricing rates (INR), project types, finish levels, and calculation logic. |
| `data/testimonials.ts` | Fallback copy of the client testimonials and ratings. |
| `data/about.ts` | Company story, founder, trust badges, and the fallback team list. |
| `data/contact.ts` | Project type / budget dropdown options and form validation rules. |

### Adding a project

Either add it in the Studio (**Projects → +**), or append an entry to `projects` in `data/projects.ts` with a unique `slug` and re-run `npm run seed`. The route, the sitemap entry and the prev/next navigation are all generated from the list, so no other file needs to change.

## Adding Real Images

- **Projects / BeforeAfter / About / Testimonials / Hero** – Upload the photos in the Studio (`/studio`) and they are served through the Sanity image pipeline (`cdn.sanity.io`, already allowed in `next.config.mjs`). Without a CMS project, update the Unsplash/photo URLs in the corresponding `data/*.ts` files — `next.config.mjs` also allows `images.unsplash.com`.
- **Open Graph image** – Replace `app/opengraph-image.tsx` with your own design or swap to a static image in `/public`.
- **Favicon / icons** – Replace `app/icon.svg`, `public/icon.svg`, `app/apple-touch-icon.svg` / `public/apple-touch-icon.svg`, or generate a `favicon.ico` in `/app` or `/public`.

## SEO & Metadata
- Global metadata, Open Graph, Twitter cards, and JSON-LD (LocalBusiness/GeneralContractor) are configured in `app/layout.tsx` and `components/JsonLd.tsx`. The company details come from Sanity (falling back to `data/site.ts`).
- `app/sitemap.ts` lists the home page, the privacy policy and every project page. `app/robots.ts` points at it and disallows `/studio`.
- Each project page sets its own title, description, canonical URL and Open Graph image via `generateMetadata`.
- The FAQ renders a `FAQPage` JSON-LD block from the FAQ content.
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
3. Add the environment variables from `.env.example` in **Project Settings → Environment Variables** — including the four Sanity ones.
4. Add the Vercel domain to the Sanity **CORS origins** (with credentials allowed) so the Studio works on the live domain.
5. Update `SITE_URL` in `data/site.ts` to your production domain and redeploy.
6. If using a custom domain, Vercel will handle HTTPS automatically.
7. Analytics works out of the box on Vercel — no extra configuration needed.
