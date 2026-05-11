# Quantafyre Next.js Site

This project runs on Next.js, but the current homepage and about page are intentionally kept in an exact-design, pixel-locked mode so the visuals do not drift while the project grows.

## Source of truth

- `/` is sourced from `index.html`
- `/about` is sourced from `about.html`
- `public/uploads/` serves the image assets
- `app/` provides routing, metadata, errors, and future scalability
- `lib/legacy-pages.ts` is the registry that tells Next which HTML file belongs to which route

## Project structure

```text
app/
  (marketing)/
    [slug]/
    layout.tsx
    page.tsx
  error.tsx
  globals.css
  loading.tsx
  not-found.tsx
components/
  legacy/
config/
  site.ts
lib/
  legacy-pages.ts
public/
  uploads/
index.html
about.html
```

## How to edit the current site

Change the live design in:

- `index.html`
- `about.html`

Save and refresh the browser. The Next routes read from those files directly.

## How to add a new page later

1. Create a new HTML file in the project root, for example `services.html`
2. Add a new entry in `lib/legacy-pages.ts`
3. Run the dev server and open the route

Example idea:

```ts
services: {
  fileName: "services.html",
  slug: "services",
}
```

That will make the page available at `/services` through the shared dynamic route.

Once a page is registered there, links like `href="services.html"` or
`href="services.html#section-name"` will also be rewritten to Next routes
automatically.

## How to run it

1. Install dependencies:

```bash
npm install
```

If PowerShell blocks `npm` scripts on your machine, use:

```bash
npm.cmd install
```

2. Start the dev server:

```bash
npm run dev
```

Or in PowerShell:

```bash
npm.cmd run dev
```

3. Open:

```text
http://localhost:3000
```

## Helpful scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run check
```

## Environment

Copy `.env.example` to `.env.local` if you want to set a production site URL:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Launch notes

For the landing page mobile navigation and the Vercel/Resend contact form setup, see:

- `docs/landing-page-contact-form-and-mobile-nav.md`
