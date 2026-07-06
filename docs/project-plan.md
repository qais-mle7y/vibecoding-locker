# Personal VibeCoding Locker — Project Plan

## 1. Project Summary
**Personal VibeCoding Locker** is a private web app for storing, tagging, searching, and quickly reusing technical assets.

## 4. MVP Scope
### MVP Must-Haves
- Authentication.
- Create, read, update, delete locker items.
- Item categories.
- Tags.
- Search.
- Copy-to-clipboard.
- Favorite items.
- Recently used items.
- Basic dashboard.
- Responsive UI.
- Import/export as JSON.
- Browser extension MVP or in-app quick overlay.

## 5. Free-First Tech Stack
- **Frontend**: Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: Supabase Free Plan (Auth, Database, RLS).
- **Hosting**: Netlify / Vercel Free Plan.

## 8. Main Item Types
- `code_snippet`
- `shell_command`
- `ai_prompt`
- `agent_skill`
- `project_idea`
- `config`
- `debug_fix`
- `note`

## 9. Database Design
Supabase PostgreSQL tables: `profiles`, `locker_items`, `tags`, `locker_item_tags`, `collections`, `locker_item_collections`, `usage_events`.
All protected by Row Level Security (RLS).

## 28. Build Order
1. Create repo.
2. Install/load AI design skills in Antigravity.
3. Create `docs/design-system.md` using Gemini + `ui-ux-pro-max` + Taste Skill.
4. Create Next.js app.
5. Add Tailwind + shadcn/ui.
6. Create Supabase project.
7. Add Supabase environment variables.
8. Add Supabase browser/server clients with `@supabase/ssr`.
9. Add Supabase Auth pages and middleware.
10. Create schema migrations.
11. Add profile trigger.
12. Add RLS policies.
13. Generate Supabase TypeScript types.
14. Test auth and two-user data isolation.
15. Add dashboard shell.
16. Build locker CRUD.
17. Add tags.
18. Add search.
19. Add copy tracking.
20. Add command palette.
21. Add import/export.
22. Polish UI using the UI quality gates.
23. Add tests.
24. Deploy.
25. Build browser extension.
