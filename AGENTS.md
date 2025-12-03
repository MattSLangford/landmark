# Repository Guidelines

## Project Structure & Assets
Bootstrap with `npm create vite@latest landmark-website -- --template react-ts`; all authored code stays in `src/`. Keep routes in `src/pages`, shared UI in `src/components`, and evergreen copy (mission, ministries, service times) in `src/content`. Put configuration helpers and Planning Center link builders in `src/lib`. Static files ship from `public/`, while the root `images/` folder currently stores the official logo plus portraits of Senior Pastor Rick and Lead Pastor Matt—compress them before moving to `public/images/`.

## Build, Test, and Development Workflow
Install deps via `npm install`, run `npm run dev` for the Vite dev server, and `npm run build` to emit the production bundle to `dist/`. `npm run preview` mimics Netlify output; run it before `netlify deploy --build` to verify redirects and forms. Guard quality with `npm run lint` (ESLint + Prettier) and keep fast feedback loops alive with `npm run test` or `npm run test -- --watch`.

## Content, Style & Naming
Use two-space indentation, TypeScript strict mode, and PascalCase filenames for components (`PrayerForm.tsx`). Helpers and hooks stay camelCase (`planningLinks.ts`, `useGivingForm.ts`). Define theme tokens under `src/styles/tokens.css` with the `--landmark-` prefix, and rely on semantic HTML, visible focus states, and ≥4.5:1 contrast. Planning Center embeds must include descriptive headings, aria-labels (“Give through Planning Center”), and copy that highlights service times, directions, ministries, and Next Steps in short sections.

## Testing Expectations
Vitest + Testing Library mirror the source tree (`src/components/Hero.tsx` ↔ `src/components/__tests__/Hero.test.tsx`). Mock Planning Center requests with MSW handlers in `src/tests/mocks/`, and add axe checks for any UI touching accessibility-critical flows. Maintain ≥80% statement coverage using `npm run test -- --coverage` before merging.

## Commit & Pull Request Process
Keep commit subjects imperative and under 72 characters (“Add Next Steps CTA”) and mention any Planning Center URLs or Netlify settings touched in the body. PRs must outline the change, attach desktop/mobile screenshots for UI work, and list the commands executed. Keep diffs small (<400 LOC) and spin out follow-up issues when scope grows.

## Integrations & Deployment
All contact, giving, and registration links come from Planning Center; never store attendee data here. Document any required extra keys in `.env.example`, but keep secrets local. Netlify deploys from `dist/`; verify forms, redirects, and Lighthouse scores (target 90+) before announcing a release.
