import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Page from "./Page";
import { SUPPORT_EMAIL } from "../../config/site";

const LEGAL_LINKS = [
  { label: "Terms of service", path: "/terms" },
  { label: "Privacy policy", path: "/privacy" },
  { label: "Refund policy", path: "/refund-policy" },
];

/**
 * Shared layout for the legal pages (terms, privacy, refunds).
 *
 * sections: [{ id, title, body: [string | string[]] }]
 *   - a string renders as a paragraph
 *   - an array of strings renders as a bulleted list
 * summary: optional short list shown in a highlighted box above section 1.
 */
export default function LegalPage({ title, updated, intro, summary, sections }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Page>
      <section className="relative overflow-hidden border-b-2 border-ink bg-paper poster-grain">
        <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-9 md:py-20">
          <span className="inline-block -rotate-2 bg-marigold px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_var(--color-ink)]">
            Legal
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl uppercase leading-[0.98] text-ink md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-stone-500">
            Last updated {updated}
          </p>
          {intro && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">{intro}</p>
          )}

          <div className="mt-8 flex flex-wrap gap-2.5">
            {LEGAL_LINKS.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                aria-current={pathname === link.path ? "page" : undefined}
                className={[
                  "border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-wide transition",
                  pathname === link.path
                    ? "bg-ink text-paper"
                    : "bg-white text-ink hover:bg-ink hover:text-paper",
                ].join(" ")}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[250px_1fr] md:px-9 md:py-16">
        <aside className="hidden md:block">
          <nav
            aria-label="On this page"
            className="sticky top-24 border-2 border-ink bg-white p-5 shadow-card"
          >
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
              On this page
            </p>
            <ol className="mt-3 space-y-2 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex gap-2 text-stone-600 transition hover:text-raspberry"
                  >
                    <span className="w-5 shrink-0 font-semibold text-stone-400">{i + 1}.</span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="max-w-3xl">
          {summary && (
            <div className="mb-12 border-2 border-ink bg-marigold/20 p-6 shadow-card">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink">
                The short version
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-stone-700">
                {summary.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="mb-12 scroll-mt-24">
              <h2 className="font-display text-xl text-ink md:text-2xl">
                <span className="mr-2 text-raspberry">{i + 1}.</span>
                {s.title}
              </h2>
              {s.body.map((block, j) =>
                Array.isArray(block) ? (
                  <ul
                    key={j}
                    className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-stone-600"
                  >
                    {block.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={j} className="mt-3 leading-relaxed text-stone-600">
                    {block}
                  </p>
                )
              )}
            </section>
          ))}

          <p className="border-t-2 border-ink pt-6 text-sm leading-relaxed text-stone-500">
            Questions about this page? Email {SUPPORT_EMAIL} or send us a message from the
            Contact page.
          </p>
        </article>
      </div>
    </Page>
  );
}
