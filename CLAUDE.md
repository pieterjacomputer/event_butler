# CLAUDE.md — Working rules for AI assistance

This file defines how Claude works on this project. It is read at the start of every session.
These rules take priority over any suggestion Claude might want to make.

## Project context

- **What:** a web app to host events (birthdays, BBQs, …). Visitors read event info and, for some events, give input (RSVP, food orders).
- **Current phase:** MVP for the first event.
  - Event: birthday party with spaghetti dinner, **Saturday 5 December 2026**.
  - Order deadline: **Saturday 28 November 2026, 23:59 Europe/Brussels**.
  - Launch target: **Sunday 22 November 2026**.
- **After the MVP:** generic event/module system (RSVP, orders, custom questions) and multi-event admin.
- **Budget:** as close to zero as possible. Free tiers only unless the owner approves otherwise.

## Golden rules

1. **Propose before changing.** Before any change, describe which files will be created, changed or deleted, and why. Wait for explicit approval.
2. **Only change what was asked.** Never touch files, code or config outside the agreed scope, not even for "small improvements".
3. **Ideas go in a separate list.** Improvements Claude notices are reported under a heading "Suggestions (not implemented)". They are never applied without approval.
4. **No new dependencies without approval.** Name the package, the reason, and the alternative of not adding it.
5. **No deleting or renaming without approval.** This applies to files, database tables, columns and environment variables.
6. **Small steps.** One change = one pull request = one clear purpose.
7. **Explain every change.** After a change, give a short summary per file.
8. **Never handle secrets.** No keys, passwords or connection strings in code, commits or chat. Use environment variables.
9. **When in doubt, ask.** Do not assume missing requirements; ask the owner.

## Tech stack (fixed — changes require approval and an ADR)

| Area            | Choice                                                  |
| --------------- | ------------------------------------------------------- |
| Framework       | Next.js (App Router, Server Components, Server Actions) |
| Language        | TypeScript, `strict` mode                               |
| Package manager | pnpm                                                    |
| Runtime         | Current Node.js LTS                                     |
| Database        | Postgres on Neon (via Vercel Marketplace)               |
| ORM/migrations  | Drizzle ORM + drizzle-kit                               |
| Validation      | Zod (shared between client and server)                  |
| UI              | Tailwind CSS + shadcn/ui                                |
| Admin auth      | Auth.js, restricted to the owner's account              |
| Hosting         | Vercel (Hobby plan, non-commercial)                     |
| CI              | GitHub Actions                                          |

## Code conventions

- **No `any`.** Prefer explicit types at module boundaries.
- **Validate on the server.** All user input is validated server-side with Zod, even if it is also validated client-side.
- **Server first.** Use Server Components by default. Add `"use client"` only where interactivity requires it.
- **Database changes** only through Drizzle migrations, committed and reviewed in the PR.
- **Commits** follow Conventional Commits (see CONTRIBUTING.md).
- **Code is in English;** user-facing text is in Dutch.

## Privacy (GDPR)

- Collect only what an event needs: name, attendance and order. Email only if a feature requires it.
- No tracking cookies and no third-party analytics without approval.
- Guest data is deleted after the event. The retention period is agreed per event.

## Commands

| Command                             | What it does                                            |
| ----------------------------------- | ------------------------------------------------------- |
| `pnpm install`                      | Install dependencies                                    |
| `pnpm dev`                          | Start the local development server                      |
| `pnpm build`                        | Production build                                        |
| `pnpm lint`                         | Run ESLint                                              |
| `pnpm format` / `pnpm format:check` | Format files / check formatting (CI)                    |
| `pnpm typecheck`                    | Generate route types and run `tsc --noEmit`             |
| `pnpm db:generate`                  | Generate a SQL migration from `src/db/schema.ts`        |
| `pnpm db:migrate`                   | Apply pending migrations (runs on Vercel during deploy) |

The admin overview (sign-ups, headcount per part, spaghetti totals, CSV export) is at `/admin`, behind a GitHub login restricted to `ADMIN_GITHUB_ID`.

CI runs `lint`, `format:check`, `typecheck` and `build` on every PR.
