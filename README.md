# The Gallery — Item Gallery Website

A clean, fast, mobile-first gallery site. Customers browse items in a grid,
open any item to see more photos, and read exactly what's included in each set.

You manage everything **from a built-in editor on the site** — add, edit, and
remove items and upload photos with no code. The editor is protected by a login,
so only approved people can make changes.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS**, with
**Supabase** (Postgres + Auth + Storage) holding your items, logins, and images.
Deploys to **Vercel**.

---

## Quick start (run it locally)

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>. The admin editor is at
<http://localhost:3000/admin>.

The Supabase connection keys are already set in `.env.local`. (If you clone this
project fresh, copy `.env.example` to `.env.local` and fill in the values from
your Supabase project → Settings → API.)

To check the production build before deploying:

```bash
npm run build
npm run start
```

---

## First-time setup: create your admin login

Your items live in Supabase, and only **approved admins** can edit them. Your
email is already on the approved list, so you just need to create the account:

1. Open your Supabase project dashboard → **Authentication** → **Users**.
2. Click **Add user** → **Create new user**.
3. Use the email **`sgtstutter17@gmail.com`** and pick a password. Tick
   "Auto Confirm User" if shown.
4. Done — that account is automatically granted admin access.

Now visit `/admin/login`, sign in, and you'll land on the editor.

> Anyone else who signs up does **not** get edit access — only emails on the
> approved list become admins (see "Adding more admins" below).

---

## Managing items (no code)

Everything happens in the editor at **`/admin`**:

- **Add an item** — click **Add item**, fill in the title, category,
  description, included items, upload photos, then **Create item**.
- **Edit an item** — click **Edit** next to it, change anything, **Save changes**.
- **Remove an item** — click **Delete**, then **Confirm**. (Or untick
  "Visible on the public site" to hide it without deleting.)
- **Photos** — in the form, click **Upload photos** to add images from your
  device. Click any photo to make it the **cover** (shown on the gallery card).
  Click **Remove** under a photo to drop it. Uploaded photos are stored in
  Supabase and cleaned up automatically when you delete an item.

Changes appear on the public site immediately.

### Adding more admins

1. In Supabase → **Table Editor** → `admin_allowlist`, add a row with the
   person's email. (Or run SQL: `insert into admin_allowlist (email) values ('them@example.com');`)
2. Create their account under **Authentication → Users** (or have them sign up).
   They become an admin automatically.

---

## Changing your branding (colors)

All colors are defined in **one place**: the `:root` block at the top of
[`src/app/globals.css`](src/app/globals.css).

```css
:root {
  --brand-paper:   #f6f2ea;  /* page background        */
  --brand-surface: #fffdf8;  /* cards & panels         */
  --brand-ink:     #1d1b16;  /* primary text           */
  --brand-muted:   #716b5e;  /* secondary text         */
  --brand-line:    #e6ddcf;  /* borders & dividers     */
  --brand-accent:  #b1431f;  /* buttons, tags, links   */
  --brand-accent-ink: #fff8f2; /* text on the accent   */
  --brand-radius:  0.5rem;   /* corner roundness       */
}
```

Change a value, save, and the whole site updates. Fonts are set in
[`src/app/layout.tsx`](src/app/layout.tsx); the site name/tagline are in
[`src/app/page.tsx`](src/app/page.tsx).

---

## Deploying to Vercel

1. Push this project to a **GitHub** repository (see below).
2. Go to <https://vercel.com/new> and **import** that repository.
3. Add these **Environment Variables** (Vercel → Project → Settings →
   Environment Variables) — copy the first two from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → your live URL, e.g. `https://your-site.vercel.app`
4. Click **Deploy**. Every future `git push` redeploys automatically.

### Push to GitHub

```bash
git init
git add .
git commit -m "Item gallery with in-site editor"
git branch -M main
git remote add origin https://github.com/<you>/<your-repo>.git
git push -u origin main
```

`.env.local` is gitignored, so your config isn't committed — that's why you set
the same variables in Vercel.

---

## How the login is kept secure

- The keys in `.env.local` are **public client keys** — safe to expose. They can
  only do what the database's Row-Level Security rules permit.
- **Reading** items is public (only items marked visible). **Creating, editing,
  and deleting** require a logged-in account that is on the admin allowlist —
  enforced by the database itself, not just the UI.
- Image uploads/deletes are likewise restricted to admins.

---

## Project structure

```
finished-product/
├── public/items/<slug>/...     ← seed placeholder images (replaceable)
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← fonts, global SEO
│   │   ├── globals.css         ← BRAND COLORS live here
│   │   ├── page.tsx            ← home / gallery (reads from Supabase)
│   │   ├── not-found.tsx       ← custom 404
│   │   ├── items/[slug]/page.tsx   ← item detail page
│   │   └── admin/
│   │       ├── login/page.tsx          ← sign-in
│   │       ├── actions.ts              ← create/update/delete (server, auth-checked)
│   │       └── (protected)/            ← requires a valid admin session
│   │           ├── layout.tsx          ← auth gate + admin nav
│   │           ├── page.tsx            ← item list (dashboard)
│   │           └── items/new, items/[id]/edit
│   ├── components/
│   │   ├── ItemCard.tsx, ImageGallery.tsx, SearchAndFilter.tsx, Gallery.tsx
│   │   └── admin/ItemForm.tsx, DeleteItemButton.tsx
│   ├── lib/
│   │   ├── items.ts            ← reads/maps items from Supabase
│   │   └── supabase/           ← browser + server + proxy clients
│   └── proxy.ts                ← refreshes session, guards /admin
├── .env.local                  ← Supabase keys (gitignored)
└── package.json
```

## Features

- Responsive gallery grid, live search, category filters, friendly empty state
- Detail page with image gallery, thumbnails, keyboard arrows, "what's included"
- **In-site editor** (`/admin`) to add / edit / remove items and upload photos
- **Email + password login**, admin access limited to an approved allowlist
- Items, logins, and images stored in Supabase (Postgres + Auth + Storage)
- Image optimization via `next/image`; per-item SEO + Open Graph; custom 404
- One-place branding colors
```
