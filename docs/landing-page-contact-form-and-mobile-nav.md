# Landing Page Mobile Nav and Contact Form

This document records the launch-ready changes for the landing-page mobile navigation and the Vercel contact form flow.

## What changed

- Added a minimal mobile navigation fallback below `480px` across the landing pages.
- Added a Vercel-backed `POST /api/contact` endpoint using Next.js Route Handlers.
- Wired the contact form to submit with `fetch()` instead of showing a fake success message.
- Added loading, success, and error states for the contact form.
- Added required Vercel environment-variable documentation for the form.

## Files that control the mobile nav

- `index.html`
- `about.html`
- `contact.html`
- `rag.html`
- `customAI.html`
- `computer-vision.html`
- `intelligent-document-processing.html`

Each page contains:

- the nav markup
- the mobile nav button/panel
- the page-local nav CSS
- a small inline script that opens and closes the mobile menu

## Files that control the contact form

- `contact.html`
- `app/api/contact/route.ts`
- `.env.example`

## Contact-form flow

The contact form now submits to:

- `POST /api/contact`

The route:

- validates required fields
- validates the email address format
- sends one notification email to you using the Resend Email API
- returns JSON success or error responses

The client-side form:

- disables duplicate submissions while pending
- shows a loading label on the submit button
- shows success or error feedback
- resets only after a successful submission

## Required Vercel environment variables

Set these in both Preview and Production:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=Quantafyre Contact <contact@yourdomain.com>
```

Notes:

- `CONTACT_FROM_EMAIL` should be an address on a domain you have verified in Resend.
- `CONTACT_TO_EMAIL` is the inbox that receives the contact-form submissions.

## Local testing

Install and run the site:

```bash
npm.cmd install
npm.cmd run dev
```

Validate before pushing:

```bash
npm.cmd run build
npm.cmd run lint
npm.cmd run typecheck
```

To test the contact form locally, create `.env.local` with the same env vars from `.env.example`.

## Vercel Preview Deployment checklist

1. Push your branch to GitHub.
2. Open the Vercel Preview Deployment URL.
3. Confirm the mobile nav works on a narrow viewport.
4. Submit the contact form from the preview environment.
5. Confirm the email arrives in `CONTACT_TO_EMAIL`.
6. Only merge after preview confirms both UI and email flow.

## Updating or rotating Resend credentials

1. Generate or rotate the API key in Resend.
2. Update `RESEND_API_KEY` in Vercel Preview and Production.
3. Redeploy if needed.
4. Re-test the form from a Vercel Preview Deployment before trusting production.

## Future upgrade: email + database

This v1 launch setup does **not** store submissions in a database.

Current source of truth:

- the email received at `CONTACT_TO_EMAIL`

Recommended later path:

1. Keep `POST /api/contact` as the only public entrypoint.
2. Add a Postgres database behind the same route.
3. Insert the submission into the database server-side.
4. Keep the Resend email notification as well.

Recommended later provider:

- a Vercel Marketplace Postgres provider such as Neon

Future behavior can be:

- store each submission
- still send the email notification
- later expose a simple admin/export workflow if needed

## Known limitations

- v1 stores nothing in a database
- email delivery is the only record of a submission
- if Resend or env configuration is broken, the form will fail visibly instead of silently succeeding
