# 🎬 Loom Video Submission Guide: SnippetVault

Follow this script to ensure your video strictly follows the mandate. Aim for a **5-7 minute** duration.

---

## 🕒 0:00 - 1:00 | Segment 1: Introduction
**Directly to Camera (Face Visible)**
- **Greeting**: "Hi, I'm **Piyush Rajput**, currently based in **Indore, MP**."
- **Education**: "I am a **Computer Science Engineering graduate** from the Indore Institute of Science and Technology (Expected 2026)."
- **Experience Summary**:
    - "I have hands-on experience in **Frontend Development** using **React and Next.js**, specifically building high-performance UIs with **Tailwind CSS and shadcn/ui**."
    - "My backend expertise includes working with **Node.js** and **Supabase**, where I've implemented complex **Row Level Security (RLS)** and authentication flows."
    - "In my previous internships at **Param Info** and **Alphanext**, I built AI-driven automation tools and full-stack MERN applications."

---

## 🕒 1:00 - 1:45 | Segment 2: Project Overview
**Switch to Screen + Camera (Bubble)**
- "Today, I’m presenting **SnippetVault**—a premium code snippet manager for developers."
- "The goal was to create a focused alternative to GitHub Gists where users can save, search, and share logic effortlessly."
- "The app features two distinct modes: an **Authenticated Workspace** for personal management and **Public-facing Profile pages** for community sharing."

---

## 🕒 1:45 - 3:30 | Segment 3: Implementation Walkthrough
**Live Demo of Dashboard**
- **Authentication**: Show the Login/Signup pages. "I implemented authentication using **Supabase Auth**. I used Next.js Middleware to ensure protected routes for the dashboard while keeping public snippets accessible to everyone."
- **Dashboard Features**:
    - **Create**: Click 'Create Snippet'. Show the form with validation.
    - **Search & Filter**: Type in the search bar and click a tag (e.g., 'React'). "I used **Zustand** for global UI state and **memoized filtering** to ensure the search remains snappy even with hundreds of snippets."
    - **Edit/Delete**: Show the edit sheet and the **AlertDialog** for safe deletion. "I focused on UX feedback here, using **Sonner** for toast notifications and confirmation dialogs."

---

## 🕒 3:30 - 4:45 | Segment 4: Sharing Mechanisms
**Show the Sharing Sheet**
- **Public URL**: "Every snippet has a unique public URL. If the snippet is toggled to 'Public', anyone with the link can view it."
- **Specific User Sharing**: "I built a collaboration feature using a `snippet_shares` table in Supabase. You can invite other users via email."
- **Image Export**: Click 'Export as Image'. "I used **html-to-image** to generate professional code preview images, perfect for sharing on social media or documentation."
- **Clipboard Sharing**: Show the 'Copy Link' button. "I implemented the Clipboard API with immediate visual feedback."

---

## 🕒 4:45 - 6:00 | Segment 5: Technical Decisions & UX
- **Syntax Highlighting**: Open a public snippet page (`/s/[id]`). "For the code preview, I used **react-syntax-highlighter** with the Prism engine and a custom atom-dark theme to provide a high-end IDE feel."
- **UX Features**: Point out the loading states and the glassmorphism design. "I used **Tailwind CSS** for a deep-theme aesthetic and **Lucide React** for consistent iconography."
- **Architecture**:
    - "I chose **Next.js 16** for its powerful App Router and Server Components."
    - "The data fetching is handled by **TanStack Query (v5)**, allowing for efficient caching and optimistic updates (like during snippet deletion)."
    - "The database is **PostgreSQL on Supabase**, secured with granular **RLS policies** to protect private snippets while allowing public visibility for shared collections."

---

## 🕒 6:00 - 6:30 | Segment 6: Conclusion
**Back to Full Camera**
- "SnippetVault isn't just a basic CRUD app; it's a production-ready tool focused on security, speed, and standardizing the developer sharing experience."
- "Thank you for reviewing my submission. I look forward to the next steps!"

---

### ✅ Checklist Before You Hit Record:
1. [ ] **Lighting**: Is your face clearly lit?
2. [ ] **Audio**: Are you using a clear microphone?
3. [ ] **Seed Data**: Have you run `seed_data.sql` so your dashboard looks full?
4. [ ] **Public Snippet**: Ensure at least one snippet is set to **Public** for the demo.
5. [ ] **Loom Pro Tip**: Record in High Definition (1080p if possible).
