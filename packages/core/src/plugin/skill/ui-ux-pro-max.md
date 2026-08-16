---
name: ui-ux-pro-max
description: Master UI/UX design intelligence for creating stunning, production-ready, accessible, and high-converting modern web applications and websites. Use whenever designing, building, or refining user interfaces, websites, web apps, components, themes, layouts, or user experiences.
---

# UI/UX Pro Max — Master Design System & Component Intelligence

You are equipped with the **UI/UX Pro Max** design skill. When designing or implementing user interfaces, websites, or web applications, you adhere to the following gold standards of world-class digital product design.

---

## 1. Core Visual Aesthetics & Design Philosophy

1. **First-Impression Wow Factor**:
   - Every interface must feel premium, polished, state-of-the-art, and alive.
   - Avoid generic, bland, or default Bootstrap/unstyled aesthetics.
   - Employ tailored color harmony, depth, subtle border glows, and balanced whitespace.

2. **Tailored Modern Color Systems**:
   - **Dark Mode First**: Sleek dark slate/zinc canvas (`#09090b` / `#0f172a`), subtle border contrasts (`rgba(255,255,255,0.08)`), elevated glass cards (`rgba(255,255,255,0.03)` with `backdrop-blur-md`).
   - **Light Mode Elegance**: Crisp white/snow backgrounds (`#fafafa` / `#ffffff`), refined borders (`#e4e4e7`), warm neutral text (`#09090b` / `#71717a`).
   - **Vibrant Accent Palettes**:
     - Modern Indigo / Violet: `#6366f1` / `#8b5cf6`
     - Electric Emerald: `#10b981` / `#059669`
     - Sunset Amber: `#f59e0b` / `#d97706`
     - Cyan / Sky Glow: `#06b6d4` / `#0ea5e9`
   - Use HSL or OKLCH color token scales with semantically meaningful variables (`--background`, `--foreground`, `--primary`, `--muted`, `--accent`, `--border`).

3. **Typography Mastery**:
   - Prefer modern geometric and neo-grotesque sans-serif fonts:
     - **Inter**, **Geist**, **Plus Jakarta Sans**, or **Outfit**.
     - Monospace: **Geist Mono**, **JetBrains Mono**, or **Fira Code**.
   - Clear typographic scale with tight tracking on headings (`tracking-tight`) and generous line heights for body text (`leading-relaxed`).

---

## 2. Layouts & Spatial Composition

1. **Bento Grid Architecture**:
   - Group information into visually distinct, card-based grid modules with varied aspect ratios (1x1, 2x1, 2x2).
   - Use subtle hover scaling (`hover:scale-[1.01]`), border illumination, and interior gradient glows.

2. **Hero Sections that Convert**:
   - High-impact headline with gradient text clipping (`bg-clip-text text-transparent bg-gradient-to-r`).
   - Clear supporting sub-headline (max 2-3 lines).
   - Primary Call-to-Action (pulsing/glowing button) paired with a secondary subtle action.
   - Visual showcase: Interactive product preview, animated mockups, or live demo widget.
   - Social proof badges: Customer avatars, star ratings, or trusted logo ticker.

3. **Responsive Container Scaling**:
   - Mobile-first approach with fluid breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`).
   - Full touch responsiveness, comfortable tap targets (min 44x44px), and sticky mobile bottom action bars where appropriate.

---

## 3. Micro-Interactions & Motion Choreography

1. **Fluid Transitions**:
   - Use consistent timing curves: `transition-all duration-200 ease-out` for buttons and hover states; `duration-300 ease-in-out` for modals and drawers.
   - Never leave an interactive element without hover, active, and focus-visible states.

2. **Glassmorphism & Surface Depth**:
   - Layer surfaces using subtle elevation, soft shadows (`shadow-sm`, `shadow-xl shadow-primary/5`), and semi-transparent borders.

---

## 4. Production Component Library Patterns

Always construct fully typed, complete components with:
- **Buttons**: Primary (gradient/solid with glow), Secondary (outline with subtle background hover), Ghost, and Destructive. Include loading spinner state.
- **Inputs & Forms**: Clear labels, floating hints, accessible error messages with icons, inline validation, and focus rings.
- **Badges & Tags**: Rounded pills with subtle background tints and dot indicators.
- **Data Tables & Lists**: Sorting indicators, filter bars, pagination, responsive column collapse, and empty states.
- **Feedback States**:
  - **Loading**: Skeleton shimmer loaders (`animate-pulse`) mirroring exact component shapes.
  - **Empty States**: Custom icon/illustration, descriptive title, explanation, and clear action button.
  - **Error Boundaries**: Friendly error message, retry button, and issue report action.

---

## 5. Accessibility & Performance Checklist

- [x] Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
- [x] Meaningful `alt` text for images and `aria-label` for icon-only buttons.
- [x] Full keyboard navigation with visible focus rings (`focus-visible:ring-2 focus-visible:ring-primary`).
- [x] WCAG AA/AAA contrast ratios for text on backgrounds.
- [x] Zero placeholders, zero TODO comments, and 100% production-ready TypeScript code.
