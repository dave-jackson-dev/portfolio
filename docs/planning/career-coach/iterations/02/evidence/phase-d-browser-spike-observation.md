# Phase D — Browser Automation Spike Observation

> 📦 **Ported from `singularity` on 2026-09-08.** Content is unchanged; the only edits are this
> banner and the links that could not survive the move, which are **marked in place rather than
> redirected** — see the corpus README.
> Part of the Career Coach corpus — see [the corpus README](../../../README.md).
> 🔴 Links outside this corpus resolve only in a `singularity` checkout and are **not ported**.
> Provenance: [ADR-002](../../../../../architecture/adr-002-lean-agile-os-is-the-upstream-platform.md).

**Target:** `https://job-boards.greenhouse.io/remotecom` (Remote.com's Greenhouse job board)
**Date:** 2026-08-13 · **Driver:** Playwright headless Chromium, unauthenticated
**Method:** Single `page.goto()` call with `waitUntil: 'networkidle'`; 500 ms courtesy delay
before the request (no Crawl-delay declared for this subdomain)

---

## What happened

| Check            | Result                                                                             |
| ---------------- | ---------------------------------------------------------------------------------- |
| HTTP status      | **200** — no redirect, no interstitial                                             |
| Final URL        | `https://job-boards.greenhouse.io/remotecom` (unchanged)                           |
| Time to load     | **1 372 ms**                                                                       |
| Browser closed   | Clean — no errors                                                                  |
| 225 jobs listed? | ✅ `h2` text `"225 jobs"` found via DOM query                                      |
| First job title  | `"CX AI & Automation LeadRemote-UK&I"` (title + location merged via `textContent`) |

---

## Anti-bot / CAPTCHA findings

`captcha` and `recaptcha` strings are **present in the page source** — but **no CAPTCHA challenge
appeared**. The listing page loaded fully without any interstitial, bot-detection screen, or
redirect.

Why the strings appear: Google reCAPTCHA is embedded on the **job application form** (`/jobs/<id>/application`),
not on the listing page itself. A spider that browses listings but never submits an application
does not trigger it.

**Mitigation cost for H3: zero for listing-page scraping.** If the spike were extended to
_submit_ an application, reCAPTCHA would become relevant. That is outside the scope of what
this project's sourcing does — it reads listings, it does not apply.

---

## DOM parse seam — what the adapter would need

The first extracted title (`"CX AI & Automation LeadRemote-UK&I"`) shows that naive `textContent`
on an `<a>` tag merges adjacent text nodes (job title and location) without a space. A production
parse seam would need:

- Separate selectors for title and location (e.g. `.job-title` and `.location`), OR
- `innerText` on parent + trim-split at the known location suffixes (`Remote-*`, a city name), OR
- The existing **JSON API** (`/api/v1/boards/{token}/jobs`) — which already returns structured
  `title`, `location.name`, and `id` fields and requires no DOM parsing at all.

> The JSON API path (already shipped in Sprint 1) is strictly preferable: structured, stable,
> no DOM fragility. The browser spike proves the listing _is_ reachable, but the JSON API
> already sources it better.

---

## Conclusion

`job-boards.greenhouse.io/remotecom` is **reachable, unblocked, and parseable** via headless
Playwright. No anti-bot measures engage on the listing page. The reCAPTCHA present is scoped
to application submission, not browsing.

**H1 is validated:** Playwright sourcing is technically and legally viable for Greenhouse job
boards. The browser approach adds no capability over the existing JSON API for Greenhouse itself —
its value would be at sites that publish no JSON API (the production `Sourcing Service` scope,
Iteration 03).

**H3 is answered:** CAPTCHA/anti-bot mitigation cost is zero for listing-page reading. It
becomes a cost only if application submission is automated, which is not planned (AD3, Iteration 01).
