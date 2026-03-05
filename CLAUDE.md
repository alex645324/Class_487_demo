# Career Energy Discovery App

## What This Is
A fun, interactive self-discovery web app that helps students explore their career energy type through a Duolingo-style quiz and challenge system. Built as a class demo (Class 487).

## Tech Stack
- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- No backend — fully client-side

## Project Structure
```
app/
  layout.tsx      — Root layout, viewport config, fonts
  page.tsx        — Main page, screen state machine
  globals.css     — Global styles, rainbow gradient utility
components/
  OpeningScreen   — Welcome screen with Start button
  QuizScreen      — 6-question tap-choice quiz with progress bar
  ResultScreen    — Energy type result + Level 1 complete
  ChallengeScreen — Environment picker + personalized reflection
  QuestMap        — Visual-only level progression (Levels 2-5 locked)
lib/
  data.ts         — Quiz questions, energy types, scoring logic
tools/
  P.md            — Implementation principles (MUST follow)
```

## App Flow
Opening → Quiz (6 questions) → Result (energy type) → Challenge → Quest Map

## Energy Types
Explorer, Builder, Connector, Creator, Strategist — determined by quiz answers.

## Design Rules
- **Mobile-first** (max-w-md, designed for iOS Simulator)
- **Color palette**: Black, white, gray only — except progress bars which use `.bg-rainbow`
- Rainbow = `linear-gradient(to right, red, orange, yellow, green, blue, purple)`

## Commands
- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build

## Implementation Rules (from P.md)
- Follow MVVM, simplest possible
- Bare minimum scope — reduce until it breaks
- Reuse before adding new code
- Confirm plan before coding each step
- Never touch unrelated functionality
- Simplify over complexity — always
