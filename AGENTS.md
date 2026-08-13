# GKN V2 — Permanent System Architecture & UI Alignment Rules

## 1. Project Identity & Architecture
- **Project Name:** GKN V2 (Never rename, never convert to GKN V3, never reference GKN V3).
- **Theme & Aesthetics:** Dark luxury cyberpunk, glassmorphism, Electric Cyan (`#00D9FF`), Neon Pink (`#FF2ED1`), clean minimal typography.
- **Store Types Supported:** GroupBuy (batch open/close), OnHand (in-stock immediate), MOQ (minimum order bulk).
- **Primary Currency:** PHP ₱ (large & prominent); Secondary Currency: USD $ (smaller underneath). 1 Kit = 10 Vials.

## 2. Global UI Alignment & Consistency Directive
Every UI component, form field, button, label, and layout container MUST strictly adhere to grid alignment:

### Grid & Layout Structure
- **Labels, Inputs & Helper Text:** Form inputs MUST share identical vertical alignment, heights (`px-3.5 py-2` / `h-10`), font sizes, and border radii (`rounded-xl` or `rounded-lg`).
- **3-Part Stack:**
  1. `LABEL` (top font-semibold text-slate-300)
  2. `INPUT / SELECT / TOGGLE` (aligned h-10 container)
  3. `HELPER / EXAMPLE TEXT` (bottom static explanation text font-mono text-slate-500)
- **Buttons & Actions:** Modal and row action buttons MUST align cleanly to the baseline of their adjacent input rows or section headers.
- **Container Radius Nesting:** Outer radius MUST mathematically exceed or equal inner radius minus padding. No arbitrary margins or pixel hacks.

## 3. Global Zero-Hover-Tooltip Rule
- **NO FLOATING HOVER POPUPS:** No tooltips, floating explanation cards, popovers, mouseenter information boxes, or floating help panels anywhere in the application.
- **STATIC EXPLANATION ONLY:** All user guidance text MUST be rendered directly in the page flow underneath the corresponding field as clean static helper text.
- **INFO ICONS:** Do not render dummy question-mark or info icons that exist solely for hover triggers.

## 4. Responsive Layout Rules
- **Mobile First:** Mobile layout uses a clean 1-column stack (`grid-cols-1`).
- **Tablet & Desktop:** Adaptable 2-column grids (`sm:grid-cols-2`, `lg:grid-cols-3`) with full flex-wrap tab headers (no forced horizontal scrolling for navigation).
- **Universal Navigation:** Universal hamburger drawer on all viewports for consistent menu access.
