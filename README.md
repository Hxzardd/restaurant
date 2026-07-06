# Restaurant Online Ordering System

A full-stack restaurant ordering website — browse the menu, build a cart, place orders, and track them, with a separate admin flow for managing the menu and order statuses.

**Live:** https://restaurant.hxzard.com

> Built for ACM Round 2 with React + Flask.

---

## Screenshots

*(Coming soon — run locally to explore, or visit the live link.)*

---

## Features

### Customer
- Public landing page and menu — no account needed to browse
- Search dishes by name; filter by category (Veg / Non-Veg) and price range (all server-side)
- Cart with quantity controls, persisted in localStorage across refreshes
- Login required only at checkout (redirects back to your cart after signing in)
- Order history with live status (Pending → Preparing → Ready → Delivered / Cancelled)

### Admin
- Add, edit, and delete menu items
- View all customer orders
- Update order status; customers are emailed when their order is **Ready**
- Admin-only routes enforced on both the frontend (route guards) and backend (JWT claims)

### Security
- Password hashing (Werkzeug PBKDF2), passwords ≥ 8 characters
- JWT auth with explicit 24-hour expiry; role carried as a token claim
- Admin authorization via an `@admin_required` decorator on every admin endpoint
- Input validation server-side (email format, prices ≥ 0, quantities ≥ 1)
- Consistent JSON error responses; no stack traces leak to clients
- Production refuses to start without real secrets (`SECRET_KEY`, `JWT_SECRET_KEY`, `DATABASE_URL`)
- CORS restricted to known origins

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Axios, React Router |
| Backend | Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-Mail, Gunicorn |
| Database | SQLite (development), PostgreSQL / NeonDB (production) |
| Hosting | Render (frontend static site + backend web service) |

---

## Architecture

```
frontend/src/
  api/axios.js        # single axios instance: base URL + JWT interceptor
  components/         # Navbar, Footer, ui/ (Badge, EmptyState)
  context/            # AuthContext (JWT session), CartContext (localStorage cart)
  routes/             # ProtectedRoute, AdminRoute guards
  pages/              # Home, Menu, Cart, Orders, Login, Signup, AdminMenu, AdminOrders, NotFound

backend/
  app/
    __init__.py       # app factory, CORS, blueprints, global JSON error handlers
    config.py         # env-driven config, fails fast in production without secrets
    extensions.py     # db / jwt / mail singletons
    models/           # User, MenuItem, Order, OrderItem
    routes/           # auth, menu, orders blueprints
    utils/            # admin_required decorator, validators, email helper
  run.py              # local dev server
  wsgi.py             # gunicorn entry point
  seed_menu.py        # seeds 31 menu items
```

Key design points:
- **Server-side filtering** — the menu endpoint accepts `q`, `category`, `min_price`, `max_price` query params so the frontend stays thin.
- **Price snapshots** — `OrderItem` stores the price at order time, so later menu edits don't rewrite order history.
- **Role claims in JWT** — `is_admin` travels inside the token; the backend re-checks it on every admin route, the frontend uses it for route guards and UI.

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Get JWT |
| GET | `/menu` | — | List menu items (`?q=&category=&min_price=&max_price=`) |
| POST | `/menu` | Admin | Add menu item |
| PUT | `/menu/<id>` | Admin | Update menu item |
| DELETE | `/menu/<id>` | Admin | Delete menu item |
| POST | `/orders` | User | Place order `{items: [{menu_item_id, quantity}]}` |
| GET | `/orders/my` | User | Own order history |
| GET | `/orders/all` | Admin | All orders |
| PUT | `/orders/<id>/status` | Admin | Update status (Pending / Preparing / Ready / Delivered / Cancelled) |

---

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows  (source .venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
copy .env.example .env         # then edit values
python seed_menu.py            # optional: seed the menu
python run.py                  # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env         # defaults to the local backend
npm run dev                    # http://localhost:5173
```

### Environment variables

See [`backend/.env.example`](backend/.env.example) and [`frontend/.env.example`](frontend/.env.example). In production the backend **requires** `FLASK_ENV=production`, `SECRET_KEY`, `JWT_SECRET_KEY`, and `DATABASE_URL` — it will refuse to start otherwise.

---

## Production Deployment (Render)

- **Backend:** web service, build `pip install -r requirements.txt`, start `gunicorn wsgi:app`
- **Frontend:** static site, build `npm run build`, publish `dist/`, with `VITE_API_BASE_URL` pointing at the backend
- **Database:** NeonDB PostgreSQL via `DATABASE_URL` (SSL required, connection pooling configured)

> Note: Render blocks outbound SMTP, so "Ready" emails fail safely (logged, never crash the request). They work in local development with real mail credentials.

---

## Verification Checklist

- [ ] Backend and frontend start locally; `npm run build` and `npm run lint` pass
- [ ] Register (password ≥ 8 chars) and login work
- [ ] Menu loads publicly; search, category chips, and price filters work
- [ ] Cart add/remove/update works and survives a refresh
- [ ] Placing an order while logged out redirects to login, then back to cart
- [ ] Non-admin users are redirected away from `/admin/*` (and the API returns 403)
- [ ] Admin can create/edit/delete menu items and update order statuses (incl. Cancelled)
- [ ] Mobile layout and keyboard navigation work

---

## Known Limitations

- No database migrations (`db.create_all()` only) — fine at this scale, Alembic would be the next step
- No rate limiting on auth endpoints
- Single 24h access token (no refresh-token rotation)
- Menu photos are placeholder images cycled per item; a real deployment would store per-item image URLs

## What This Project Demonstrates

- A complete full-stack flow: React SPA ↔ REST API ↔ relational DB, deployed to production
- JWT authentication with role-based access enforced at both layers
- ORM modeling with relationships, cascades, and point-in-time price snapshots
- Environment-driven configuration with dev/prod separation and fail-fast validation
- A cohesive, accessible Tailwind design system (consistent buttons, badges, empty/loading/error states)

See [`DECISIONS.md`](DECISIONS.md) for the log of major design and engineering decisions, including why the UI was rebuilt around a premium-casual restaurant identity rather than a generic template.
