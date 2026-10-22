import type { Viewport } from "next";
import { NextStudio, viewport as studioViewport } from "next-sanity/studio";
import config from "@/sanity.config";
import { projectId } from "@/sanity/publicEnv";

/**
 * The Studio is a browser application, so the route is served as a static
 * shell and hydrated on the client.
 */
export const dynamic = "force-static";

/**
 * The viewport the Studio needs on phones — it draws into the safe area.
 */
export const viewport: Viewport = {
  ...studioViewport,
};

/**
 * Shown until a Sanity project is configured.
 *
 * The Studio cannot talk to Sanity without a project ID, and Sanity's own
 * error screen is not very helpful. This explains what to do instead.
 */
function StudioSetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-5 py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">
          Content Studio
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          One step to go
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/60">
          The Studio needs a Sanity project before it can open. Add the
          project details to your environment file and restart the server.
        </p>

        <ol className="mt-8 space-y-5">
          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-gold">
              1
            </span>
            <div>
              <p className="font-semibold text-white">
                Create a free Sanity project
              </p>
              <p className="mt-1 text-sm leading-relaxed text-white/55">
                Sign up at{" "}
                <a
                  href="https://www.sanity.io/manage"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-gold underline underline-offset-4 transition-colors hover:text-gold-light"
                >
                  sanity.io/manage
                </a>{" "}
                and copy the Project ID from the project settings.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-gold">
              2
            </span>
            <div>
              <p className="font-semibold text-white">
                Add the environment variables
              </p>
              <p className="mt-1 text-sm leading-relaxed text-white/55">
                Put{" "}
                <code className="rounded-sm bg-white/5 px-1.5 py-0.5 text-xs text-gold">
                  NEXT_PUBLIC_SANITY_PROJECT_ID
                </code>{" "}
                and{" "}
                <code className="rounded-sm bg-white/5 px-1.5 py-0.5 text-xs text-gold">
                  NEXT_PUBLIC_SANITY_DATASET
                </code>{" "}
                into <code className="text-white/80">.env.local</code> (see{" "}
                <code className="text-white/80">.env.example</code>).
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-gold">
              3
            </span>
            <div>
              <p className="font-semibold text-white">Restart and reload</p>
              <p className="mt-1 text-sm leading-relaxed text-white/55">
                The Studio then opens here at{" "}
                <code className="text-white/80">/studio</code> and the site
                starts reading its content from that project.
              </p>
            </div>
          </li>
        </ol>

        <p className="mt-10 border-t border-white/10 pt-6 text-sm leading-relaxed text-white/45">
          Until the project is connected the website keeps serving the local
          copy of the content in <code className="text-white/70">/data</code>,
          so nothing is ever broken.
        </p>
      </div>
    </div>
  );
}

/**
 * The embedded Sanity Studio.
 *
 * Running it inside the website means the client edits the content at
 * `yoursite.com/studio` — no separate tool to deploy, no second login.
 *
 * The route's `noindex` metadata lives in `layout.tsx` (a client component
 * cannot export metadata).
 */
export default function StudioPage() {
  // Without a project id the Studio cannot start, so we explain the setup
  // instead of showing Sanity's generic crash screen.
  if (!projectId) {
    return <StudioSetupNotice />;
  }

  return <NextStudio config={config} />;
}
