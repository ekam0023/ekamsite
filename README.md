# Ekam

A one-page site for a "we build your website for you" studio. The WebGPU
"transmission" (glass/refraction) shader is the handmade background; the
content — nav, hero, services, process, and a contact form wired to
Supabase — sits on top of it, built with Next.js 14 App Router + Tailwind.

## Requirements

- Node.js 18.18+ (Next.js 14 minimum)
- A browser with WebGPU enabled to see the background render:
  - Chrome / Edge 113+ (enabled by default)
  - Safari 18+ (macOS 15 / iOS 18)
  - Firefox: behind the `dom.webgpu.enabled` flag as of this writing

If WebGPU isn't available, the background shows an inline error message
instead of a blank canvas; the rest of the site still works normally.

## Local development

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase values
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  layout.tsx              Root layout, fonts, metadata
  page.tsx                Root route — background + all sections
  globals.css              Tailwind directives, focus/selection/motion styles
  transmission/page.tsx    Legacy route from the original shader demo
components/
  TransmissionExample.tsx  Handmade background: mounts canvas, owns renderer lifecycle (untouched)
  SiteNav.tsx              Sticky glass nav bar
  Hero.tsx                 Headline + CTAs
  Services.tsx             What the studio offers
  Process.tsx              4-step "idea to live site" walkthrough
  ContactForm.tsx          Project inquiry form, inserts into Supabase
  ContactSection.tsx       Heading + copy wrapper around the form
  Footer.tsx               Contact email, copyright
lib/
  webgpu/createRenderer.ts WebGPU device/pipeline setup, render loop, dispose() (untouched)
  supabaseClient.ts        Supabase client, reads env vars
```

## Setting up Supabase

1. **Create a project** at [supabase.com](https://supabase.com) → New
   Project.
2. **Get your keys**: Project Settings → API → copy the Project URL and the
   `anon` `public` key.
3. **Add them to `.env.local`** (see `.env.local.example`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. **Create the table** the contact form writes to. In the Supabase SQL
   editor, run:
   ```sql
   create table project_inquiries (
     id uuid primary key default gen_random_uuid(),
     created_at timestamptz not null default now(),
     name text not null,
     email text not null,
     phone text,
     project_type text not null,
     budget text not null,
     message text not null
   );

   alter table project_inquiries enable row level security;

   -- Allow anyone (using the public anon key) to submit an inquiry...
   create policy "Anyone can submit an inquiry"
     on project_inquiries for insert
     to anon
     with check (true);

   -- ...but nobody can read them back with the public key.
   -- View submissions from the Supabase Table Editor (which uses your
   -- account, not the anon key) instead.
   ```
5. **Test it**: run the app, submit the form, then check Table Editor →
   `project_inquiries` in Supabase for the new row.
6. **Deploying**: add the same two `NEXT_PUBLIC_...` env vars in your
   host's dashboard (e.g. Vercel → Project Settings → Environment
   Variables) before deploying.

Note: this form only ever asks for name, email, phone, and project details —
never a password. Nothing in this project stores or transmits anyone's real
account credentials, and it shouldn't be extended to do so.

## How it works

- `createRenderer({ canvas })` requests a GPU adapter/device, configures the canvas's
  WebGPU context, and builds a single-pipeline fullscreen triangle with a
  time-animated refraction shader (WGSL).
- `renderer.ready` is a promise that resolves once the device and pipeline are
  initialized, or rejects if WebGPU isn't supported — the component surfaces
  that rejection as an error message.
- `renderer.dispose()` cancels the animation frame loop, disconnects the
  `ResizeObserver`, destroys the uniform buffer, unconfigures the canvas
  context, and destroys the GPU device. It's called from the component's
  `useEffect` cleanup, so navigating away or unmounting releases all GPU
  resources deterministically.

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, click **Add New → Project**, import the repo, and accept the
   default Next.js build settings (`next build` / `.next` output) — no
   environment variables or extra config are required.
3. Deploy. Because everything here runs client-side in `useEffect`, there are
   no server-side WebGPU concerns — the canvas simply renders once the page
   loads in a WebGPU-capable browser.
