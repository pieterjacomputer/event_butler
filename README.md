# Event Butler

A small web app to host personal events (birthdays, BBQs, …).
Visitors can read about an event and, where needed, RSVP or place a food order.

**Current milestone:** MVP for a birthday party with spaghetti dinner on Saturday 5 December 2026.

## Getting started

Requirements: Node.js (version in `.nvmrc`) and pnpm.

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev
```

Open http://localhost:3000.

## Scripts

| Command             | What it does                             |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Start the local development server       |
| `pnpm build`        | Production build                         |
| `pnpm lint`         | Run ESLint                               |
| `pnpm typecheck`    | Run the TypeScript compiler (no output)  |
| `pnpm format`       | Format all files with Prettier           |
| `pnpm format:check` | Check formatting (used in CI)            |
| `pnpm db:generate`  | Generate a SQL migration from the schema |
| `pnpm db:migrate`   | Apply pending migrations to the database |

## How we work

- [CONTRIBUTING.md](./CONTRIBUTING.md): the workflow, branches, commits and definition of done
- [CLAUDE.md](./CLAUDE.md): the rules for AI-assisted changes
