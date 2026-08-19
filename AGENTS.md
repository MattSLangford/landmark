# Landmark Church Website

This repository contains the static website for Landmark Church in Lafayette, Louisiana. It is plain HTML and CSS with small inline JavaScript enhancements; there is currently no package manager, application framework, build step, or automated test suite.

## Project Structure

- `index.html` — public homepage with visit information, ministries, leadership, and Church Center links.
- `giving.html` — giving information and links to Church Center Giving.
- `tap.html` — mobile-friendly public quick-links page used by the `/hello` and `/hi` redirects.
- `hello.html` — separate welcome and next-steps page; it is not served by the current `/hello` redirect.
- `portal.html` — internal staff link hub for Planning Center and other church resources. It contains its own embedded styles.
- `404.html` — static not-found page.
- `styles.css` — shared styles for the main public pages.
- `images/` — church logo, homepage hero image, and pastor portraits.
- `_redirects` — host-level redirects and giving aliases.
- `robots.txt`, `site.webmanifest`, favicon files, and verification files — search, browser, and site-ownership metadata.

## Local Preview

No installation or build is required. From the repository root, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Python's local server does not process `_redirects`; test those rules on a compatible static host or deployed preview.

## Editing Conventions

- Keep the site dependency-light. Do not introduce a framework, package manager, or build system unless the user explicitly approves a migration.
- Preserve the existing responsive layout, semantic HTML, skip links, keyboard focus states, descriptive alternative text, and accessible labels.
- Reuse the existing CSS variables and component classes in `styles.css` before adding new patterns.
- Shared navigation and footer markup is duplicated across pages. When changing either, check every public page for consistency.
- Keep page metadata accurate: title, description, canonical URL, Open Graph fields, and any `noindex` directives.
- Compress new production images and provide meaningful `alt` text.

## Integrations and Data

- Planning Center and Church Center are the system of record for contact forms, giving, registrations, events, groups, profiles, and livestream content.
- Use Church Center links or its modal attributes for interactive flows; do not collect or store attendee data in this repository.
- Preserve `target="_blank"` links with `rel="noopener"`.
- Google tag scripts and site-verification files are production integrations. Do not remove or change their IDs without explicit direction.
- `portal.html` is labeled internal but is a static page with no authentication in this repository. Do not add sensitive information or secrets to it.

## Verification

There are no automated checks. After a change:

1. Preview the affected pages in a browser at desktop and mobile widths.
2. Check navigation, focus behavior, images, and internal links.
3. Confirm Church Center links and modal-trigger attributes still point to the intended destinations.
4. If redirects changed, verify them on a compatible hosted preview because the local Python server ignores `_redirects`.
5. For content shared across pages, search the repository for stale copies before reporting completion.

## Deployment

The checked-in files are deployable directly as a static site. The repository contains Netlify-style `_redirects`, but it does not currently include a documented deployment command or build configuration. Do not claim a deployment succeeded without verifying the live site independently.
