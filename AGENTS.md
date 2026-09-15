# AGENTS.md

Operating guide for anyone — human or AI agent — working on the **3D'omics
project website**. This repository and the [3D'omics Data Portal][database-repo]
are a paired public surface: their shared navigation and footer must retain the
same layout, visual tokens, interaction behaviour, theme preference, funding
copy, contact links, privacy link, and social-link set.

[database-repo]: https://github.com/3d-omics/database

## Repository relationship

- Main website: `3d-omics/3d-omics.github.io` — this repository, deployed at
  `https://www.3domics.eu/`.
- Data portal: `3d-omics/database`, deployed at `https://www.3domics.eu/database/`.
- In the standard local checkout the portal is the sibling directory `../database`.
  Read its [`AGENTS.md`](../database/AGENTS.md) in full before changing either
  shared shell. The portal is the implementation source of truth for that shell.
- The portal builds with Vite, React, TypeScript, Tailwind and daisyUI. This
  repository is a dependency-free, static Mobirise export; do not introduce a
  framework or build step merely to share the shell.

## Structure and editing rules

The site consists of root-level static HTML pages and assets under `assets/`.
Mobirise has emitted an old page-local navigation and footer into every HTML
file. The actual shared shell is injected by:

```text
assets/theme/css/portal.css  # shared visual tokens and responsive layout
assets/theme/js/portal.js    # shared navigation, footer, menu and theme control
```

Every root HTML page must load both files. The legacy `.menu1`, `.footer1`, and
`.footer2` blocks are intentionally hidden by the shared stylesheet; keep them
in place so the project remains editable in Mobirise. Do not make a one-page
navigation or footer change in those legacy blocks.

When changing shared chrome:

1. Read `../database/AGENTS.md` and inspect the portal components it names:
   `src/components/Navbar/`, `src/components/Footer/`, `src/components/ThemeToggle/`,
   `src/components/ThemeProvider/`, and `src/components/SocialIcons/`.
2. Preserve parity at desktop and mobile breakpoints. The labels and destinations
   may differ by site, but the component hierarchy, spacing, colours, typography,
   active/hover/focus states, dropdown/drawer behaviour, and footer arrangement
   must match.
3. Preserve the portal's theme contract: use the shared `theme` local-storage key,
   support `system`, `light`, and `dark`, resolve system preference with
   `prefers-color-scheme`, and keep the `data-theme` attribute on `<html>`.
4. Keep external links safe and clear: use meaningful `alt` text and `aria-label`s;
   add `rel="noopener noreferrer"` whenever an external link uses `target="_blank"`.

## Data, deployment, and scope

- This repository holds no Airtable credentials and does not render catalogue
  data. Data-pipeline, catalogue, generated-data, and database schema changes
  belong in `3d-omics/database` and, where applicable,
  [database-build](https://github.com/3d-omics/database-build).
- Never hand-copy generated portal data into this static site. The portal's
  `catalog.json` pin and its checked release pipeline are deliberately separate.
- Keep page content, images, and outbound links static and relative where
  appropriate. Retain the `/database/` link as an absolute production URL so it
  works from all root pages.
- Pushing `main` publishes the public site. Work on a branch and inspect the
  final diff before committing. Do not add `dist/`, rendered portal data, or
  machine-specific files such as `.DS_Store`.

## Verification

There is no project build or test command for this static export. Before handing
off a shared-shell change:

```bash
git diff --check
rg -l 'portal-design-layer' --glob '*.html'
rg -l 'assets/theme/js/portal.js' --glob '*.html'
```

Serve the root with a local static server and visually verify at least one main
page at desktop and mobile widths. Check the portal in parallel when available:
navigation/dropdowns or drawer, active state, theme cycle, footer alignment,
funding text, policy/contact links, and all four social links must be equivalent.

The portal's own quality gate remains applicable to portal changes: regenerate
its pinned data when required, then run `npx tsc --noEmit`, `npx vitest run`, and
`npm run build`; its documented four existing type errors are the only allowed
baseline. Record portal changes in its `CHANGELOG.md` under `Unreleased`.
