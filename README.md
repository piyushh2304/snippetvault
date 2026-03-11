# 💎 SnippetVault

<p align="center">
  <img src="docs/assets/logo.png" width="120" alt="SnippetVault Logo">
</p>

<p align="center">
  <strong>The premium code snippet manager for modern developers.</strong><br>
  Secure, elegant, and blazing fast.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Supabase-Database-emerald?style=for-the-badge&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
</p>

---

## 🔗 Live Demo
**[Vercel Live Deployment](https://snippetvault-rho.vercel.app/)**

---

![SnippetVault Hero](docs/assets/hero-banner.png)

## ✨ Features

- **🚀 Instant Organization**: Tag and categorize your logic with a multi-tag system.
- **🔐 Secure by Design**: Built on Supabase with robust **Row Level Security (RLS)**.
- **🎨 Premium UI**: A dark-themed, glassmorphic interface inspired by the best developer tools.
- **🎬 Fluid Animations**: Powered by **Framer Motion** for a high-end feel.
- **📱 Responsive**: Perfectly optimized for desktop and mobile workflows.
- **🌐 Public Profiles**: Showcase your collection with a personalized public profile page.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [TanStack Query](https://tanstack.com/query) & [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/snippetvault.git
cd snippetvault
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Setup (Supabase Configuration)
1. **Initialize DB**: Run `supabase_setup.sql` in your Supabase SQL Editor. 
   - This script creates `profiles`, `snippets`, `tags`, and `snippet_tags` tables.
   - It sets up a trigger to automatically create a profile on user signup.
2. **Row Level Security (RLS)**: 
   - **Profiles**: Publicly readable, only editable by the owner.
   - **Snippets**: Private by default; only owners can full CRUD. Public snippets (`is_public = true`) are readable by anyone.
3. **Storage**: Create a bucket called `avatars` if you plan to enable profile picture uploads (optional feature ready).
4. **Seed Data**: Run `seed_data.sql` to populate your vault with 8+ professional examples.

### 4. Run Development Server
```bash
npm run dev
```

## 🏗️ Architectural Decisions & Trade-offs

- **Zustand for Global UI State**: Chose Zustand for its minimal boilerplate and ease of use in managing modals and sidebar states compared to Redux or Context API.
- **App Router & Server Actions**: Used Next.js App Router for superior performance and built-in SEO. Most data-fetching is client-side via TanStack Query to provide a highly interactive, "App-like" feel in the dashboard.
- **Glassmorphism Design**: Opted for a "dark-mode only" premium aesthetic to focus the visual experience on the code blocks and high-contrast blue accents.
- **Trade-off: Client-Side Syntax Highlighting**: While it adds to the bundle size, we use `react-syntax-highlighter` on the client for the most accurate and real-time syntax highlighting during editing.

## 📦 Deployment

SnippetVault is optimized for **Vercel**. 

### Quick Deploy
1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the following [Environment Variables](file:///C:/Users/piyus/.gemini/antigravity/brain/73e8bf33-d452-424d-9b44-6cadde07483f/deployment_guide.md):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

<p align="center">
  Built with ❤️ by the SnippetVault Team
</p>
