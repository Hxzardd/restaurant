# Decision Log

Major decisions made during the professional rework (branch `rework/dash-inspired-restaurant-ui`).
Each entry: what changed, why, alternatives, risk, scope impact.

## 1. Single package manager: npm
- **Change**: Deleted root `pnpm-lock.yaml` and the stub root `package-lock.json`; kept the root `package.json` convenience scripts. Real dependencies live in `frontend/package-lock.json` (npm).
- **Why**: Mixed lockfiles confuse installs and reviewers. Both root lockfiles were empty stubs left over from an earlier Next.js/v0 detour.
- **Alternatives**: Switch everything to pnpm — no benefit for a single small frontend.
- **Risk**: None (stubs contained no dependency data).

## 2. Repo hygiene: root .gitignore, untrack node_modules artifacts
- **Change**: Added a root `.gitignore`; removed `node_modules/.package-lock.json` and `node_modules/.pnpm-workspace-state-v1.json` from git tracking.
- **Why**: Generated files must never be tracked; there was no root ignore file to prevent it.
- **Risk**: None.

## 3. Remove framer-motion (user-approved)
- **Change**: Dropped the `framer-motion` dependency; animations are now CSS-only (hover states, one staggered page-load fade, status pulse).
- **Why**: It was used heavily for low-value transitions, added bundle weight, and conflicted with the "minimal, explainable" goal. CSS covers everything the design needs.
- **Alternatives**: Keep but restrain — rejected; a large dependency for 2–3 fades isn't justified.
- **Risk**: Low — visual only.

## 4. Public landing + menu; auth required only at checkout (user-approved)
- **Change**: `/` is a public Home page; `/menu` and `/cart` are public; placing an order redirects unauthenticated users to login (with return path). `/orders` stays user-protected, `/admin/*` becomes admin-protected.
- **Why**: The backend menu endpoint was already public, but the UI hid the whole site behind login. Real restaurant-ordering UX leads with the menu.
- **Risk**: Low — backend contracts unchanged.

## 5. Frontend admin route protection
- **Change**: Added `AdminRoute` (checks `user.isAdmin`) around `/admin/*`; previously any logged-in user could open admin pages (the API rejected their calls, but the UI shouldn't render at all).
- **Why**: Correctness + matches the README's "admin-only protected routes" claim.
- **Risk**: None.

## 6. Add "Cancelled" to backend valid order statuses
- **Change**: Backend `VALID_STATUSES` now includes "Cancelled".
- **Why**: The admin UI already offered "Cancelled" but the backend rejected it — a silent-failure bug. Cancelling is a genuinely useful admin action.
- **Alternatives**: Remove it from the UI — loses functionality instead of fixing the mismatch.
- **Risk**: Low, additive API change only.

## 7. Backend hardening (secrets, validation, errors)
- **Change**: Production fails fast if `SECRET_KEY`/`JWT_SECRET_KEY` are missing (dev warns and uses defaults); explicit 24h JWT expiry; input validation (email format, password ≥ 8 chars, price ≥ 0, quantity ≥ 1, non-empty orders, safe price query parsing); global JSON error handlers; registration no longer echoes raw exception text; duplicated inline admin checks replaced with an `@admin_required` decorator; `requirements.txt` pinned.
- **Why**: Weak default secrets and a `str(e)` leak were the two worst security issues; validation gaps allowed nonsense data (negative prices, zero-quantity orders).
- **Risk**: Low. JWT expiry introduction invalidates currently-issued tokens once (users just log in again).

## 8. Cart persistence via localStorage
- **Change**: `CartContext` syncs to localStorage.
- **Why**: Cart previously vanished on refresh — a real UX bug in an ordering app.
- **Risk**: None.

## 9. Not doing (documented limitations, kept deliberately out of scope)
- **Flask-Migrate/Alembic**: `db.create_all()` is adequate at this scale; migrations add ceremony without interview value here.
- **Rate limiting (Flask-Limiter)**: worth mentioning, not worth a new dependency for this scope.
- **Refresh tokens**: 24h access token is a reasonable trade-off for a demo app.
- **TypeScript / state libraries / React Query**: the app is small; Context + axios is honest and sufficient.

## 10. UI redesign direction
- **Change**: Replaced the inconsistent Gemini redesign (sage/sand palette, framer-motion transitions, inline clamp() styles) with one cohesive design system: warm cream base, espresso text, paprika primary CTA accent, olive secondary, Bricolage Grotesque display + Instrument Sans body, consistent Button/Badge/EmptyState/Skeleton components, CSS-only motion, accessible focus states.
- **Why**: The pushed redesign looked AI-generated and inconsistent; the project needed a confident, food-first, restaurant-ordering identity (inspired by real restaurant sites' hierarchy and CTA clarity, no assets or branding copied).
- **Risk**: Moderate (touches every page) — mitigated by leaving the API layer and contexts' contracts intact and verifying every flow afterwards.
