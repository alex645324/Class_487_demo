
# Career Readiness Gamification Platform

A fun, interactive web‑based platform for Penn State Abington students to discover their career energy, complete quests, earn badges, attend events, and communicate with counselors. All activities help students grow their career and professional skills, preparing them for life after college – aligned with the NACE Career Readiness framework.

## Features

- **Onboarding & Personalization** – New users fill in their name, year, major, and graduation year.
- **Career Energy Quiz** – A 6‑question quiz determines one of five energy types (Explorer, Builder, Connector, Creator, Strategist).
- **Quest Map** – 6 levels: Interests, Skills (NACE competencies), Strengths, Values, Careers. Each level awards points and badges.
- **Points & Badges** – Milestone badges (100, 200, 300, 400, 500, 1000, 2000 points) and level‑specific badges. Admins can create additional quests and badges.
- **Activity Log** – Students log internships, workshops, clubs, events, etc., earning points.
- **Events Page** – Real Penn State Abington events (April – September 2026) with attendance logging.
- **Resume Upload** – Upload a resume for counselor feedback.
- **Social Feed** – Share achievements; admins can moderate.
- **Messaging** – Students can message counselors; counselors can reply and mark messages as read/unread.
- **Admin Dashboard** – Manage users, quests, badges, social feed, and view analytics.
- **Counselor Dashboard** – View student progress, give resume feedback, change user roles.
- **Career Roadmap** – Personalized summary of energy type, interests, strengths, NACE skills, values, and saved careers.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Language**: TypeScript

## Setup Instructions (You can also run this software through this link without needing to download anything: https://alex645324.github.io/Class_487_demo/ )

1. **Clone the repository**  
   `git clone <repo-url> && cd <project-folder>`

2. **Install dependencies**  
   `npm install`

3. **Configure Firebase**  
   - Create a Firebase project.
   - Enable Authentication (Email/Password), Firestore, and Storage.
   - Copy your Firebase config into a `.env.local` file:

     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the development server**  
   `npm run dev`

5. **Open** `http://localhost:3000`

## App Flow (Student)

1. Sign in with a Penn State email (case‑insensitive).
2. Complete the onboarding form (name, year, major, graduation year).
3. Take the 6‑question Career Energy Quiz.
4. Complete the environment challenge.
5. Explore the **Quest Map** (6 levels). Each level awards points and a badge.
6. Log activities, attend events, upload a resume, and post achievements.
7. View all earned badges and completed quests in **Achievements**.
8. Check the **Career Roadmap** for a personalized action plan.

## Default Roles

- **Student** – Default role after signup. Can complete quests, log activities, attend events, etc.
- **Counselor** – Must be set by an admin. Can view student progress, give resume feedback, send messages.
- **Admin** – Must be set by an admin (or directly in Firestore). Full access to manage users, quests, badges, feed, analytics.

## Project Structure (Simplified)

```
├── app/
│   ├── admin/           # Admin dashboard & analytics
│   ├── counselor/       # Counselor dashboard & messages
│   └── student/         # Student pages (home, quest-map, achievements, etc.)
├── components/          # Reusable UI components
├── lib/                 # Firebase config, Firestore helpers, data models
├── public/              # Static assets (e.g., logo)
└── ...
```

## Implementation Principles

- **Mobile‑first** – Designed for a maximum width of `max-w-md`.
- **Color palette** – Penn State dark blue (`#1E407C`), light blue background (`bg-blue-50`), white cards.
- **Minimal & reusable** – Follows the MVVM pattern, reuses existing logic, avoids unnecessary dependencies.

## Credits

Developed as a final project for CMPSC 487W at Penn State Abington.
