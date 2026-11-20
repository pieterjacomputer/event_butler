# Contributing

How changes move from idea to production in this project.

## Workflow

1. **Request.** The owner describes what is needed.
2. **Proposal.** The scope is written down: files affected, approach, new dependencies (if any).
3. **Approval.** The owner explicitly approves the proposal. No work starts before this.
4. **Branch.** Create a branch from `main`.
5. **Pull request.** Open a PR using the template and fill in the checklist.
6. **CI.** All checks must pass.
7. **Preview.** Vercel builds a preview URL, and the owner tests the change there.
8. **Merge.** Squash-merge into `main` after the owner's approval.
9. **Deploy.** Merging to `main` deploys to production automatically.

`main` is protected:

- No direct pushes.
- A PR and passing CI are required.

## Branch names

| Prefix   | Use for                       | Example                     |
| -------- | ----------------------------- | --------------------------- |
| `feat/`  | New functionality             | `feat/spaghetti-order-form` |
| `fix/`   | Bug fixes                     | `fix/deadline-timezone`     |
| `chore/` | Tooling, config, dependencies | `chore/setup-ci`            |
| `docs/`  | Documentation only            | `docs/privacy-notice`       |

## Commit messages

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional scope): <short description>

feat(orders): add portion selection to order form
fix(admin): correct totals when an order is edited
chore(ci): add typecheck step
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`.

## CI checks (MVP)

Every PR must pass:

- Lint and format check
- Type check (`tsc --noEmit`)
- Build

To be added after the MVP:

- Unit tests (Vitest)
- End-to-end tests (Playwright) against the preview deployment

## Definition of done

A change is done when:

- [ ] It does exactly what was approved — nothing more
- [ ] CI is green
- [ ] It was tested on the Vercel preview URL
- [ ] It works on mobile and desktop
- [ ] Database changes come with a reviewed migration
- [ ] New environment variables are documented in `.env.example`
- [ ] No secrets are committed

## Environment variables and secrets

- **Local:** `.env.local`. It is never committed and is already in `.gitignore`.
- **Template:** `.env.example`. It is committed and lists every variable with a dummy value.
- **Preview and production:** set in the Vercel project settings.
- **If a secret is ever committed:** rotate it immediately. Removing the commit is not enough.

## Database migrations

1. Change the schema in code.
2. Generate a migration with `drizzle-kit generate`.
3. Commit the generated SQL and review it in the PR.
4. The migration is applied during deployment.

Destructive migrations, meaning dropping or renaming tables or columns, need explicit owner approval.
