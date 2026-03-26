// lib/storage.ts
// Handles saving and loading user data to localStorage.
// Used to persist quiz answers, energy type, challenge selections, and user info.

import { EnergyType } from "./data";

// ============================================================
// My thought process:
// I chose localStorage because it's simple, works without a backend,
// and persists across page refreshes. For a demo, this is ideal.
// In production, we'd replace this with a database and user authentication.
// ============================================================

export interface UserData {
  answers: EnergyType[];
  energyType: EnergyType | null;
  challengeSelections: string[];
  points: number;
  badges: string[];
  user?: {
    email: string;
    name: string;
    isAuthenticated: boolean;
  };
}

// I'm using a single key for all users because this is a demo.
// In a real app, I'd use a key that includes the user's email to separate data.
const STORAGE_KEY = "career-energy-user";

// 1. Save user data (merges with existing)
// This function merges new data with existing data instead of overwriting,
// so we don't accidentally lose progress when saving only part of the user's info.
export function saveUserData(data: Partial<UserData>) {
  console.log("[storage] Saving user data:", data);
  const existing = loadUserData();
  const updated = { ...existing, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// 2. Load user data from localStorage
// If no data exists, return default values so the app doesn't crash.
// This provides a clean starting point for new users.
export function loadUserData(): UserData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    console.log("[storage] No existing data, returning defaults");
    return {
      answers: [],
      energyType: null,
      challengeSelections: [],
      points: 0,
      badges: [],
    };
  }
  const parsed = JSON.parse(stored);
  console.log("[storage] Loaded data:", parsed);
  return parsed;
}

// 3. Calculate total points based on completed actions
// Points are awarded for completing the quiz (100) and the challenge (50).
// This is a simple gamification element that can be expanded later.
export function calculatePoints(userData: UserData): number {
  let points = 0;
  if (userData.answers.length > 0) points += 100;   // quiz completed
  if (userData.challengeSelections.length > 0) points += 50; // challenge completed
  console.log(`[storage] Calculated points: ${points}`);
  return points;
}

// 4. Award badges based on completed actions
// Badges give visual recognition for milestones.
// I used emoji-based badges to make them fun and engaging.
export function getBadges(userData: UserData): string[] {
  const badges: string[] = [];
  if (userData.answers.length > 0) badges.push("🎓 First Quiz");
  if (userData.challengeSelections.length > 0) badges.push("🌍 Explorer");
  if (userData.energyType) badges.push(`⚡ ${userData.energyType}`);
  console.log("[storage] Badges earned:", badges);
  return badges;
}