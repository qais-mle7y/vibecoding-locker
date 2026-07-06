# AI Design Workflow

## Master Prompt for Antigravity / Gemini

You are building VibeCoding Locker, a free-first personal developer locker for code snippets, shell commands, AI prompts, agent skills, configs, debug fixes, and project ideas.

Use the project plan in docs/project-plan.md as the source of truth.
Use ui-ux-pro-max as the main UI/UX design-system skill.
Use Taste Skill design-taste-frontend as the anti-generic visual quality skill.

Before writing UI code:
1. Read the project plan.
2. Read the installed ui-ux-pro-max skill instructions.
3. Read the installed Taste Skill design-taste-frontend instructions.
4. Create or update docs/design-system.md.
5. Explain the design direction briefly.

Then implement the UI using:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase-ready structure
- pnpm

Design constraints:
- Free tools only.
- No paid APIs.
- No paid UI kits.
- No premium assets.
- No generic SaaS template look.
- No childish gradients or fake 3D art.
- Make it feel like Raycast + Linear + GitHub + shadcn/ui.
- Dense, fast, keyboard-first, developer-focused.
- Dark mode first, but support light mode cleanly.
- Every screen must have loading, empty, and error states.
- Every action must have clear feedback.
- Components must be reusable and cleanly organized.

For every screen you build, run a final UI audit:
- Is hierarchy clear?
- Is spacing consistent?
- Are actions obvious?
- Does it avoid generic AI slop?
- Is keyboard navigation considered?
- Does it work on mobile and desktop?
- Are empty/loading/error states handled?
- Is the code clean and maintainable?

## Screen Prompts

### Prompt 1 — Design System
Read docs/project-plan.md. Use ui-ux-pro-max and Taste Skill. Create docs/design-system.md for VibeCoding Locker. Define visual language, tokens, typography, spacing, motion, layout rules, component rules, and UI quality gates. Do not code yet.

### Prompt 2 — App Shell
Using docs/project-plan.md and docs/design-system.md, build the authenticated app shell: sidebar, top search/command bar, theme toggle, main content container, responsive mobile nav, and reusable layout components. Use Next.js App Router, Tailwind, and shadcn/ui. Follow ui-ux-pro-max and Taste Skill.

### Prompt 3 — Dashboard
Build the dashboard screen for VibeCoding Locker. Include total items, favorites, recently copied, most-used item, top tags, item type breakdown, and a recent activity area. Use polished dense dashboard design, not generic cards. Include loading, empty, and error states.

### Prompt 4 — Locker Library
Build the main locker library screen. Requirements: global search, type filters, tag filters, favorite filter, grid/list toggle, item cards, compact metadata, copy button, favorite button, and create button. Make it keyboard-friendly and dense like a serious developer tool. Follow ui-ux-pro-max and Taste Skill.

### Prompt 5 — Create/Edit Item
Build the create/edit locker item form. Fields: title, type, description, content, language, framework, source URL, tags, collection, favorite toggle. Use React Hook Form and Zod. Make the content editor comfortable for code, commands, prompts, and configs. Include validation states and autosave-ready structure.

### Prompt 6 — Item Detail
Build the item detail page. Show title, type, metadata, tags, full content with syntax highlighting, notes, copy action, edit action, archive/delete actions, and usage stats. Make code blocks feel premium and highly usable.

### Prompt 7 — Command Palette
Build the Ctrl+K / Cmd+K command palette. It must search items, copy selected content, open item details, create new item, filter by type, and support keyboard navigation. This is a core product feature, not decoration.

### Prompt 8 — Browser Extension Popup
Build the browser extension popup UI for VibeCoding Locker. It should search locker items, filter by type, copy content, and open the full app. Keep it compact, fast, and keyboard-first. Use the same design system as the web app.
