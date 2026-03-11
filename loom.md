# 🎬 Loom Video Submission Guide: SnippetVault

This script is optimized to highlight the core architecture, high-performance UI, and the recently added **Public Explore** features. Aim for a **5-7 minute** professional walkthrough.

---

## 🕒 0:00 - 1:00 | Segment 1: Introduction
**Directly to Camera (Face Visible)**
- **Greeting**: "Hello! I'm **Piyush Rajput**, joining you from **Indore, MP**."
- **Education**: "I'm a final-year **Computer Science Engineering student** at the Indore Institute of Science and Technology, graduating in 2026."
- **Technical Focus**:
    - "I specialize in **Frontend Engineering** with **React and Next.js**, and I have a deep interest in building performant, type-safe web applications."
    - "My background includes internships at **Param Info** and **Alphanext**, where I developed AI-driven automation and modern full-stack solutions."
    - "In this project, I've prioritized **zero-lint production-ready code** and a **premium developer experience**."

---

## 🕒 1:00 - 2:00 | Segment 2: Project Vision & Architecture
**Switch to Screen + Camera (Bubble)**
- "I’m presenting **SnippetVault**—a high-performance, secure code snippet manager for modern developers."
- "The core architectural principle was **separation of concerns**: I've created a private, authenticated workspace for personal management and a public-facing domain for discovery and sharing."
- "Technically, it's built on **Next.js 16**, **Supabase**, and **Tailwind CSS**, with **TanStack Query** for robust state management and caching."

---

## 🕒 2:00 - 3:30 | Segment 3: The Private Workspace (Dashboard)
**Live Demo of Dashboard**
- **Protected Routes**: "I used Next.js Middleware and Supabase Auth to protect the `/dashboard`. It's fast, secure, and intuitive."
- **Live Search & Filtering**: "Notice how searching for 'React' or filtering by tags is instantaneous. I've implemented **Zustand** for lightweight global UI state and memoized filtering to ensure performance doesn't degrade as the vault grows."
- **CRUD Operations**: "Creating a snippet is seamless with real-time validation. I used **react-hook-form** with **Zod** schema validation to ensure data integrity at every step."
- **UX Details**: "I used **Sonner** for beautiful, non-intrusive feedback and **alertDialogs** for destructive actions, providing a safe and premium feel."

---

## 🕒 3:30 - 4:45 | Segment 4: Public Discovery (The Explore Page)
**Navigate to `/explore`**
- "New in this version is the **Public Explore page**. This is where shared knowledge comes alive. Anyone can browse, search, and discover code snippets shared by the community."
- "This demonstrates the **public-facing side** of SnippetVault. It uses a specialized public API layer and optimized caching to serve shared content without requiring authentication."
- "Clicking on an author's profile (`/u/[username]`) takes you to their curated public collection, while individual snippets (`/s/[id]`) provide a focused view with premium syntax highlighting."

---

## 🕒 4:45 - 6:00 | Segment 5: Technical Excellence & Design
- **Syntax Highlighting**: "The preview is powered by **react-syntax-highlighter** with the Prism engine and a custom atom-dark theme, delivering an IDE-grade visual experience."
- **Code Quality**: "One thing I'm particularly proud of is the codebase itself. I've achieved a **zero-lint, zero-error build**, ensuring high stability and maintainability using strict TypeScript types."
- **Premium Aesthetics**: "The design uses a **deep-space aesthetic with glassmorphism** and subtle **Framer Motion** animations. It's built for developers who appreciate a clean, high-end workspace."
- **Security (RLS)**: "Under the hood, **Supabase Row Level Security (RLS)** ensures that private snippets remain private, while shared snippets are globally accessible based on the `is_public` flag."

---

## 🕒 6:00 - 6:30 | Segment 6: Conclusion
**Back to Full Camera**
- "SnippetVault is a complete, production-ready solution that combines security, speed, and standard-compliant architecture."
- "I've focused on making it a tool I would actually use daily to secure and share my knowledge."
- "Thank you for your time and for reviewing my submission!"

---

### ✅ Preparation Checklist:
1. [ ] **Environment**: Ensure `.env.local` is set and you have public snippets in your DB.
2. [ ] **Seed Data**: Run `seed_data.sql` so the Explore and Dashboard pages are populated.
3. [ ] **Resolution**: Record in 1080p.
4. [ ] **Flow**: Open the Dashboard, Explore page, and a public snippet in separate tabs beforehand for smooth transitions.
