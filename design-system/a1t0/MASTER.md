# A1t0 Design System - MASTER

Source: current implementation in `AitoSama/myportfolio` (Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion, Firebase).
Status: documentation of the existing implementation. This document does not define a redesign.

## Changes since last pass

- Confirmed the core monochrome, software-window, hard-border, offset-shadow, and typography conventions remain in active public-site code.
- Added the current global dotted background (`app/globals.css:114-115`) and `.pattern-dots` / `.pixel-corners` utilities (`app/globals.css:129-143`), which were absent from the prior snapshot.
- Corrected motion notes: most animated public pages use Framer Motion entrance transitions, but the home visual has an `animate` prop without an `initial` prop (`components/HomeContent.tsx:57-62`).
- Recorded the current drift between public styling and semantic tokens: raw `gray-*`, `shadow-xl`, `rounded-*`, gradients, and plain gallery cards remain in the implementation.
- Clarified that `components.json` and Radix-based UI utilities exist, but there is still no shared public `Button` component.
- Documented the duplicated `src/components/components/WindowFrame.tsx` implementation as a maintenance inconsistency.

## 1. Design Principles

### A. Existing Design System

- The public portfolio uses a software-window metaphor. `WindowFrame` supplies a titlebar, file-like title, decorative window dots, black border, and offset shadow (`components/WindowFrame.tsx:12-20`).
- The visual language is monochrome-first. Green is used as a small status signal in the home HUD (`components/HomeContent.tsx:70-75`), while red is reserved for destructive admin states (`components/admin/DeleteConfirmationDialog.tsx:39-45`).
- The public experience combines editorial typography and generous layout with anime/character-sheet presentation, including `character_sheet.png`, `LVL 24 CREATIVE DEV`, and status UI (`components/HomeContent.tsx:57-81`, `app/about/page.tsx:20-29`).
- Public UI favors tactile, hard-edged construction: 1px black borders, zero-blur offset shadows, and square surfaces.

### B. Inconsistencies

- The global stylesheet now uses a dotted radial page background (`app/globals.css:114-115`), so the system is not strictly flat monochrome as previously described.
- The about page uses a black-to-transparent gradient overlay (`app/about/page.tsx:27`) and the home page uses translucent blurred HUD treatment (`components/HomeContent.tsx:70`); these are isolated effects rather than the dominant system language.
- `src/components/components/WindowFrame.tsx` duplicates the public `components/WindowFrame.tsx` implementation. This creates two possible ownership locations for the same primitive.

### C. Recommendations

- Treat the dotted background and any future texture as an explicit secondary surface token in documentation if it is intended to remain part of the brand.
- Decide whether the about-page image gradient is a deliberate editorial exception. If not, replace it with a solid monochrome treatment in a future UI task.

## 2. Visual Style

### A. Existing Design System

- The active public style is a hybrid of editorial portfolio, brutalist/software UI, and anime creative portfolio.
- Large headings, wide whitespace, monospace metadata, file-like labels, HUD status language, grayscale imagery, and rotated image framing are all present (`components/HomeContent.tsx:26-43`, `components/HomeContent.tsx:57-81`).
- The system is not a generic SaaS dashboard and does not use a dominant brand hue.

### B. Inconsistencies

- The plain bordered gallery archive cards (`app/works/gallery/page.tsx:48-65`) do not use `WindowFrame`, unlike project cards and most detail/form surfaces.
- Some public controls use soft utility styling or blurred effects (`app/works/page.tsx:14-20`, `components/HomeContent.tsx:70`) that are less consistent with the hard-edge core.

### C. Recommendations

- Keep new public surfaces within the existing software-window and hard-border vocabulary. Do not introduce gradients, rounded cards, glassmorphism, or new accent colors as default patterns.

## 3. Color

### A. Existing Design System

- `app/globals.css:20-105` defines light and dark HSL tokens for background, foreground, card, primary, secondary, muted, accent, destructive, border, input, and ring.
- The light palette is near-white/black grayscale with a semantic destructive red. The dark palette is defined under `.dark` but no public theme control was found.
- The body uses `bg-background text-foreground`; the root layout also applies those tokens to `main` (`app/layout.tsx:41-43`).

### B. Inconsistencies

- Public pages frequently bypass tokens with `bg-gray-*`, `text-gray-*`, `border-gray-*`, `bg-white`, and `bg-black` (`components/ProjectCard.tsx:13-43`, `app/contact/page.tsx:45-73`, `app/works/projects/[slug]/page.tsx:32-73`).
- The global radial-dot background hardcodes `#e5e7eb` (`app/globals.css:114-115`), so it does not adapt to the dark token set.
- The home status dot uses `text-green-600` (`components/HomeContent.tsx:73`), an intentional semantic signal but outside the monochrome token set.

### C. Recommendations

- For future public work, prefer the existing semantic tokens over new raw gray utilities, while preserving hard black borders where that is the established public convention.
- If dark mode is ever wired up, audit hardcoded white/black surfaces and the dotted background together; do not assume the existing `.dark` variables are sufficient.

## 4. Typography

### A. Existing Design System

- Geist Sans and Geist Mono are loaded in `app/layout.tsx:2-15` and mapped to `--font-sans`, `--font-heading`, and `--font-mono` in `app/globals.css:7-9`.
- Sans is used for headings and readable content; monospace is used for metadata, navigation, labels, dates, categories, and file/window chrome.
- The practical scale is hero `text-5xl md:text-7xl` (`components/HomeContent.tsx:26`), page headings `text-4xl` or `text-4xl md:text-5xl` (`app/works/projects/page.tsx:25`, `app/contact/page.tsx:39`), and compact mono labels in `text-xs`/`text-sm`.
- Headings receive `font-heading tracking-tight` globally (`app/globals.css:120-126`).

### B. Inconsistencies

- Heading weight and tracking are not fully centralized; pages mix `font-bold`, `font-semibold`, `tracking-tight`, and `tracking-tighter`.
- Admin pages use regular sans headings and font weights (`app/admin/login/page.tsx:58-64`) rather than the more expressive public heading treatment. This appears to be a separate admin register, but it is not formally named in code.

### C. Recommendations

- Preserve the sans-for-content / mono-for-system split. A future token pass could name heading sizes and public/admin registers without changing the visual identity.

## 5. Spacing & Layout

### A. Existing Design System

- Top-level public pages consistently use `pt-24 pb-20 container mx-auto px-6`, with narrower content limits such as `max-w-3xl`, `max-w-5xl`, and `max-w-xl` (`app/about/page.tsx:10`, `app/contact/page.tsx:30`, `app/works/projects/[slug]/page.tsx:25`).
- Public grids use one column on small screens and switch at `md` to two or three columns (`app/works/gallery/page.tsx:46`, `components/HomeContent.tsx:93`).
- Window contents commonly use `p-5` or `p-8`; major page splits use `gap-8` or `gap-12`.
- The home page is the only public page using the wider `lg:grid-cols-12` hero split (`components/HomeContent.tsx:19`).

### B. Inconsistencies

- There is no single shared page-shell component, so padding and max-width choices are repeated and can drift.
- Gallery archive cards use `p-6`, project cards use an internal `p-5`, and detail/form surfaces use `p-8`; this is a deliberate density range but is not tokenized.

### C. Recommendations

- Keep the existing `md`-first responsive behavior unless a concrete layout issue requires another breakpoint. Tokenize page-shell and surface spacing only when shared abstractions are already being changed.

## 6. Borders & Shadows

### A. Existing Design System

- `WindowFrame` establishes the strongest public pattern: `border border-black` plus `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`, growing to a 6px offset on hover (`components/WindowFrame.tsx:12`).
- Public window chrome uses a black bottom border, square surfaces, and a `h-8` titlebar (`components/WindowFrame.tsx:13`).
- Most public surfaces use no radius. The titlebar dots are the main visible rounded shapes (`components/WindowFrame.tsx:16-18`).

### B. Inconsistencies

- Several public callers add `hover:shadow-xl`, which introduces a blurred shadow and overrides the established zero-blur language (`components/ProjectCard.tsx:13`, `app/works/page.tsx:14-20`).
- Gallery cards and home selected-work cards use plain `border border-black` without the window frame or offset shadow (`app/works/gallery/page.tsx:48`, `components/HomeContent.tsx:95`).
- Radix-derived toast and tooltip utilities use `rounded-md` and `shadow-lg` (`components/ui/toast.tsx:26`, `components/ui/tooltip.tsx:21`).
- The contact copy button uses `rounded` (`app/contact/page.tsx:48`), which is a public radius drift.

### C. Recommendations

- If the public hard-edge language is the source of truth, replace future `shadow-xl` additions with the established offset-shadow pattern and avoid adding new rounded/blurred public primitives.
- Keep admin/Radix utility styling separate only if that distinction is intentional and documented.

## 7. Components

### A. Existing Design System

- `WindowFrame` is the core public primitive and wraps project cards, archive hub cards, detail pages, forms, and the home visual.
- `ProjectCard` uses a `WindowFrame`, grayscale-to-color image treatment, metadata footer, and a project detail link (`components/ProjectCard.tsx:9-48`).
- `Navigation` is fixed, translucent, mono-labeled, and switches to a mobile menu below `md` (`components/Navigation.tsx:21-66`).
- Works is a hub for Projects and Gallery through two `WindowFrame` cards (`app/works/page.tsx:10-24`); top-level navigation remains Home, Works, About, Contact.
- Admin forms/dialogs use semantic tokens and Radix-compatible patterns, visibly separate from the public creative register (`components/admin/DeleteConfirmationDialog.tsx:25-50`).

### B. Inconsistencies

- `components.json` exists, but there is no shared public `Button` component. CTA classes are repeated by hand (`components/HomeContent.tsx:40-47`, `app/contact/page.tsx:81`).
- `components/WindowFrame.tsx` and `src/components/components/WindowFrame.tsx` duplicate the same component.
- Gallery cards do not reuse `ProjectCard` or `WindowFrame` (`app/works/gallery/page.tsx:48-65`).
- WindowFrame titlebar dots look like controls but are noninteractive (`components/WindowFrame.tsx:15-19`).

### C. Recommendations

- A shared button primitive is a possible future consistency improvement, but it is not currently part of the public design system and should not be introduced as part of documentation.
- Consolidate the duplicate WindowFrame only in a separate implementation task after confirming imports.

## 8. Interaction & Motion

### A. Existing Design System

- Framer Motion is used for page/section entrance fades and small horizontal or vertical offsets in About, Contact, Home, and Projects (`app/about/page.tsx:12-19`, `app/contact/page.tsx:33-40`, `components/ProjectsContent.tsx:64-72`).
- CSS transitions handle grayscale-to-color, scale, underline, opacity, rotation, and shadow changes (`components/ProjectCard.tsx:13-43`, `components/HomeContent.tsx:57-81`).
- The home status dot is the only intentionally continuous public animation (`components/HomeContent.tsx:73`).
- Navigation exposes correct mobile menu state through `aria-expanded`, `aria-controls`, and an accessible label (`components/Navigation.tsx:45-51`).

### B. Inconsistencies

- Reduced-motion handling is absent: no `prefers-reduced-motion` rule or Framer Motion `useReducedMotion` usage was found.
- The home visual has `animate={{ opacity: 1, y: 0 }}` but no `initial` prop (`components/HomeContent.tsx:57-62`), unlike the neighboring hero content.
- `animate-pulse` is also used for loading skeletons (`app/works/projects/loading.tsx:3-9`, `app/works/gallery/loading.tsx:3-9`); those are functional loading states, not brand motion.

### C. Recommendations

- Add reduced-motion handling before expanding animation coverage.
- Keep motion limited to entrance and interaction feedback; do not add ambient loops beyond semantic status/loading states.

## 9. Responsive Behavior

### A. Existing Design System

- `md` is the primary responsive breakpoint. Navigation changes at `md` (`components/Navigation.tsx:28-47`), grids collapse below `md`, and the home hero uses `lg` for its 12-column split (`components/HomeContent.tsx:19`).
- Images use Next Image `sizes` values for responsive loading (`components/ProjectCard.tsx:17-19`, `app/works/gallery/page.tsx:51-55`).
- Mobile navigation is a full-width stacked panel with the same link list as desktop.

### B. Inconsistencies

- The implementation is not limited to one breakpoint: `sm` is used in generated utility components such as toast placement (`components/ui/toast.tsx:23`) and `lg` is important to the home hero.
- Some text and action rows rely on wrapping rather than a documented responsive component pattern, for example project detail actions (`app/works/projects/[slug]/page.tsx:44-57`).

### C. Recommendations

- Validate long project titles, metadata, and action labels at narrow widths before adding new content. Keep stable aspect ratios for image and card surfaces.

## 10. Accessibility

### A. Existing Design System

- Navigation mobile controls expose state and purpose through ARIA attributes (`components/Navigation.tsx:45-51`).
- Social links use labels and titles on the home page (`components/HomeContent.tsx:51-53`).
- Loading and error states expose `role="status"`, `aria-label`, `aria-live`, or `role="alert"` where appropriate (`app/works/projects/loading.tsx:3`, `app/admin/projects/page.tsx:195-216`).
- The delete dialog uses `role="alertdialog"`, `aria-modal`, and labelled/describedby references (`components/admin/DeleteConfirmationDialog.tsx:25-33`).

### B. Inconsistencies

- WindowFrame decorative dots resemble close/minimize/maximize controls but are not buttons and have no explanatory semantics (`components/WindowFrame.tsx:15-19`).
- Unavailable project actions are styled spans without `aria-disabled` or explanatory text (`app/works/projects/[slug]/page.tsx:49-54`).
- Several hand-written public controls use `focus:outline-none` or provide no custom focus treatment (`app/contact/page.tsx:62-73`), leaving keyboard focus inconsistent.
- Small raw-gray mono labels are used in several public surfaces (`app/contact/page.tsx:45-73`, `components/ProjectCard.tsx:24-43`); their contrast should be checked at actual rendered size.

### C. Recommendations

- Add a consistent visible focus style to public links, buttons, and form controls.
- Give unavailable actions an explicit disabled semantic or render them as explanatory text rather than control-like spans.
- Add reduced-motion behavior as an accessibility improvement.

## 11. Anti-patterns

### A. Existing Design System

- The intended public identity avoids dominant brand color, pill UI, soft card shadows, and generic SaaS/glass styling.
- Monospace metadata, square surfaces, black borders, grayscale imagery, and restrained motion remain the reliable positive constraints.

### B. Inconsistencies

- Existing code already contains the documented anti-patterns in isolated places: gradient overlay (`app/about/page.tsx:27`), blurred backdrop (`components/HomeContent.tsx:70`), `shadow-xl` (`components/ProjectCard.tsx:13`), rounded Radix utilities (`components/ui/toast.tsx:26`), and raw gray public styling (`app/works/projects/[slug]/page.tsx:32-73`).
- Therefore these are not safe blanket statements about the entire current codebase; they are preferred constraints with known exceptions/drift.

### C. Recommendations

- Do not extend these isolated exceptions into new public components. Any future exception should be intentional, local, and documented.

## 12. Design Tokens

### A. Existing Design System

- Real CSS tokens are defined in `app/globals.css:7-39` and `app/globals.css:44-105`: color tokens, font tokens, and radius tokens (`--radius-sm: 0px`, `--radius-md: 2px`, `--radius-lg: 4px`).
- Tailwind v4 is configured through `@import "tailwindcss"` and `@theme inline` in `app/globals.css`; no separate `tailwind.config.*` file is present in the repository snapshot.
- The offset shadow values are established directly in `WindowFrame` rather than named CSS tokens.

### B. Inconsistencies

- The public hard-border and offset-shadow values are repeated as arbitrary utilities instead of semantic tokens (`components/WindowFrame.tsx:12`).
- Raw gray and black/white utilities coexist with semantic token usage across public and admin code.
- `--radius` is `0.25rem` while the Tailwind radius tokens define square-to-near-square values (`app/globals.css:41`, `app/globals.css:33-35`), creating a small token ambiguity.

### C. Recommendations

- Consider naming hard border and offset shadow tokens only when a code change already needs to touch the shared primitive.
- Keep admin semantic tokens and public hard-edge tokens as separate documented registers unless the visual systems are intentionally unified.

## 13. Page-Specific Notes

### A. Existing Design System

- Home is the only page combining the split hero, rotated `WindowFrame` character visual, status HUD, social links, and selected-work strip (`components/HomeContent.tsx:19-101`).
- Works is a hub with two archive links (`app/works/page.tsx:10-24`).
- Projects has Firestore-backed published content, category filtering, `ProjectCard`, and staggered entrance motion (`components/ProjectsContent.tsx:13-72`).
- Gallery has Firestore-backed published artwork and plain bordered image cards (`app/works/gallery/page.tsx:9-65`).
- Project and artwork detail pages share the `WindowFrame`, image header, content/sidebar split, metadata-heavy treatment, and back link pattern (`app/works/projects/[slug]/page.tsx:25-75`, `app/works/gallery/[slug]/page.tsx:24-65`).
- Contact is the only public live form and includes copy-email behavior plus a not-yet-configured submit state (`app/contact/page.tsx:10-83`).
- Admin pages intentionally use a quieter semantic-token register with standard borders and shadows (`app/admin/page.tsx:8-27`, `components/admin/DeleteConfirmationDialog.tsx:25-50`).

### B. Inconsistencies

- Gallery listing cards diverge from project listing cards by omitting WindowFrame and offset shadow.
- Project and artwork detail pages still use raw gray placeholders, metadata, and disabled-action styling rather than the semantic token system (`app/works/projects/[slug]/page.tsx:32-73`, `app/works/gallery/[slug]/page.tsx:33-34`).
- Public contact controls include the only obvious rounded public element (`app/contact/page.tsx:48`).
- The detail pages resolve related records through `lib/data.ts` while primary published records come from data-access modules, so the intended data-access boundary is not completely uniform (`app/works/projects/[slug]/page.tsx:5-16`, `app/works/gallery/[slug]/page.tsx:5-18`).

### C. Recommendations

- A shared project/artwork detail layout could reduce duplication, but it is a future refactor, not an existing system rule.
- A future consistency pass could align gallery cards, detail placeholders, and public form controls with the established hard-edge/token choices without changing the portfolio identity.
